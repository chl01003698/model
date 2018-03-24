"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.RoleSchema = new Schema({
    name: { type: String, required: true },
    isReview: { type: Number, required: true },
    isApply: { type: Number, required: true } //有无房卡申请权限 0:无 1: 有  
}, { timestamps: true });
exports.RoleSchema.plugin(QueryPlugin);
// RoleSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmRole' })
exports.RoleSchema.plugin(mongoose_delete);
exports.RoleSchema.statics.findByRoleName = function (name) {
    return this.findOne({ 'name': name }).select('name isReview').exec();
};
exports.RoleSchema.statics.findByRoleId = function (id) {
    return this.findById(id).select('name isReview').exec();
};
exports.RoleSchema.statics.queryRoleList = function () {
    return this.find({}).select('name').exec();
};
exports.RoleSchema.statics.findAndUpdateRoleName = function (roleInfo) {
    return this.findByIdAndUpdate(roleInfo.id, {
        $set: {
            "name": roleInfo.name,
            "isReview": roleInfo.isReview,
            "isApply": roleInfo.isApply
        }
    }, { new: true }).select("name").exec();
};
exports.RoleSchema.statics.delete = function (id) {
    return this.findByIdAndRemove(id).select(id).exec();
};
exports.default = (app) => {
    return app.mongoose.model('CrmRole', exports.RoleSchema);
};
