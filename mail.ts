import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const MailSchema = new Schema({
  type: { type: Number, default: 0 },  // 0: 系统，1: 个人
  sender: { type: ObjectId, ref: 'User' },  // 发送人(只针对个人邮件)
  to: { type: ObjectId, ref: 'User' },      // 接收人
  title: { type: String, default: '' },     // 邮件标题
  btnTitle: { type: String, default: '' },      // 按钮标题
  subtitle: { type: String, default: '' },      // 副标题
  content: { type: String, default: ''},  // 邮件内容
  items: [{
    type: { type: Number, default: 0 },   // 0: 货币, 1: 物品
    itemId: { type: String, default: '' }, // 货币类型或则物品ID
    count: { type: Number, default: 0 }  // 货币数量或则物品数量
  }],
  draw: { type: Boolean, default: false },  // 是否已领取
  read: { type: Boolean, default: false },  // 是否已读
  weight:{ type: Number, default: 0 }  // 邮件优先级权重, 越高越优先展示
}, {timestamps: true})

MailSchema.plugin(QueryPlugin)
MailSchema.plugin(mongoose_delete)

MailSchema.statics.read = function(id: string) {
  return this.update({_id: mongoose.Types.ObjectId(id)}, {$set: {read: true}}).exec()
}

MailSchema.statics.draw = function(id: string) {
  return this.update({_id: mongoose.Types.ObjectId(id)}, {$set: { draw: true }}).exec()
}

MailSchema.statics.drawByIds = function(ids: Array<string>) {
  return this.update({_id: {$in: ids}}, {$set: { draw: true }}).exec()
}

MailSchema.statics.removeMail = function(id: string) {
  return this.remove({_id: mongoose.Types.ObjectId(id)}).exec()
}

MailSchema.statics.removeMails = function(ids: Array<string>) {
  return this.remove({'_id': { $in: ids }}).exec()
}

MailSchema.statics.countLast7DaysUnreadMails = function(toId: string) {
  return this.count({read: false, to: mongoose.Types.ObjectId(toId), createdAt: {$gte: moment().subtract(7, 'days').toDate()}}).exec()
}

MailSchema.statics.findLast7DaysMails = function(toId: string, type: number) {
  return this.find({type: type, to: mongoose.Types.ObjectId(toId),  createdAt: {$gte: moment().subtract(7, 'days').toDate()}})
  .populate('sender', 'nickname')
  .sort({createdAt: -1})
  .exec()
}

MailSchema.statics.findLast7DaysSystemMails = function(toId:string){
  return this.find({type: 0, to: mongoose.Types.ObjectId(toId)})
  .select('-updatedAt -__v -deleted -to ')
  .sort({weight: -1})
  .exec()
}

MailSchema.statics.findUndrawMails = function(toId: string, type: number) {
  return this.find({type: type, to: mongoose.Types.ObjectId(toId), draw: false})
  .select('items')
  .exec()
}

MailSchema.statics.findById = function(id:string){
  return this.findOne({_id:mongoose.Types.ObjectId(id)}).select('-updatedAt -__v -deleted').exec()
}

export default (app) => {
  return app.mongoose.model('Mail', MailSchema);
};