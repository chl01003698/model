"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 游戏角标模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const subscriptSchema = new mongoose.Schema({
        subscriptName: {
            type: mongoose_1.Schema.Types.String,
            require: true
        },
        subscriptImg: {
            type: mongoose_1.Schema.Types.String,
            require: true
        },
        isDeleted: { type: mongoose_1.Schema.Types.Boolean, default: false }
    }, { timestamps: true });
    subscriptSchema.index({ subscriptName: 1 });
    return mongoose.model('AdminSubscript', subscriptSchema);
};
