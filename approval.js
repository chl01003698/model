"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
/**
 * 审批
 */
exports.ApprovalSchema = new Schema({
    user: { type: ObjectId, ref: 'User', index: true },
    nickname: { type: String, default: '' },
    phone: { type: Number, default: 0 },
    date: { type: Date, default: Date.now() },
    type: { type: String, default: '' },
    state: { type: String, default: '' } //审批状态 
}, { timestamps: true });
exports.ApprovalSchema.plugin(QueryPlugin);
exports.ApprovalSchema.plugin(mongoose_delete);
exports.ApprovalSchema.statics.createCuratorApproval = async function (user, nickname, phone) {
    const approval = await this.create({
        'user': mongoose.Types.ObjectId(user),
        'nickname': nickname,
        'phone': phone,
        'type': 'curator'
    });
    return approval._id;
};
exports.ApprovalSchema.statics.findAllCuratorApporval = function () {
    return this.find({ 'type': 'curator' })
        .select('user nickname phone date status')
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Approval', exports.ApprovalSchema);
};
