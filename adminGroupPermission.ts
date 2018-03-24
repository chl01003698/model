/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-24 18:55:09
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 11:10:49
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 用户组模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const groupPermissionSchema = new mongoose.Schema({
        group: {
            type: Schema.Types.ObjectId,
            ref: 'AdminGroup',
        },
        permission: [{
            type: Schema.Types.ObjectId,
            ref: 'AdminPermission',
        }]
    }, { timestamps: true });

    groupPermissionSchema.index({ groupName: 1 });

    return mongoose.model('AdminGroupPermission', groupPermissionSchema);
};
