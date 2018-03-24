"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const autoIncrement = require("../extend/autoIncrement");
const findOrCreate = require("mongoose-findorcreate");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
//
exports.CrmTeamSchema = new Schema({
    parent: { type: ObjectId, ref: 'CrmTeam' },
    users: [{ type: ObjectId, ref: 'CrmUser' }],
    //users: [{type:Mixed, default:{}}], //[{parentId:12345,userId: 456789}]
    children: [{ type: ObjectId, ref: 'CrmTeam' }],
    name: { type: String, default: '' }
    //userCount: { type: Number, default: 0 }
}, { timestamps: true });
exports.CrmTeamSchema.plugin(QueryPlugin);
exports.CrmTeamSchema.plugin(findOrCreate);
exports.CrmTeamSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmTeam' });
exports.CrmTeamSchema.plugin(mongoose_delete);
const selectKeys = '_id children users parent name';
exports.CrmTeamSchema.statics.findTeamInfoById = function (id) {
    return this.findById(id).select(selectKeys).exec();
};
exports.CrmTeamSchema.statics.findTeamInfoByName = function (name) {
    return this.findOne({ name }).select(selectKeys).exec();
};
exports.CrmTeamSchema.statics.updateTeamInfoById = function (id, teamInfo) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'name': teamInfo.name,
            'parent': teamInfo.parent
        }
    }).select('_id').exec();
};
//更新用户相关的组织信息
exports.CrmTeamSchema.statics.updateTeamUsersById = function (id, teamInfo) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'users': teamInfo.users
        }
    }).select('_id').exec();
};
// CrmTeamSchema.statics.findParentTeamInfoBy_Id = function(_id){
//   //return this.
// }
exports.CrmTeamSchema.statics.remove = function (id) {
    return this.remove({ '_id': mongoose.Types.ObjectId(id) }).exec();
};
exports.default = (app) => {
    return app.mongoose.model('CrmTeam', exports.CrmTeamSchema);
};
