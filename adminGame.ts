/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 14:04:32
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';

/**
 * 游戏模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const gameSchema = new mongoose.Schema({
        gameId: {
            type: Schema.Types.String,
            required: true
        },
        gameName: {
            type: Schema.Types.String,
            required: true
        },

        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, {timestamps: true});

    gameSchema.index({ gameId: 1 }, { unique: true });
    gameSchema.index({ gameName: 1 });

    return mongoose.model('AdminGame', gameSchema);
};
