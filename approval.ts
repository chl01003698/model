import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
/**
 * 审批　
 */
export const ApprovalSchema = new Schema({
  user: { type: ObjectId, ref: 'User', index: true},  //用户
  nickname:{type:String,default:''},                  //昵称
  phone: { type: Number, default: 0 },                //用户手机号
  date: { type: Date, default: Date.now() },          //日期
  type: { type:String,default:''},                    //审批类型 curator:馆长 agent:代理 other:其它
  state:{ type:String,default:''}                     //审批状态 
}, {timestamps: true})

ApprovalSchema.plugin(QueryPlugin)
ApprovalSchema.plugin(mongoose_delete)

ApprovalSchema.statics.createCuratorApproval = async function(user:string,nickname:string,phone:string){
    const approval = await this.create(
        {
            'user':mongoose.Types.ObjectId(user),
            'nickname':nickname,
            'phone':phone,
            'type':'curator'
        }
    )
    return approval._id;
}

ApprovalSchema.statics.findAllCuratorApporval = function(){
    return this.find({'type':'curator'})
    .select('user nickname phone date status')
    .exec()
}

export default (app) => {
  return app.mongoose.model('Approval', ApprovalSchema);
};