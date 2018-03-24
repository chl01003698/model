/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:34:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:03:30
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 渠道模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const channelSchema = new mongoose.Schema({
        channelName: {
            type: Schema.Types.String,
            required: true
        },
        channelId: {
            type: Schema.Types.String,
            required: true
        },

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    channelSchema.index({ username: 1 }, { unique: true });
    channelSchema.index({ nickName: 1 });

    return mongoose.model('AdminChannel', channelSchema);
};
