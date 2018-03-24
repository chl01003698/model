"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 京东卡模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const AdminJDCardSchema = new mongoose.Schema({
        cardNumber: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        cardSecret: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        denomination: {
            type: mongoose_1.Schema.Types.Number,
            required: true
        },
        status: {
            type: mongoose_1.Schema.Types.Number,
            required: true,
            default: 1
        },
        sendTarget: {
            phone: {
                type: mongoose_1.Schema.Types.String,
                trim: true,
                index: true,
                unique: true,
                sparse: true
            },
            identity: {
                type: mongoose_1.Schema.Types.String,
                default: ''
            },
            sendTime: {
                type: mongoose_1.Schema.Types.Date
            }
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    AdminJDCardSchema.index({ cardNumber: 1 }, { unique: true });
    return mongoose.model('AdminJDCard', AdminJDCardSchema);
};
