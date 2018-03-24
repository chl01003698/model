/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:04:47
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 用户组模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const groupSchema = new mongoose.Schema({
        groupName: {
            type: Schema.Types.String,
            required: true
        },

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    groupSchema.index({ groupName: 1 });

    return mongoose.model('AdminGroup', groupSchema);
};
