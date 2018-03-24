"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 权限模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const permissionSchema = new mongoose.Schema({
        permissionFlag: mongoose_1.Schema.Types.String,
        level: mongoose_1.Schema.Types.Number,
        order: mongoose_1.Schema.Types.Number,
        path: mongoose_1.Schema.Types.String,
        descresption: mongoose_1.Schema.Types.String,
        frontedNode: mongoose_1.Schema.Types.String,
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    permissionSchema.index({ permissionFlag: 1, isDeleted: 1 }, { unique: true });
    return mongoose.model('AdminPermission', permissionSchema);
};
