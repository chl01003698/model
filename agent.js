"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const autoIncrement = require("../extend/autoIncrement");
const mongoose_delete = require("mongoose-delete");
const agentMail_1 = require("./agentMail");
const moment = require("moment");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.AgentSchema = new Schema({
    enabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    passDate: { type: Date, default: Date.now },
    award: { type: Number, default: 0 },
    children: [{ type: ObjectId, ref: 'User' }],
    childCount: { type: Number, default: 0 } // 馆长总数
}, { timestamps: true });
exports.AgentSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Agent' });
exports.AgentSchema.plugin(mongoose_delete);
exports.AgentSchema.statics.cardList = function (userId, limit, page, fieldSort = { createdAt: -1 }) {
    return this.find({ '_id': new mongoose.Types.ObjectId(userId) }, { "children": { $slice: [page, limit] } })
        .populate({
        path: 'children',
        select: "nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt",
        populate: {
            path: 'curator',
            select: "childCount children"
        },
        options: { sort: fieldSort }
    })
        .exec();
};
//代理历史
exports.AgentSchema.statics.agentHistory = function (userId, month) {
    return this.find({ '_id': new mongoose.Types.ObjectId(userId) })
        .populate({
        path: 'children',
        select: "nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt",
        populate: {
            path: 'curator',
            select: "childCount children"
        },
        match: { 'createdAt': {
                $gte: moment(month).format('YYYY-MM'),
                $lt: moment(month).add(1, 'months').format('YYYY-MM'),
            } },
        options: { sort: { createdAt: -1 } }
    })
        .exec();
};
//查找馆长
exports.AgentSchema.statics.findChildrenInfo = function (id, childrenId) {
    return this.find({ "_id": new mongoose.Types.ObjectId(id), "children": new mongoose.Types.ObjectId(childrenId) }, { new: true }).exec();
};
exports.AgentSchema.statics.findInfo = function (shortId) {
    return this.findOne({ 'shortId': shortId })
        .exec();
};
exports.AgentSchema.statics.findIntraUser = function (shortId) {
    return this.find({ 'shortId': shortId })
        .populate('children', 'curator -_id shortId')
        .exec();
};
// ##################################################################
// #################### 以下为大厅业务 ###############################
// ##################################################################
agentMail_1.AgentMailSchema.statics.findAgentByIdCustomSelect = function (id, customSelectKey) {
    return this.findOne({ '_id': mongoose.Types.ObjectId(id) })
        .select(customSelectKey)
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Agent', exports.AgentSchema);
};
