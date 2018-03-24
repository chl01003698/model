import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'
import * as mongoose_paginate from 'mongoose-paginate'


const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const AgentMailSchema = new Schema({
  type: { type: Number, default: 0, index: true },  // 消息类型 0: 全局 1: 范围
  title: { type: String, default: '' },  // 消息标题
  content: { type: String, default: '' },  // 消息内容
  users: [{ type: ObjectId, ref: 'User' }],  // 消息玩家范围 只适用于 type为1
}, { timestamps: true })

AgentMailSchema.plugin(QueryPlugin)
AgentMailSchema.plugin(mongoose_delete)
AgentMailSchema.plugin(mongoose_paginate)

AgentMailSchema.statics.list = function (id: string, limit: number, page: number) {
  return this.find({ $or: [{ users: { $in: [id] } }, { type: 0 }] })
    .select('title content createdAt')
    .limit(limit)
    .skip(page)
    .sort({ createdAt: -1 })
    .exec()
}
AgentMailSchema.statics.listCount = function (id: string) {
  return this.find({ $or: [{ users: { $in: [id] } }, { type: 0 }] })

  .select('title content createdAt')
    .count()
    .exec()
}

export default (app) => {
  return app.mongoose.model('AgentMail', AgentMailSchema);
};