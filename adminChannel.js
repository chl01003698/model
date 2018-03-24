"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 渠道模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const channelSchema = new mongoose.Schema({
        channelName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        channelId: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    channelSchema.index({ username: 1 }, { unique: true });
    channelSchema.index({ nickName: 1 });
    return mongoose.model('AdminChannel', channelSchema);
};
