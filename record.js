"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.RecordSchema = new Schema({
    owner: { type: ObjectId, ref: 'User' },
    game: { type: String, required: true, index: true },
    type: { type: String },
    roomId: { type: String, required: true },
    chessRoomId: { type: Number, default: 0 },
    roundCount: { type: Number, default: 0 },
    currentRound: { type: Number, default: 0 },
    config: { type: Mixed, default: {}, required: true },
    done: { type: Boolean, defualt: false },
    startAt: { type: Date },
    players: [{
            user: { type: ObjectId, ref: 'User', index: true },
            score: { type: Number, default: 0 },
            winCount: { type: Number, default: 0 },
            loseCount: { type: Number, default: 0 },
            drawCount: { type: Number, default: 0 } // 平局次数
        }],
    rounds: { type: Mixed, default: [] },
    playbackIds: [{ type: String }],
    payUIds: [{ type: String }] // 支付玩家ID
}, { timestamps: true });
exports.RecordSchema.plugin(QueryPlugin);
exports.RecordSchema.plugin(mongoose_delete);
exports.RecordSchema.statics.findRecordBriefsByUserId = function (userId) {
    return this.find({ 'players.user': new mongoose.Types.ObjectId(userId) })
        .populate('players.user', 'nickname shortId isGuest headimgurl')
        .select('-playbackIds -rounds')
        .limit(30)
        .sort({ createdAt: -1 })
        .exec();
};
exports.RecordSchema.statics.findRecordBriefsByUserIdAndGame = function (userId, game) {
    return this.find({ 'players.user': new mongoose.Types.ObjectId(userId), 'game': game })
        .populate('players.user', 'nickname shortId isGuest headimgurl')
        .select('-__v -deleted -updatedAt')
        .limit(30)
        .sort({ createdAt: -1 })
        .exec();
};
exports.RecordSchema.statics.findRecordBriefsByOwnerId = function (userId, game) {
    return this.find({ 'owner': new mongoose.Types.ObjectId(userId), 'game': game })
        .populate('players.user', 'nickname shortId isGuest headimgurl')
        .select('-__v -deleted -updatedAt')
        .limit(30)
        .sort({ createdAt: -1 })
        .exec();
};
exports.RecordSchema.statics.findRecordBriefsByChessRoomId = function (chessRoomId, game) {
    return this.find({ 'chessRoomId': chessRoomId, 'game': game })
        .populate('players.user', 'nickname shortId isGuest headimgurl')
        .select('-__v -deleted -updatedAt')
        .limit(30)
        .sort({ createdAt: -1 })
        .exec();
};
exports.RecordSchema.statics.findRecordById = function (id) {
    return this.findById(id)
        .populate('players.user', 'nickname shortId isGuest headimgurl')
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Record', exports.RecordSchema);
};
