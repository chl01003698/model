import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'


const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const AgentMessageSchema = new Schema({
  enabled: { type: Boolean, default: true },  // 公告激活状态 
  title: { type: String, default: '' },       // 公告标题
  content: { type: String, default: '' },     // 公告内容
  link: { type: String, default: '' }         // 公告跳转URL
}, { timestamps: true })

AgentMessageSchema.plugin(QueryPlugin)
AgentMessageSchema.plugin(mongoose_delete)

AgentMessageSchema.statics.list = function () {
  return this.find({ "deleted": false ,"enabled":true})
    .sort({ createdAt: -1 })
    .exec();
}


export default (app) => {
  return app.mongoose.model('AgentMessage', AgentMessageSchema);
};