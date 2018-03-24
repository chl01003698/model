"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const autoIncrement = require("../extend/autoIncrement");
const mongoose_delete = require("mongoose-delete");
const mongoose_mpath = require("mongoose-mpath");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
//
exports.CrmUserSchema = new Schema({
    userId: { type: String, default: '', index: true },
    password: { type: String, default: '' },
    basicSalary: { type: Number, default: 0 },
    userName: { type: String, default: '' },
    gender: { type: Number, default: '' },
    age: { type: Number, default: '' },
    identityCard: { type: String, default: '' },
    province: { type: String, default: '' },
    city: { type: String, default: '' },
    wechatId: { type: String, default: '' },
    isFreeze: { type: Number, default: 0 },
    spreadUrl: { type: String, default: '' },
    teams: { type: ObjectId, ref: 'CrmTeam' },
    role: { type: ObjectId, ref: 'CrmRole' }
}, { timestamps: true });
exports.CrmUserSchema.plugin(QueryPlugin);
exports.CrmUserSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmUser' });
exports.CrmUserSchema.plugin(mongoose_delete);
exports.CrmUserSchema.plugin(mongoose_mpath);
const selectKeys = '_id userId password basicSalary parent userName gender age identityCard city wechatId isFreeze spreadUrl teams shortId path role';
exports.CrmUserSchema.statics.findUserInfoByUserIdAndPwd = function (userId, password) {
    return this.findOne({ 'userId': userId, 'password': password })
        .populate("role", "name isReview")
        .select(selectKeys)
        .exec();
};
exports.CrmUserSchema.statics.findUserInfoByUserId = function (userId) {
    return this.findOne({ 'userId': userId }).select().exec();
};
exports.CrmUserSchema.statics.findUserById = function (id) {
    return this.findById(id).select(selectKeys).exec();
};
exports.CrmUserSchema.statics.findUserByShortId = function (shortId) {
    return this.findOne({ 'shortId': shortId }).select(selectKeys).exec();
};
exports.CrmUserSchema.statics.findUser = function (filter) {
    return this.find(filter).select(selectKeys).exec();
};
exports.CrmUserSchema.statics.findUserInfoAndUpdate = function (id, userInfo) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'userName': userInfo.userName,
            'gender': userInfo.gender,
            'age': userInfo.age,
            'identityCard': userInfo.identityCard,
            'province': userInfo.province,
            'city': userInfo.city,
            'wechatId': userInfo.wechatId
        }
    }).select('_id ').exec();
};
exports.CrmUserSchema.statics.updateUserFreeze = function (id, status) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'isFreeze': status
        }
    }).select('_id').exec();
};
exports.CrmUserSchema.statics.getFreezeList = function () {
    return this.findAll({
        isFreeze: 1
    }).select('_id').exec();
};
exports.CrmUserSchema.statics.remove = function (id) {
    return this.remove({ '_id': mongoose.Types.ObjectId(id) }).exec();
};
exports.CrmUserSchema.statics.getMyparentId = function (id) {
    return this.findById(id)
        .populate("role", "name isReview")
        .select(selectKeys)
        .exec();
};
exports.CrmUserSchema.statics.findUserAndRoleInfo = function (shortId) {
    return this.findOne({ 'shortId': shortId })
        .populate("role", "name isReview")
        .select(selectKeys)
        .exec();
};
exports.CrmUserSchema.statics.findUserAndRoleInfoById = function (id) {
    return this.findById(id)
        .populate("role", "name isReview")
        .select(selectKeys)
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('CrmUser', exports.CrmUserSchema);
};
