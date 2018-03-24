import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const AgentOrderSchema = new Schema({
  buyer: { type: ObjectId, ref: 'User' },  // 进货馆长&代理ID
  channel: { type: String, default: '' },  // 购买渠道: 微信, 支付宝, 银联 
  purchased: { type: Boolean, default: false }, // 购买成功
  transaction_id: { type: String, default: '', index: true }, //Pin++ 生成Id
  beforePayment: { type: Object, default: {} }, // Ping++支付前账单信息
  afterPayment: { type: Object, default: {} }, // Ping++支付后账单信息
  item_id: { type: Number, default: 0 },    // 产品ID
  rmb: { type: Number, default: 0 }, // 支付钱数
  coinType: { type: String, required: true },  // 货币类型
  coin: { type: Number, default: 0 },  // 货币数量
  baseCoin: { type: Number, default: 0 },  // 基础货币数量
  extraCoin: { type: Number, default: 0 },  // 额外赠送货币数量
  orderNo: { type: String, default: '' }, // 本系统生成订单号
  amount: { type: Number, default: 0 }, // 购买份数
  platform: { type: String, default: '' }, // 购买平台
  payDate: { type: Date, default: Date.now },  // 成功支付时间
  clientIp: { type: String, default: "" },  // 客户端IP
}, { timestamps: true });

AgentOrderSchema.plugin(QueryPlugin)
AgentOrderSchema.plugin(mongoose_delete)
AgentOrderSchema.statics.findByTransactionId = function (transactionId: string) {
  return this.findOne({ 'transaction_id': transactionId })
    .select('buyer transaction_id orderNo purchased amount rmb')
    .exec()
}

AgentOrderSchema.statics.findUserAndUpdateStock = function (id: string, purchased: boolean, afterPayment: object) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        'purchased': purchased,
        'afterPayment': afterPayment
      }
    },
    { new: true }
  ).select('shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts').exec();
}

AgentOrderSchema.statics.findBuyer = function (buyer: string,purchased:boolean = true) {
  return this.find(
    //"5a6f2abf2ecbd23d682bcb86"
    {buyer:new mongoose.Types.ObjectId(buyer),purchased:true},
    { new: true }
  ).select('buyer rmb').exec();
}
//查找指定字段更新
AgentOrderSchema.statics.findFieldUpdate = function (findFieldObj:any,setObj:any,select:string = "_id") {
  return this.findOneAndUpdate(
    findFieldObj,
    {
      $set: setObj
    },
  )
  .select(select)
  .exec();
}

export default (app) => {
  return app.mongoose.model('AgentOrder', AgentOrderSchema);
};