"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.AgentMessageSchema = new Schema({
    enabled: { type: Boolean, default: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    link: { type: String, default: '' } // 公告跳转URL
}, { timestamps: true });
exports.AgentMessageSchema.plugin(QueryPlugin);
exports.AgentMessageSchema.plugin(mongoose_delete);
exports.AgentMessageSchema.statics.list = function () {
    return this.find({ "deleted": false, "enabled": true })
        .sort({ createdAt: -1 })
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('AgentMessage', exports.AgentMessageSchema);
};
