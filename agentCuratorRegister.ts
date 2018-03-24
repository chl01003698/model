import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as findOrCreate from 'mongoose-findorcreate';
import * as moment from 'moment';

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

//馆长注册文档
const rebate = {
  curatorId:    { type: String, default: '' }, //返卡给馆长
  refereeId:    { type: String, default: '' }, //返卡给推荐人
  newCuratorId: { type: String, default: '' }  //返卡给自己此处ID是自身_id
}
export const AgentCuratorRegisterSchema = new Schema({
  enabled: { type: Boolean, default: false },  // 信息同步 true 同步 false 未同步
  phone: { type: String, trim: true, index: true, unique: true, sparse: true },  // 用户手机号(唯一)
  passWord: { type: String, default: '' },  // 用户密码
  refereeShortId: { type: String,default: '' }, // 邀请人shortId
  card: { type: Number, default: 0 },  // 购卡数
  purchaseMoney:{ type: Number, default: 0 },  // 进货额
  orderNo: { type: String, default: '' }, // 本系统生成订单号
  purchased: { type: Boolean, default: false }, // 购买卡成功
  parentAgentId:{ type: String, default: '' },//上级ID
  rebate:rebate //返卡人_ID
}, { timestamps: true })

AgentCuratorRegisterSchema.plugin(QueryPlugin)
AgentCuratorRegisterSchema.plugin(findOrCreate)

//创建注册馆长信息
AgentCuratorRegisterSchema.statics.createCurator =  function(fieldObj:any) {
    return  this.create(fieldObj);
}

//通过手机号查找
AgentCuratorRegisterSchema.statics.findFieldInfo = function (fieldObj: object) {
  return this.findOne(fieldObj).exec();
}

//更新
AgentCuratorRegisterSchema.statics.findFieldUpdate = function (fieldObj: object, set:object,select:string = 'phone') {
  return this.update(fieldObj, { $set: set }).select(select).exec();
}

// /*以上是馆长代理系统使用*/
export default (app) => {
  return app.mongoose.model('AgentCuratorRegister', AgentCuratorRegisterSchema);
};