/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:04:39
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 装修模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const decorationSchema = new mongoose.Schema({
        decorationName: {
            type: Schema.Types.String,
            required: true
        },
        activeGame: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        activeChannel: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Channel'
        },
        decorationImg: {
            type: Schema.Types.String
        },

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    decorationSchema.index({ decorationName: 1 });

    return mongoose.model('AdminDecoration', decorationSchema);
};
