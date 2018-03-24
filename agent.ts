import * as mongoose from 'mongoose';
import * as autoIncrement from '../extend/autoIncrement';
import * as mongoose_delete from 'mongoose-delete'
import { Agent } from 'http';
import { AgentMailSchema } from './agentMail';
import * as moment from 'moment';

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const AgentSchema = new Schema({
  enabled: { type: Boolean, default: false },  // 是否开启代理
  block: { type: Boolean, default: false },    // 是否禁闭代理
  level: { type: Number, default: 0 },         // 代理等级
  passDate: { type: Date, default: Date.now },     // 代理通过时间
  award: { type: Number, default: 0 },          // 代理分成比例
  children: [{ type: ObjectId, ref: 'User' }],  // 馆长列表
  childCount: { type: Number, default: 0 }      // 馆长总数
}, { timestamps: true })

AgentSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Agent' })
AgentSchema.plugin(mongoose_delete)

AgentSchema.statics.cardList = function (userId: string, limit: number, page: number,fieldSort:object = {createdAt:-1}) {
  return this.find({ '_id': new mongoose.Types.ObjectId(userId) }, { "children": { $slice: [page, limit] } })
    .populate({
      path:'children',
      select:"nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt",
      populate: {
        path: 'curator',
        select:"childCount children"
      },
      options:{sort:fieldSort}
    })
    .exec()
}
//代理历史
AgentSchema.statics.agentHistory = function (userId: string, month:string) {
  return this.find({ '_id': new mongoose.Types.ObjectId(userId) })
    .populate({
      path:'children',
      select:"nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt",
      populate: {
        path: 'curator',
        select:"childCount children"
      },
      match: { 'createdAt': { 
        $gte: moment(month).format('YYYY-MM'),
        $lt:  moment(month).add(1,'months').format('YYYY-MM'),
      }},
      options:{sort:{ createdAt: -1}}
    })
    .exec()
}
//查找馆长
AgentSchema.statics.findChildrenInfo = function(id:string,childrenId:string) {
  return this.find(
    {"_id":new mongoose.Types.ObjectId(id),"children":new mongoose.Types.ObjectId(childrenId)},
    { new: true }
  ).exec();
}

AgentSchema.statics.findInfo = function(shortId: string) {
  return this.findOne({'shortId':shortId})
  .exec()
}

AgentSchema.statics.findIntraUser = function(shortId : string){
return this.find({'shortId':shortId})
  .populate('children', 'curator -_id shortId')
  .exec()
}

// ##################################################################
// #################### 以下为大厅业务 ###############################
// ##################################################################


AgentMailSchema.statics.findAgentByIdCustomSelect = function(id:string,customSelectKey:string){
  return this.findOne({'_id':mongoose.Types.ObjectId(id)})
  .select(customSelectKey)
  .exec()
}

export default (app) => {
  return app.mongoose.model('Agent', AgentSchema);
};