"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 用户组模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const groupPermissionSchema = new mongoose.Schema({
        group: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminGroup',
        },
        permission: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'AdminPermission',
            }]
    }, { timestamps: true });
    groupPermissionSchema.index({ groupName: 1 });
    return mongoose.model('AdminGroupPermission', groupPermissionSchema);
};
