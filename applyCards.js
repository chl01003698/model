"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const autoIncrement = require("../extend/autoIncrement");
const friends = require("mongoose-friends");
const findOrCreate = require("mongoose-findorcreate");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.applyCardSchema = new Schema({
    applyId: { type: String, default: '' },
    toCurator: { type: Number, default: '' },
    applyInfo: { type: Mixed, default: {} },
    status: { type: Number, default: '' },
    applyAt: { type: Date, default: '' } //申请日期
}, { timestamps: true });
exports.applyCardSchema.plugin(QueryPlugin);
exports.applyCardSchema.plugin(findOrCreate);
exports.applyCardSchema.plugin(autoIncrement, { field: 'shortId', collection: 'User' });
exports.applyCardSchema.plugin(friends({ pathName: "friends" }));
exports.applyCardSchema.plugin(mongoose_delete);
exports.default = (app) => {
    return app.mongoose.model('ApplyCards', exports.applyCardSchema);
};
