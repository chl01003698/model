"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const mongoose_paginate = require("mongoose-paginate");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.AgentMailSchema = new Schema({
    type: { type: Number, default: 0, index: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    users: [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true });
exports.AgentMailSchema.plugin(QueryPlugin);
exports.AgentMailSchema.plugin(mongoose_delete);
exports.AgentMailSchema.plugin(mongoose_paginate);
exports.AgentMailSchema.statics.list = function (id, limit, page) {
    return this.find({ $or: [{ users: { $in: [id] } }, { type: 0 }] })
        .select('title content createdAt')
        .limit(limit)
        .skip(page)
        .sort({ createdAt: -1 })
        .exec();
};
exports.AgentMailSchema.statics.listCount = function (id) {
    return this.find({ $or: [{ users: { $in: [id] } }, { type: 0 }] })
        .select('title content createdAt')
        .count()
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('AgentMail', exports.AgentMailSchema);
};
