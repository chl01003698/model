/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:05:28
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 手机验证码模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const smsSchema = new mongoose.Schema({
        mobile: {
            type: Schema.Types.String
        },
        code: {
            type: Schema.Types.String
        },

        type: {
            type: Schema.Types.Number,
            default: 0
        }
    }, {timestamps: true});

    smsSchema.index({ mobile: 1 });

    return mongoose.model('AdminSms', smsSchema);
};
