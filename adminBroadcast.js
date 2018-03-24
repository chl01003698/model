"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement = require("@ineentho/mongodb-autoincrement");
autoIncrement.setDefaults({
    collection: 'adminbroadcasts',
    field: 'broadcastId',
});
/**
 * 广播模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const broadcastSchema = new mongoose.Schema({
        broadcastId: {
            type: mongoose_1.Schema.Types.Number
        },
        broadcastName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        content: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        type: {
            type: mongoose_1.Schema.Types.Number
        },
        activeGame: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true, ref: 'Game'
        },
        activeModel: {
            type: mongoose_1.Schema.Types.Number,
            required: true
        },
        startAt: {
            type: mongoose_1.Schema.Types.Date,
            required: true
        },
        endAt: {
            type: mongoose_1.Schema.Types.Date,
            required: true
        },
        status: {
            type: mongoose_1.Schema.Types.Number,
            required: true, default: 1
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    broadcastSchema.index({ broadcastName: 1 });
    broadcastSchema.plugin(autoIncrement.mongoosePlugin);
    return mongoose.model('AdminBroadcast', broadcastSchema);
};
