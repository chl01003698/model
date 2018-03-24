import * as mongoose from 'mongoose';
import * as autoIncrement from '../extend/autoIncrement';
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const CuratorGroupSchema = new Schema({
  name: { type: String, default: '' },
  type: { type: Number, default: 0 },            // 0:默认群，1:普通群
  members: [{ type: ObjectId, ref: 'User' }],    // 群成员
  memberCount: { type: Number, default: 0 },     // 群成员总数
  curator: { type: ObjectId, ref: 'Curator' }
}, {timestamps: true})

CuratorGroupSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Curator' })
CuratorGroupSchema.plugin(mongoose_delete)

/**
 * 创建默认群组
 */
CuratorGroupSchema.statics.createDefaultGroup = async function(curator:string){
  const group = await this.create({'curator':mongoose.Types.ObjectId(curator),'name':'我的群组','type':0});
  return group._id;
}
/**
 * 添加默认群组成员
 */
CuratorGroupSchema.statics.insertDefaultGroupMember = async function(curator:string,member:string){
  return this.findOneAndUpdate(
    {
      'curator':mongoose.Types.ObjectId(curator),
      'type':0
    },
    {
      '$addToSet':
      {
        'members':mongoose.Types.ObjectId(member)
      },
      '$inc':{
        'memberCount':1
      }
    },
    {new:true}
  ).select('members').exec()
}
/**
 * 创建普通群组
 */
CuratorGroupSchema.statics.createCommonGroup = async function(curator:string,name:string){
  const group = await this.create({'curator':mongoose.Types.ObjectId(curator),'name':name,'type':1});
  return group._id;
}
/**
 * 更新群组名称
 */
CuratorGroupSchema.statics.updateGroupName = function(groupId:string,name:string){
  return this.update({_id:mongoose.Types.ObjectId(groupId)},{$set:{'name':name}}).exec()
}
/**
 * 批量增加群组成员
 */
CuratorGroupSchema.statics.insertMembers = function(groupId:string,members:Array<string>){
  return this.findOneAndUpdate(
    {_id:mongoose.Types.ObjectId(groupId)},
    {
      '$addToSet':
      {
        'members':
        {
          '$each':members
        }
      }
    },
    {new:true}
  ).select('members memberCount').exec()
}
/**
 * 批量删除群组成员
 */
CuratorGroupSchema.statics.removeMembers = function(groupId:string,members:Array<string>){
  return this.findOneAndUpdate(
    {_id:mongoose.Types.ObjectId(groupId)},
    {
      '$pullAll':
      {
        'members':members
      }
    },
    {new:true}
  ).select('members').exec()
}
/**
 * 更新群组成员总数
 */
CuratorGroupSchema.statics.updateMemberCount = async function(groupId:string){
  const result = await this.findOne({'_id':groupId}).select('members').exec()
  if(result){
    return await this.findOneAndUpdate({'_id':groupId},{'$set':{'memberCount':result.members.length}},{new:true})
    .select('-_id memberCount')
    .exec()
  }
  return null;
}
/**
 * 获取群组列表
 */
CuratorGroupSchema.statics.getGroups = function(curator:string){
  return this.find({'curator':mongoose.Types.ObjectId(curator)})
  .select('type name memberCount members')
  .exec()
}
/**
 * 获取群组成员列表
 */
CuratorGroupSchema.statics.getGroupMembers = function(groupId:string){
  return this.findById(groupId)
  .populate("members", ' _id nickname headimgurl shortId ')
  .select('-_id members memberCount')
  .exec()
}

/**
 * 删除指定群组
 */
CuratorGroupSchema.statics.removeGroup = function(groupId:string){
  return this.remove({_id:mongoose.Types.ObjectId(groupId)}).exec()
}

/**
 * 删除指定馆长所有群组中的指定成员
 */
CuratorGroupSchema.statics.removeMemerInAllGroup = async function(curator:string,member:string){
  const groups = await this.getGroups(curator);
  if(groups==null) return null;
  const length = groups.length;
  const tasks = new Array();
  for(let x=0;x<length;x++){
    await this.removeMember(groups[x]._id,member);
    const task = this.updateMemberCount(groups[x]._id);
    tasks.push(task);
  }
  const result = await Promise.all(tasks);
  return result;
}
/**
 * 删除群组中指定成员
 */
CuratorGroupSchema.statics.removeMember = function(groupId:string,member:string){
  console.log('groupId=>',groupId,member);
  return this.update(
    {'_id':groupId},
    {
      '$pull':{'members':member}
    }
  ).exec()
}


export default (app) => {
  return app.mongoose.model('CuratorGroup', CuratorGroupSchema);
};