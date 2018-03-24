"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
/**
 * 服务器状态
 */
exports.ServerSchema = new Schema({
    app: { type: String, default: '' },
    name: { type: String, default: '' },
    state: { type: String, default: '' },
    link: { type: String, default: '' },
    startTime: { type: Date, default: Date.now() },
    stopTime: { type: Date, default: Date.now() } //开服时间
}, { timestamps: true });
exports.ServerSchema.plugin(QueryPlugin);
exports.ServerSchema.plugin(mongoose_delete);
exports.ServerSchema.statics.findPokerServer = function () {
    return this.findOne({ 'app': 'poker' })
        .select('app name state link startTime stopTime')
        .exec();
};
exports.ServerSchema.statics.findMahjongServer = function () {
    return this.findOne({ 'app': 'mahjong' })
        .select('app name state link startTime stopTime')
        .exec();
};
exports.ServerSchema.statics.createPokerServer = async function () {
    let poker = await this.findPokerServer();
    if (poker)
        return poker._id;
    poker = await this.create({
        'app': 'poker',
        'name': '棋牌',
        'state': 'start',
        'link': '',
        'startTime': '',
        'stopTime': ''
    });
    return poker._id;
};
exports.ServerSchema.statics.createMahjongServer = async function () {
    let mahjong = await this.findMahjongServer();
    if (mahjong)
        return mahjong._id;
    mahjong = await this.create({
        'app': 'mahjong',
        'name': '麻将',
        'state': 'start',
        'link': '',
        'startTime': '',
        'stopTime': ''
    });
    return mahjong._id;
};
exports.ServerSchema.statics.startPokerServer = function () {
    return this.findOneAndUpdate({
        'app': 'poker'
    }, {
        '$set': {
            'state': 'start'
        }
    }, { new: true }).select('state').exec();
};
exports.ServerSchema.statics.stopPokerServer = function () {
    return this.findOneAndUpdate({
        'app': 'poker'
    }, {
        '$set': {
            'state': 'stop'
        }
    }, { new: true }).select('state').exec();
};
exports.ServerSchema.statics.startMahjongServer = function () {
    return this.findOneAndUpdate({
        'app': 'mahjong'
    }, {
        '$set': {
            'state': 'start'
        }
    }, { new: true }).select('state').exec();
};
exports.ServerSchema.statics.stopMahjongServer = function () {
    return this.findOneAndUpdate({
        'app': 'mahjong'
    }, {
        '$set': {
            'state': 'stop'
        }
    }, { new: true }).select('state').exec();
};
exports.default = (app) => {
    return app.mongoose.model('Server', exports.ServerSchema);
};
