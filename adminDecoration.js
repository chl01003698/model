"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 装修模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const decorationSchema = new mongoose.Schema({
        decorationName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        activeGame: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        activeChannel: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Channel'
        },
        decorationImg: {
            type: mongoose_1.Schema.Types.String
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    decorationSchema.index({ decorationName: 1 });
    return mongoose.model('AdminDecoration', decorationSchema);
};
