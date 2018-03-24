import * as mongoose from 'mongoose';
import * as autoIncrement from '../extend/autoIncrement';
import * as mongoose_delete from 'mongoose-delete'
import { CuratorGroupSchema } from './curatorGroup';

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const CuratorSchema = new Schema({
  owner: { type: ObjectId, ref: 'User' },      // 馆长
  enabled: { type: Boolean, default: false },  // 是否开启馆长
  block: { type: Boolean, default: false },    // 是否禁闭馆长
  level: { type: Number, default: 0 },         // 馆长等级
  name: { type: String, default: "" },         // 棋牌室名称
  tablet: { type: String, default: "" },       // 棋牌室牌匾图片url
  declaration:{ type: String, default: "" },   // 棋牌室宣言
  passDate: { type: Date, default: Date.now }, // 馆长通过时间
  award: { type: Number, default: 0 },         // 馆长分成比例
  children: [{ type: ObjectId, ref: 'User' }], // 玩家列表
  childCount: { type: Number, default: 0 }     // 玩家总数
}, {timestamps: true})


CuratorSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Curator' })
CuratorSchema.plugin(mongoose_delete)
//牌局数少
CuratorSchema.statics.cardList = function(userId: string,limit:number,page:number,fieldSort:object = {createdAt:-1}) {
  return this.find({'_id':new mongoose.Types.ObjectId(userId)},{"children":{$slice:[ page, limit]}})
  .populate({path:'children',select:'nickname shortId coin realAuth.realname count.count sumPay createdAt loginAt',options:{sort:fieldSort}})
  .exec()
}

CuratorSchema.statics.Info = function(userId: string,limit:number,page:number) {
  return this.findOne({'_id':new mongoose.Types.ObjectId(userId)},{"children":{$slice:[ page, limit]}})
  .populate('children','nickname shortId coin realAuth.realname')
  .exec()
}
CuratorSchema.statics.getChildren = function(id: string) {
  return this.findOne({'_id':new mongoose.Types.ObjectId(id)})
  .populate('children','nickname shortId cardConsume coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt')
  .exec()
}

CuratorSchema.statics.findUserAndUpdateChessNameInfo = function(id:string,name:string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        "name":name
      }
    },
    { new: true }
  ).select('name').exec();
}
CuratorSchema.statics.findUserAndUpdateDeclarationInfo = function(id:string,declaration:string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        "declaration":declaration
      }
    },
    { new: true }
  ).select('declaration ').exec();
}

//解绑管内用户
CuratorSchema.statics.findUserAndUpdateChildrenClearInfo = function(shortId:string,childrenId:string) {
  return this.update(
    {"shortId":shortId},
    {
      $inc:{
        "childCount":-1
      },
      $pull:{
        "children":new mongoose.Types.ObjectId(childrenId),
      }
    },
    { new: true }
  ).exec();
}

//查找管内用户
CuratorSchema.statics.findChildrenInfo = function(id:string,childrenId:string) {
  return this.find(
    {"_id":new mongoose.Types.ObjectId(id),"children":new mongoose.Types.ObjectId(childrenId)},
    { new: true }
  ).exec();
}
CuratorSchema.statics.findInfo = function(shortId: string) {
  return this.findOne({'shortId':shortId})
  .exec()
}
//查找管内用户数
CuratorSchema.statics.findChildrenCount = function(ids:Array<string>) {
  return this.find(
    {"_id":{$in: ids},},
    { new: true }
  )
  .select("childCount -_id")
  .exec();
}



// #################### 以下为大厅业务 ###############################
/**
 * 查询棋牌室详情
 */
CuratorSchema.statics.findChessRoomByShortId = function(chessRoomId:number){
  return this.findOne({'shortId':chessRoomId})
  .populate('owner',' nickname shortId nameCard.friendCardUrl ')
  .select(' -_id owner name declaration tablet childCount ')
  .exec()
}
/**
 * 自定义查询棋牌室资料
 */
CuratorSchema.statics.findCuratorByIdCustomSelect = function(id:string,customSelectKey:string){
  return this.findOne({'_id': mongoose.Types.ObjectId(id)})
  .select(customSelectKey)
  .exec()
}
/**
 * 查询棋牌室成员
 */
CuratorSchema.statics.findChildren = function(chessRoomId:number){
  return this.findOne({'shortId':chessRoomId})
  .populate('children','nickname shortId headimgurl')
  .exec()
}
/**
 * 添加棋牌室成员
 */
CuratorSchema.statics.insertChild = function(chessRoomId:number,child:string){
  return this.update(
    {
      'shortId':chessRoomId
    },
    {
      '$addToSet':
      {
        'children':mongoose.Types.ObjectId(child)
      }
    },
  ).exec()
}
/**
 * 更新棋牌室牌匾图片
 */
CuratorSchema.statics.updateTablet = function(shortId:number,tablet:string){
  return this.update(
    {
      'shortId': shortId
    },
    {
      '$set':
      {
        'tablet':tablet
      }
    }
  ).exec()
}
// #################### 以上为大厅业务 ###############################


//代理在用
CuratorSchema.statics.findByShortId = function(roomId:number){
  return this.findOne({shortId:roomId}).exec()
}

// ##################################################################
// #################### 以下为代理系统 ###############################
// ##################################################################
CuratorSchema.statics.findById = function(id:string,select:string = "childCount"){
  return this.find({"_id":new mongoose.Types.ObjectId(id)})
  .select(select)
  .exec()
}
export default (app) => {
  return app.mongoose.model('Curator', CuratorSchema);
};