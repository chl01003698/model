/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:05:07
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 游戏参数模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const parameterSchema = new mongoose.Schema({
        description: {
            type: Schema.Types.Number,
            required: true
        }, // 1:牌类app, 2:麻将类app
        parameterData: {
            type: Schema.Types.Mixed,
            required: true
        },
        activeGame: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});
    parameterSchema.index({ activeGame: 1 });

    return mongoose.model('AdminParameter', parameterSchema);
};
