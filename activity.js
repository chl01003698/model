"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const moment = require("moment");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
/**
 * 活动
 */
exports.ActivitySchema = new Schema({
    app: { type: String, default: 'public' },
    title: { type: String, default: '' },
    btnTitle: { type: String, default: '' },
    content: { type: String, default: '' },
    weight: { type: Number, default: 0 },
    imageurl: { type: String, default: '' },
    link: { type: String, default: '' } // 活动跳转链接
}, { timestamps: true });
exports.ActivitySchema.plugin(QueryPlugin);
exports.ActivitySchema.plugin(mongoose_delete);
exports.ActivitySchema.statics.removeActivity = function (id) {
    return this.remove({ _id: mongoose.Types.ObjectId(id) }).exec();
};
exports.ActivitySchema.statics.removeActivities = function (ids) {
    return this.remove({ '_id': { $in: ids } }).exec();
};
exports.ActivitySchema.statics.findLast7DaysActivities = function (app) {
    const queryKey = { $in: [app, 'public'] };
    return this.find({ 'app': queryKey, createdAt: { $gte: moment().subtract(7, 'days').toDate() } })
        .select('link imageurl weight btnTitle')
        .sort({ weight: -1 })
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Activity', exports.ActivitySchema);
};
