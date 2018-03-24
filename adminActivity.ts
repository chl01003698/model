/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-21 11:47:36
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as autoIncrement from '../extend/autoIncrement';

/**
 * 活动模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const activitySchema = new mongoose.Schema({
        activitySortFlag: {
            type: Schema.Types.Number,
            required: true
        },
        activityName: {
            type: Schema.Types.String,
            required: true
        },
        activityDescription: {
            type: Schema.Types.String
        },
        activityImg: {
            type: Schema.Types.String,
            required: true
        },
        activeGame: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        activeModel: {
            type: Schema.Types.Number,
            required: true
        }, // 1: 积分赛，2: 好友局
        jumpLink: {
            type: Schema.Types.String,
            default: ''
        },
        subscript: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'Subscript',
            default: null
        },

        startAt: {
            type: Schema.Types.Date,
            required: true
        },
        endAt: {
            type: Schema.Types.Date,
            required: true
        },

        status: {
            type: Schema.Types.Number,
            required: true,
            default: 1
        }, // 1: 等待，2: 生效，3: 过期，4: 失效

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    activitySchema.index({ activityName: 1 });
    activitySchema.plugin(autoIncrement, { field: 'activitySortFlag', collection: 'AdminActivity' });

    return mongoose.model('AdminActivity', activitySchema);
};

