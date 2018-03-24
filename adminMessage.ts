/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-02 11:11:10
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 消息模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const messageSchema = new mongoose.Schema({
        type: {
            type: Number,
            default: 0
        },  // 0: 系统，1: 个人
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },  // 发送人(只针对个人邮件)
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },      // 接收人
        title: {
            type: String,
            default: ''
        },     // 邮件标题
        btnTitle: {
            type: String,
            default: ''
        },      // 按钮标题
        subtitle: {
            type: String,
            default: ''
        },      // 副标题
        content: {
            type: String,
            default: ''
        },  // 邮件内容
        items: [{
            type: {
                type: Number,
                default: 0
            },   // 0: 货币, 1: 物品
            itemId: {
                type: String,
                default: ''
            }, // 货币类型或则物品ID
            count: {
                type: Number,
                default: 0
            }  // 货币数量或则物品数量
        }],
        weight: {
            type: Number,
            default: 0
        },  // 邮件优先级权重, 越高越优先展示

        timing: {
            type: Schema.Types.Boolean,
            default: false
        },

        sended: {
            type: Schema.Types.Boolean,
            default: false
        },

        date: {
            type: Schema.Types.Date,
            required: false
        },

        status: {
            type: Schema.Types.Number
        }, // 1:成功，2:失败
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });

    messageSchema.index({ title: 1 });

    return mongoose.model('AdminMessage', messageSchema);
};
