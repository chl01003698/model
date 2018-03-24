"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 手机验证码模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const smsSchema = new mongoose.Schema({
        mobile: {
            type: mongoose_1.Schema.Types.String
        },
        code: {
            type: mongoose_1.Schema.Types.String
        },
        type: {
            type: mongoose_1.Schema.Types.Number,
            default: 0
        }
    }, { timestamps: true });
    smsSchema.index({ mobile: 1 });
    return mongoose.model('AdminSms', smsSchema);
};
