"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
//馆长注册文档
const rebate = {
    curatorId: { type: String, default: '' },
    refereeId: { type: String, default: '' },
    newCuratorId: { type: String, default: '' } //返卡给自己此处ID是自身_id
};
exports.AgentCuratorRegisterSchema = new Schema({
    enabled: { type: Boolean, default: false },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true },
    passWord: { type: String, default: '' },
    refereeShortId: { type: String, default: '' },
    card: { type: Number, default: 0 },
    purchaseMoney: { type: Number, default: 0 },
    orderNo: { type: String, default: '' },
    purchased: { type: Boolean, default: false },
    parentAgentId: { type: String, default: '' },
    rebate: rebate //返卡人_ID
}, { timestamps: true });
exports.AgentCuratorRegisterSchema.plugin(QueryPlugin);
exports.AgentCuratorRegisterSchema.plugin(findOrCreate);
//创建注册馆长信息
exports.AgentCuratorRegisterSchema.statics.createCurator = function (fieldObj) {
    return this.create(fieldObj);
};
//通过手机号查找
exports.AgentCuratorRegisterSchema.statics.findFieldInfo = function (fieldObj) {
    return this.findOne(fieldObj).exec();
};
//更新
exports.AgentCuratorRegisterSchema.statics.findFieldUpdate = function (fieldObj, set, select = 'phone') {
    return this.update(fieldObj, { $set: set }).select(select).exec();
};
// /*以上是馆长代理系统使用*/
exports.default = (app) => {
    return app.mongoose.model('AgentCuratorRegister', exports.AgentCuratorRegisterSchema);
};
