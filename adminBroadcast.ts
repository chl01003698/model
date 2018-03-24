/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:03:22
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as autoIncrement from "@ineentho/mongodb-autoincrement";

autoIncrement.setDefaults({
    collection: 'adminbroadcasts',     // collection name for counters, default: counters
    field: 'broadcastId',               // auto increment field name, default: _id
});

/**
 * 广播模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const broadcastSchema = new mongoose.Schema({
        broadcastId: {
            type: Schema.Types.Number
        },
        broadcastName: {
            type: Schema.Types.String,
            required: true
        },
        content: {
            type: Schema.Types.String,
            required: true
        },
        type: {
            type: Schema.Types.Number
        }, // 1. 系统； 2.大厅
        activeGame: {
            type: Schema.Types.ObjectId,
            required: true, ref: 'Game'
        },
        activeModel: {
            type: Schema.Types.Number,
            required: true
        }, // 1: 积分赛，2: 好友局

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
            required: true, default: 1
        }, // 1: 等待，2: 生效，3: 过期，4: 失效

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    broadcastSchema.index({ broadcastName: 1 });
    broadcastSchema.plugin(autoIncrement.mongoosePlugin);

    return mongoose.model('AdminBroadcast', broadcastSchema);
};
