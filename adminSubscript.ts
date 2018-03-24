/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 18:17:09
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:05:38
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 游戏角标模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const subscriptSchema = new mongoose.Schema({
        subscriptName: {
            type: Schema.Types.String,
            require: true
        },
        subscriptImg: {
            type: Schema.Types.String,
            require: true
        },

        isDeleted: { type: Schema.Types.Boolean, default: false }
    }, {timestamps: true});

    subscriptSchema.index({ subscriptName: 1 });

    return mongoose.model('AdminSubscript', subscriptSchema);
};
