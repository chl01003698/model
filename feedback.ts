import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as mongoose_delete from 'mongoose-delete'
import { NOTFOUND } from 'dns';

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const FeedbackSchema = new Schema({
  app:{type:String,default:''},                //poker:扑克 | mahjong:麻将
  type:{type:String,default:''},               //问题分类    login:登陆|pay:支付|game:游戏|rule:规则|bug|idea:建议
  status: { type: Boolean, default: false},    //保留字段，反馈状态 是否处理
  reporter: {type: ObjectId, ref: 'User'},     //反馈用户
  desc: {type: String, default: ''},           //反馈内容
  contact: {type: String, default: ''},        //联系方式
  date:{type:Date,default:Date.now()}
}, {timestamps: true})

FeedbackSchema.plugin(QueryPlugin)
FeedbackSchema.plugin(mongoose_delete)

FeedbackSchema.statics.findAll = function(){
  return this.find({}).select('app type reporter desc contact date').exec()
}

export default (app) => {
  return app.mongoose.model('Feedback', FeedbackSchema);
};