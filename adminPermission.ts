/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-06 10:49:02
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 权限模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const permissionSchema = new mongoose.Schema({
        permissionFlag: Schema.Types.String,
        level: Schema.Types.Number,
        order: Schema.Types.Number,
        path: Schema.Types.String,
        descresption: Schema.Types.String,
        frontedNode: Schema.Types.String,
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });

    permissionSchema.index({ permissionFlag: 1, isDeleted: 1 }, { unique: true });

    return mongoose.model('AdminPermission', permissionSchema);
};
