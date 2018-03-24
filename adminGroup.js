"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 用户组模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const groupSchema = new mongoose.Schema({
        groupName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    groupSchema.index({ groupName: 1 });
    return mongoose.model('AdminGroup', groupSchema);
};
