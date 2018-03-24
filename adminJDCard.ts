/*
 * @Author: cuiweiqiang
 * @Date:   2018-03-12 10:36:10
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-12 16:09:18
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 京东卡模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const AdminJDCardSchema = new mongoose.Schema({
        cardNumber: {
            type: Schema.Types.String,
            required: true
        },
        cardSecret: {
            type: Schema.Types.String,
            required: true
        },
        denomination: {
            type: Schema.Types.Number,
            required: true
        },

        status: {
            type: Schema.Types.Number, //1.正常 2.已发出 3.失效
            required: true,
            default: 1
        },

        sendTarget: {
            phone: {
                type: Schema.Types.String,
                trim: true,
                index: true,
                unique: true,
                sparse: true
            },  // 用户手机号(唯一),
            identity: {
                type: Schema.Types.String,
                default: ''
            },
            sendTime: {
                type: Schema.Types.Date
            }
        },

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });

    AdminJDCardSchema.index({ cardNumber: 1 }, { unique: true });

    return mongoose.model('AdminJDCard', AdminJDCardSchema);
};
