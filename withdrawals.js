"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const autoIncrement = require("../extend/autoIncrement");
const mongoose_delete = require("mongoose-delete");
const moment = require("moment");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.WithdrawalsSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    money: { type: Number, default: 0 },
    orderSn: { type: String, default: "" },
    isSuccess: { type: Boolean, default: false },
    isSuccessDate: { type: Date, default: Date.now },
    type: { type: Number, default: 0 },
}, { timestamps: true });
exports.WithdrawalsSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Withdrawals' });
exports.WithdrawalsSchema.plugin(mongoose_delete);
exports.WithdrawalsSchema.statics.createWithdrawals = function (id, money, type = 1, orderSn) {
    return this.create({ "user": new mongoose.Types.ObjectId(id), money: money, type: type, orderSn: orderSn });
};
exports.WithdrawalsSchema.statics.findWithdrawalsList = function (id, limit = 10, page = 0, type = 1) {
    return this.find({ "user": new mongoose.Types.ObjectId(id), "type": 1, "deleted": false })
        .select("createdAt  isSuccess money")
        .limit(limit)
        .skip(page)
        .sort({ createdAt: -1 })
        .exec();
};
exports.WithdrawalsSchema.statics.findWithdrawalsListCount = function (id, type = 1) {
    return this.find({ "user": new mongoose.Types.ObjectId(id), "type": 1, "deleted": false })
        .count()
        .exec();
};
exports.WithdrawalsSchema.statics.findWithdrawalsSameDayCount = function (id, type = 1) {
    return this.find({ "$and": [{ "user": new mongoose.Types.ObjectId(id) }, { "createdAt": { "$gt": moment().subtract(1, 'days') } }, { 'type': type }, { "deleted": false }] })
        .count()
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Withdrawals', exports.WithdrawalsSchema);
};
