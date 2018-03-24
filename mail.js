"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const moment = require("moment");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.MailSchema = new Schema({
    type: { type: Number, default: 0 },
    sender: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    title: { type: String, default: '' },
    btnTitle: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    content: { type: String, default: '' },
    items: [{
            type: { type: Number, default: 0 },
            itemId: { type: String, default: '' },
            count: { type: Number, default: 0 } // 货币数量或则物品数量
        }],
    draw: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    weight: { type: Number, default: 0 } // 邮件优先级权重, 越高越优先展示
}, { timestamps: true });
exports.MailSchema.plugin(QueryPlugin);
exports.MailSchema.plugin(mongoose_delete);
exports.MailSchema.statics.read = function (id) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, { $set: { read: true } }).exec();
};
exports.MailSchema.statics.draw = function (id) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, { $set: { draw: true } }).exec();
};
exports.MailSchema.statics.drawByIds = function (ids) {
    return this.update({ _id: { $in: ids } }, { $set: { draw: true } }).exec();
};
exports.MailSchema.statics.removeMail = function (id) {
    return this.remove({ _id: mongoose.Types.ObjectId(id) }).exec();
};
exports.MailSchema.statics.removeMails = function (ids) {
    return this.remove({ '_id': { $in: ids } }).exec();
};
exports.MailSchema.statics.countLast7DaysUnreadMails = function (toId) {
    return this.count({ read: false, to: mongoose.Types.ObjectId(toId), createdAt: { $gte: moment().subtract(7, 'days').toDate() } }).exec();
};
exports.MailSchema.statics.findLast7DaysMails = function (toId, type) {
    return this.find({ type: type, to: mongoose.Types.ObjectId(toId), createdAt: { $gte: moment().subtract(7, 'days').toDate() } })
        .populate('sender', 'nickname')
        .sort({ createdAt: -1 })
        .exec();
};
exports.MailSchema.statics.findLast7DaysSystemMails = function (toId) {
    return this.find({ type: 0, to: mongoose.Types.ObjectId(toId) })
        .select('-updatedAt -__v -deleted -to ')
        .sort({ weight: -1 })
        .exec();
};
exports.MailSchema.statics.findUndrawMails = function (toId, type) {
    return this.find({ type: type, to: mongoose.Types.ObjectId(toId), draw: false })
        .select('items')
        .exec();
};
exports.MailSchema.statics.findById = function (id) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id) }).select('-updatedAt -__v -deleted').exec();
};
exports.default = (app) => {
    return app.mongoose.model('Mail', exports.MailSchema);
};
