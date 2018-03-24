"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 消息模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const messageSchema = new mongoose.Schema({
        type: {
            type: Number,
            default: 0
        },
        sender: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        },
        to: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            default: ''
        },
        btnTitle: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        items: [{
                type: {
                    type: Number,
                    default: 0
                },
                itemId: {
                    type: String,
                    default: ''
                },
                count: {
                    type: Number,
                    default: 0
                } // 货币数量或则物品数量
            }],
        weight: {
            type: Number,
            default: 0
        },
        timing: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        },
        sended: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        },
        date: {
            type: mongoose_1.Schema.Types.Date,
            required: false
        },
        status: {
            type: mongoose_1.Schema.Types.Number
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    messageSchema.index({ title: 1 });
    return mongoose.model('AdminMessage', messageSchema);
};
