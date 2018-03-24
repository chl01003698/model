"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.RedPacketSchema = new Schema({
    sender: { type: ObjectId, ref: 'User', index: true },
    receivers: [{ type: ObjectId, ref: 'User' }],
    card: { type: Number, default: 0 },
    every: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    desc: { type: String, default: '' },
    state: { type: Boolean, default: true } //红包状态
}, { timestamps: true });
exports.RedPacketSchema.plugin(QueryPlugin);
exports.RedPacketSchema.plugin(mongoose_delete);
exports.RedPacketSchema.statics.findRedPacketById = function (id) {
    return this.findById(id)
        .populate('sender', ' nickname shortId headimgurl ')
        .populate('receivers', ' nickname shortId headimgurl ')
        .select(" card every count desc state receivers ")
        .exec();
};
exports.RedPacketSchema.statics.findReceiverById = function (id, receiver) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id), 'receivers': { $in: [mongoose.Types.ObjectId(receiver)] } })
        .select('-_id receivers')
        .exec();
};
exports.RedPacketSchema.statics.receiveRedPacket = function (id, receiver) {
    return this.findOneAndUpdate({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        $addToSet: {
            'receivers': receiver
        }
    }, { new: true }).select('receivers').exec();
};
exports.RedPacketSchema.statics.findRedPacketCountById = function (id) {
    return this.findOne({
        '_id': mongoose.Types.ObjectId(id)
    }).select('count receivers').exec();
};
exports.RedPacketSchema.statics.updateStateById = function (id) {
    console.log('id=>', id);
    return this.findOneAndUpdate({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        $set: {
            'state': false
        }
    }, { new: true }).select('state').exec();
};
exports.RedPacketSchema.statics.removeReveicer = function (id, receivers) {
    return this.findOneAndUpdate({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        '$pullAll': {
            'receivers': receivers
        }
    }, { new: true })
        .populate('receivers', 'nickname shortId headimgurl')
        .select('receivers')
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('RedPacket', exports.RedPacketSchema);
};
