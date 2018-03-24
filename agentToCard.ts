import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'
import * as mongoose_paginate from 'mongoose-paginate'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const agentToCardSchema = new Schema({
  type: { type: Number, default: 0, index: true }, // 0进货 1奖励 2转入 3转出 
  source: { type: ObjectId, ref: 'User' },  // 转出方ID (进货&奖励类型不填)
  target: { type: ObjectId, ref: 'User' },  // 接收方ID
  sourceCard: { type: Number, default: 0 }, // 转出方当前货币数
  changeCard: { type: Number, default: 0 }, // 转出货币数
  targetCard: { type: Number, default: 0 }, // 接收方当前货币数
}, { timestamps: true })

agentToCardSchema.plugin(QueryPlugin)
agentToCardSchema.plugin(mongoose_delete)
agentToCardSchema.plugin(mongoose_paginate)

agentToCardSchema.statics.createdAtList = function (start:string, end: string, userId:string ,types: Array<number>, limit: number, page: number) {
  return this.find(
    {"$and": [
      { "createdAt": { "$gt": new Date(start)}}, 
      { "createdAt": { "$lt":  new Date(end)}}, 
      { 'type': { $in: types } },{ "deleted": false },
      {"$or":[{"source":new mongoose.Types.ObjectId(userId)},{"target":new mongoose.Types.ObjectId(userId)}]}
    ]}
  )
  .populate("source", "nickname shortId")
  .populate("target"," nickname shortId")
  .select('type changeCard  createdAt')
    .limit(limit)
    .skip(page)
    .sort({ createdAt: -1 })
    .exec()
}
agentToCardSchema.statics.createdAtCountList = function (start:string, end: string, userId:string , types: Array<number>) {
  return this.find(
    {"$and": [
      { "createdAt": { "$gt":  new  Date(start)}}, 
      { "createdAt": { "$lt":  new  Date(end)}}, 
      { 'type': { $in: types } },{ "deleted": false },
      {"$or":[{"source":new mongoose.Types.ObjectId(userId)},{"target":new mongoose.Types.ObjectId(userId)}]}
    ]}
  )
    .count()
    .exec()
}
agentToCardSchema.statics.typeList = function (userId:string,types: Array<number>, limit: number, page: number) {
  return this.find(
    {"$and": [
      { 'type': { $in: types } },{ "deleted": false },
      {"$or":[{"source":new mongoose.Types.ObjectId(userId)},{"target":new mongoose.Types.ObjectId(userId)}]}
    ]}
  )
  .populate("source", "nickname shortId")
  .populate("target"," nickname shortId")
  .select('type changeCard  createdAt')  
    .limit(limit)
    .skip(page)
    .sort({ createdAt: -1 })
    .exec()
}
agentToCardSchema.statics.typeCountList = function (userId:string,types: Array<number>, ) {
  return this.find(
    {"$and": [
      { 'type': { $in: types } },{ "deleted": false },
      {"$or":[{"source":new mongoose.Types.ObjectId(userId)},{"target":new mongoose.Types.ObjectId(userId)}]}
    ]}
  )
    .count()
    .exec()
}


export default (app) => {
  return app.mongoose.model('AgentToCard', agentToCardSchema);
};