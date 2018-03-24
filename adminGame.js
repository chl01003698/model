"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * 游戏模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const gameSchema = new mongoose.Schema({
        gameId: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        gameName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    gameSchema.index({ gameId: 1 }, { unique: true });
    gameSchema.index({ gameName: 1 });
    return mongoose.model('AdminGame', gameSchema);
};
