"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const autoIncrement = require("../extend/autoIncrement");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.CuratorGroupSchema = new Schema({
    name: { type: String, default: '' },
    type: { type: Number, default: 0 },
    members: [{ type: ObjectId, ref: 'User' }],
    memberCount: { type: Number, default: 0 },
    curator: { type: ObjectId, ref: 'Curator' }
}, { timestamps: true });
exports.CuratorGroupSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Curator' });
exports.CuratorGroupSchema.plugin(mongoose_delete);
/**
 * 创建默认群组
 */
exports.CuratorGroupSchema.statics.createDefaultGroup = async function (curator) {
    const group = await this.create({ 'curator': mongoose.Types.ObjectId(curator), 'name': '我的群组', 'type': 0 });
    return group._id;
};
/**
 * 添加默认群组成员
 */
exports.CuratorGroupSchema.statics.insertDefaultGroupMember = async function (curator, member) {
    return this.findOneAndUpdate({
        'curator': mongoose.Types.ObjectId(curator),
        'type': 0
    }, {
        '$addToSet': {
            'members': mongoose.Types.ObjectId(member)
        },
        '$inc': {
            'memberCount': 1
        }
    }, { new: true }).select('members').exec();
};
/**
 * 创建普通群组
 */
exports.CuratorGroupSchema.statics.createCommonGroup = async function (curator, name) {
    const group = await this.create({ 'curator': mongoose.Types.ObjectId(curator), 'name': name, 'type': 1 });
    return group._id;
};
/**
 * 更新群组名称
 */
exports.CuratorGroupSchema.statics.updateGroupName = function (groupId, name) {
    return this.update({ _id: mongoose.Types.ObjectId(groupId) }, { $set: { 'name': name } }).exec();
};
/**
 * 批量增加群组成员
 */
exports.CuratorGroupSchema.statics.insertMembers = function (groupId, members) {
    return this.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, {
        '$addToSet': {
            'members': {
                '$each': members
            }
        }
    }, { new: true }).select('members memberCount').exec();
};
/**
 * 批量删除群组成员
 */
exports.CuratorGroupSchema.statics.removeMembers = function (groupId, members) {
    return this.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, {
        '$pullAll': {
            'members': members
        }
    }, { new: true }).select('members').exec();
};
/**
 * 更新群组成员总数
 */
exports.CuratorGroupSchema.statics.updateMemberCount = async function (groupId) {
    const result = await this.findOne({ '_id': groupId }).select('members').exec();
    if (result) {
        return await this.findOneAndUpdate({ '_id': groupId }, { '$set': { 'memberCount': result.members.length } }, { new: true })
            .select('-_id memberCount')
            .exec();
    }
    return null;
};
/**
 * 获取群组列表
 */
exports.CuratorGroupSchema.statics.getGroups = function (curator) {
    return this.find({ 'curator': mongoose.Types.ObjectId(curator) })
        .select('type name memberCount members')
        .exec();
};
/**
 * 获取群组成员列表
 */
exports.CuratorGroupSchema.statics.getGroupMembers = function (groupId) {
    return this.findById(groupId)
        .populate("members", ' _id nickname headimgurl shortId ')
        .select('-_id members memberCount')
        .exec();
};
/**
 * 删除指定群组
 */
exports.CuratorGroupSchema.statics.removeGroup = function (groupId) {
    return this.remove({ _id: mongoose.Types.ObjectId(groupId) }).exec();
};
/**
 * 删除指定馆长所有群组中的指定成员
 */
exports.CuratorGroupSchema.statics.removeMemerInAllGroup = async function (curator, member) {
    const groups = await this.getGroups(curator);
    if (groups == null)
        return null;
    const length = groups.length;
    const tasks = new Array();
    for (let x = 0; x < length; x++) {
        await this.removeMember(groups[x]._id, member);
        const task = this.updateMemberCount(groups[x]._id);
        tasks.push(task);
    }
    const result = await Promise.all(tasks);
    return result;
};
/**
 * 删除群组中指定成员
 */
exports.CuratorGroupSchema.statics.removeMember = function (groupId, member) {
    console.log('groupId=>', groupId, member);
    return this.update({ '_id': groupId }, {
        '$pull': { 'members': member }
    }).exec();
};
exports.default = (app) => {
    return app.mongoose.model('CuratorGroup', exports.CuratorGroupSchema);
};
