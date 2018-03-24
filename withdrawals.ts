import * as mongoose from 'mongoose';
import * as autoIncrement from '../extend/autoIncrement';
import * as mongoose_delete from 'mongoose-delete'
import * as moment from 'moment'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const WithdrawalsSchema = new Schema({
    user:{type: ObjectId, ref: 'User'},  // 提现人
    money:{type:Number,default:0}, //提款金额 (分为单位)
    orderSn:{type:String,default:""}, //提款订单号 统计需要
    isSuccess:{type:Boolean,default:false}, // 提款是否成功
    isSuccessDate: {type: Date, default: Date.now}, // 提款成功时间
    type:{ type:Number, default:0 }, // 1: 提现 2:进货
}, {timestamps: true})

WithdrawalsSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Withdrawals' })
WithdrawalsSchema.plugin(mongoose_delete)


WithdrawalsSchema.statics.createWithdrawals = function(id:string,money:number,type:number=1,orderSn:string) {
  return this.create({"user":new mongoose.Types.ObjectId(id),money:money,type:type,orderSn:orderSn});
}

WithdrawalsSchema.statics.findWithdrawalsList = function(id: string,limit:number = 10,page:number = 0,type:number =1) {
  return this.find({"user":new mongoose.Types.ObjectId(id),"type":1,"deleted":false})
  .select("createdAt  isSuccess money")
  .limit(limit)
  .skip(page)
  .sort({createdAt: -1})
  .exec()
}
WithdrawalsSchema.statics.findWithdrawalsListCount = function(id: string,type:number =1) {
  return this.find({"user":new mongoose.Types.ObjectId(id),"type":1,"deleted":false})
  .count()
  .exec()
}
WithdrawalsSchema.statics.findWithdrawalsSameDayCount = function(id: string,type:number =1) {     
  return this.find({ "$and": [{"user":new mongoose.Types.ObjectId(id)},{ "createdAt": { "$gt": moment().subtract(1, 'days') } }, { 'type': type }, { "deleted": false }] })
  .count()
  .exec()
}
export default (app) => {
  return app.mongoose.model('Withdrawals', WithdrawalsSchema);
};

