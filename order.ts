import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const OrderSchema = new Schema({
  buyer: {type: ObjectId, ref: 'User'},           // 购买玩家
  channel: {type: String, default: ''},           // 支付渠道: 支付宝 | 微信支付
  purchased: { type: Boolean, default: false },   // 是否已支付
  transaction_id: {type: String, default: '', index: true}, // 第三方订单ID
  orderNo: { type: String, default: '' },         // 本系统生成订单号
  item_id: { type: Number, required: true },      // 物品ID
  rmb: { type: Number, required: true },          // 人民币 (分为单位)
  coinType: { type: String, required: true },     // 货币类型
  coin: { type: Number, required: true },         // 购买货币数量总计
  baseCoin: { type: Number, required: true },     // 基础货币数量
  extraCoin: { type: Number, default: 0 },        // 额外赠送货币数量
  platform: { type: String, default: '' },        // 操作系统平台 iOS | Android
  payDate: { type: Date, default: Date.now },     // 成功支付时间
  curator: {type: ObjectId, ref: 'User'},         // 馆长
  cAward: { type: Number, default: 0},            // 馆长分成比率
  agent:   {type: ObjectId, ref: 'User'},         // 代理
  aAward: {type: Number, default: 0}              // 代理分成比率
}, {timestamps: true})

OrderSchema.plugin(QueryPlugin)
OrderSchema.plugin(mongoose_delete)

OrderSchema.statics.findByTransactionId = function (transactionId: string) {
  return this.findOne({ 'transaction_id': transactionId })
    .select('-_id -updatedAt -createdAt -__v')
    .exec()
}

OrderSchema.statics.findAllByBuyer = function(buyer:string){
  return this.find({buyer:mongoose.Types.ObjectId(buyer)}).exec()
}



export default (app) => {
  return app.mongoose.model('Order', OrderSchema);
};