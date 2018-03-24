"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 游戏参数模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const parameterSchema = new mongoose.Schema({
        description: {
            type: mongoose_1.Schema.Types.Number,
            required: true
        },
        parameterData: {
            type: mongoose_1.Schema.Types.Mixed,
            required: true
        },
        activeGame: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    parameterSchema.index({ activeGame: 1 });
    return mongoose.model('AdminParameter', parameterSchema);
};
