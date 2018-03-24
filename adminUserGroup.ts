/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-24 18:54:47
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 21:02:21
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 用户组模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const userGroupSchema = new mongoose.Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'AdminUser',
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'AdminGroup',
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });

    userGroupSchema.index({ group: 1, isDeleted: 1 });

    return mongoose.model('AdminUserGroup', userGroupSchema);
};
