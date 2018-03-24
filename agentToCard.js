"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const mongoose_paginate = require("mongoose-paginate");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.agentToCardSchema = new Schema({
    type: { type: Number, default: 0, index: true },
    source: { type: ObjectId, ref: 'User' },
    target: { type: ObjectId, ref: 'User' },
    sourceCard: { type: Number, default: 0 },
    changeCard: { type: Number, default: 0 },
    targetCard: { type: Number, default: 0 },
}, { timestamps: true });
exports.agentToCardSchema.plugin(QueryPlugin);
exports.agentToCardSchema.plugin(mongoose_delete);
exports.agentToCardSchema.plugin(mongoose_paginate);
exports.agentToCardSchema.statics.createdAtList = function (start, end, userId, types, limit, page) {
    return this.find({ "$and": [
            { "createdAt": { "$gt": new Date(start) } },
            { "createdAt": { "$lt": new Date(end) } },
            { 'type': { $in: types } }, { "deleted": false },
            { "$or": [{ "source": new mongoose.Types.ObjectId(userId) }, { "target": new mongoose.Types.ObjectId(userId) }] }
        ] })
        .populate("source", "nickname shortId")
        .populate("target", " nickname shortId")
        .select('type changeCard  createdAt')
        .limit(limit)
        .skip(page)
        .sort({ createdAt: -1 })
        .exec();
};
exports.agentToCardSchema.statics.createdAtCountList = function (start, end, userId, types) {
    return this.find({ "$and": [
            { "createdAt": { "$gt": new Date(start) } },
            { "createdAt": { "$lt": new Date(end) } },
            { 'type': { $in: types } }, { "deleted": false },
            { "$or": [{ "source": new mongoose.Types.ObjectId(userId) }, { "target": new mongoose.Types.ObjectId(userId) }] }
        ] })
        .count()
        .exec();
};
exports.agentToCardSchema.statics.typeList = function (userId, types, limit, page) {
    return this.find({ "$and": [
            { 'type': { $in: types } }, { "deleted": false },
            { "$or": [{ "source": new mongoose.Types.ObjectId(userId) }, { "target": new mongoose.Types.ObjectId(userId) }] }
        ] })
        .populate("source", "nickname shortId")
        .populate("target", " nickname shortId")
        .select('type changeCard  createdAt')
        .limit(limit)
        .skip(page)
        .sort({ createdAt: -1 })
        .exec();
};
exports.agentToCardSchema.statics.typeCountList = function (userId, types) {
    return this.find({ "$and": [
            { 'type': { $in: types } }, { "deleted": false },
            { "$or": [{ "source": new mongoose.Types.ObjectId(userId) }, { "target": new mongoose.Types.ObjectId(userId) }] }
        ] })
        .count()
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('AgentToCard', exports.agentToCardSchema);
};
