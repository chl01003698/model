"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 用户组模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const userGroupSchema = new mongoose.Schema({
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminUser',
        },
        group: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminGroup',
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    userGroupSchema.index({ group: 1, isDeleted: 1 });
    return mongoose.model('AdminUserGroup', userGroupSchema);
};
