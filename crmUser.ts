import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as autoIncrement from '../extend/autoIncrement';
import * as friends from 'mongoose-friends'
import * as findOrCreate from 'mongoose-findorcreate'
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'
import * as _ from 'lodash'
import { isNumber } from 'util';
import * as mongoose_mpath from 'mongoose-mpath'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

//
export const CrmUserSchema = new Schema({
  userId: { type: String, default: '', index: true },//账号
  password: { type: String, default: '' },
  basicSalary: { type: Number, default: 0 },
  userName: { type: String, default: '' },
  gender: { type: Number, default: '' },
  age: { type: Number, default: '' },
  identityCard: { type: String, default: '' },
  province:{ type: String, default:''},
  city: { type: String, default: '' },
  wechatId: { type: String, default: '' },
  isFreeze: { type: Number, default: 0 },//0:未冻结 1:冻结
  spreadUrl: { type: String, default: '' },//推广url -->生成二维码
  teams: { type: ObjectId, ref: 'CrmTeam'} ,// 用户所属组织列表
  role: {type: ObjectId, ref: 'CrmRole'}
  
}, {timestamps: true})

CrmUserSchema.plugin(QueryPlugin);
CrmUserSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmUser' });
CrmUserSchema.plugin(mongoose_delete);
CrmUserSchema.plugin(mongoose_mpath);

const selectKeys = '_id userId password basicSalary parent userName gender age identityCard city wechatId isFreeze spreadUrl teams shortId path role';

CrmUserSchema.statics.findUserInfoByUserIdAndPwd = function(userId: string, password: string){
  return this.findOne({'userId': userId, 'password': password})
  .populate("role", "name isReview")
  .select(selectKeys)
  .exec()
}


CrmUserSchema.statics.findUserInfoByUserId = function(userId: string){
  return this.findOne({'userId': userId}).select().exec();
}

CrmUserSchema.statics.findUserById = function(id: string){
  return this.findById(id).select(selectKeys).exec();
}

CrmUserSchema.statics.findUserByShortId = function(shortId: number){
  return this.findOne({'shortId': shortId}).select(selectKeys).exec();
}

CrmUserSchema.statics.findUser = function(filter: any){
  return this.find(filter).select(selectKeys).exec();
}

CrmUserSchema.statics.findUserInfoAndUpdate = function(id, userInfo: any){
  return this.findByIdAndUpdate(
  id,
  {
    $set:{
        'userName': userInfo.userName,
        'gender': userInfo.gender,
        'age': userInfo.age,
        'identityCard': userInfo.identityCard,
        'province': userInfo.province,
        'city': userInfo.city,
        'wechatId': userInfo.wechatId
    }
  }
  ).select('_id ').exec();
}

CrmUserSchema.statics.updateUserFreeze = function(id, status){
  return this.findByIdAndUpdate(
  id,
  {
    $set:{
        'isFreeze': status       
    }
  }
  ).select('_id').exec();
}

CrmUserSchema.statics.getFreezeList = function(){
  return this.findAll({
    isFreeze: 1
  }).select('_id').exec();
}

CrmUserSchema.statics.remove = function(id){
  return this.remove({'_id': mongoose.Types.ObjectId(id)}).exec();
}


CrmUserSchema.statics.getMyparentId = function(id){

  return this.findById(id)
  .populate("role", "name isReview")
  .select(selectKeys)
  .exec()
}

CrmUserSchema.statics.findUserAndRoleInfo = function(shortId: number){
  return this.findOne({'shortId': shortId})
  .populate("role", "name isReview")
  .select(selectKeys)
  .exec()
}

CrmUserSchema.statics.findUserAndRoleInfoById = function(id: string){
  return this.findById(id)
  .populate("role", "name isReview")
  .select(selectKeys)
  .exec()
}

export default (app) => {
  return app.mongoose.model('CrmUser', CrmUserSchema);
};