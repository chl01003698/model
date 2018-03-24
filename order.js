"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.OrderSchema = new Schema({
    buyer: { type: ObjectId, ref: 'User' },
    channel: { type: String, default: '' },
    purchased: { type: Boolean, default: false },
    transaction_id: { type: String, default: '', index: true },
    orderNo: { type: String, default: '' },
    item_id: { type: Number, required: true },
    rmb: { type: Number, required: true },
    coinType: { type: String, required: true },
    coin: { type: Number, required: true },
    baseCoin: { type: Number, required: true },
    extraCoin: { type: Number, default: 0 },
    platform: { type: String, default: '' },
    payDate: { type: Date, default: Date.now },
    curator: { type: ObjectId, ref: 'User' },
    cAward: { type: Number, default: 0 },
    agent: { type: ObjectId, ref: 'User' },
    aAward: { type: Number, default: 0 } // 代理分成比率
}, { timestamps: true });
exports.OrderSchema.plugin(QueryPlugin);
exports.OrderSchema.plugin(mongoose_delete);
exports.OrderSchema.statics.findByTransactionId = function (transactionId) {
    return this.findOne({ 'transaction_id': transactionId })
        .select('-_id -updatedAt -createdAt -__v')
        .exec();
};
exports.OrderSchema.statics.findAllByBuyer = function (buyer) {
    return this.find({ buyer: mongoose.Types.ObjectId(buyer) }).exec();
};
exports.default = (app) => {
    return app.mongoose.model('Order', exports.OrderSchema);
};
