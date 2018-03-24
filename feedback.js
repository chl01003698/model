"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.FeedbackSchema = new Schema({
    app: { type: String, default: '' },
    type: { type: String, default: '' },
    status: { type: Boolean, default: false },
    reporter: { type: ObjectId, ref: 'User' },
    desc: { type: String, default: '' },
    contact: { type: String, default: '' },
    date: { type: Date, default: Date.now() }
}, { timestamps: true });
exports.FeedbackSchema.plugin(QueryPlugin);
exports.FeedbackSchema.plugin(mongoose_delete);
exports.FeedbackSchema.statics.findAll = function () {
    return this.find({}).select('app type reporter desc contact date').exec();
};
exports.default = (app) => {
    return app.mongoose.model('Feedback', exports.FeedbackSchema);
};
