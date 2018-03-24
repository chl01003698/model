"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.AgentOrderSchema = new Schema({
    buyer: { type: ObjectId, ref: 'User' },
    channel: { type: String, default: '' },
    purchased: { type: Boolean, default: false },
    transaction_id: { type: String, default: '', index: true },
    beforePayment: { type: Object, default: {} },
    afterPayment: { type: Object, default: {} },
    item_id: { type: Number, default: 0 },
    rmb: { type: Number, default: 0 },
    coinType: { type: String, required: true },
    coin: { type: Number, default: 0 },
    baseCoin: { type: Number, default: 0 },
    extraCoin: { type: Number, default: 0 },
    orderNo: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    platform: { type: String, default: '' },
    payDate: { type: Date, default: Date.now },
    clientIp: { type: String, default: "" },
}, { timestamps: true });
exports.AgentOrderSchema.plugin(QueryPlugin);
exports.AgentOrderSchema.plugin(mongoose_delete);
exports.AgentOrderSchema.statics.findByTransactionId = function (transactionId) {
    return this.findOne({ 'transaction_id': transactionId })
        .select('buyer transaction_id orderNo purchased amount rmb')
        .exec();
};
exports.AgentOrderSchema.statics.findUserAndUpdateStock = function (id, purchased, afterPayment) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'purchased': purchased,
            'afterPayment': afterPayment
        }
    }, { new: true }).select('shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts').exec();
};
exports.AgentOrderSchema.statics.findBuyer = function (buyer, purchased = true) {
    return this.find(
    //"5a6f2abf2ecbd23d682bcb86"
    { buyer: new mongoose.Types.ObjectId(buyer), purchased: true }, { new: true }).select('buyer rmb').exec();
};
//查找指定字段更新
exports.AgentOrderSchema.statics.findFieldUpdate = function (findFieldObj, setObj, select = "_id") {
    return this.findOneAndUpdate(findFieldObj, {
        $set: setObj
    })
        .select(select)
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('AgentOrder', exports.AgentOrderSchema);
};
