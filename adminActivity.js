"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement = require("../extend/autoIncrement");
/**
 * 活动模型
 */
exports.default = (app) => {
    const mongoose = app.mongoose;
    const activitySchema = new mongoose.Schema({
        activitySortFlag: {
            type: mongoose_1.Schema.Types.Number,
            required: true
        },
        activityName: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        activityDescription: {
            type: mongoose_1.Schema.Types.String
        },
        activityImg: {
            type: mongoose_1.Schema.Types.String,
            required: true
        },
        activeGame: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Game'
        },
        activeModel: {
            type: mongoose_1.Schema.Types.Number,
            required: true
        },
        jumpLink: {
            type: mongoose_1.Schema.Types.String,
            default: ''
        },
        subscript: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: false,
            ref: 'Subscript',
            default: null
        },
        startAt: {
            type: mongoose_1.Schema.Types.Date,
            required: true
        },
        endAt: {
            type: mongoose_1.Schema.Types.Date,
            required: true
        },
        status: {
            type: mongoose_1.Schema.Types.Number,
            required: true,
            default: 1
        },
        isDeleted: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });
    activitySchema.index({ activityName: 1 });
    activitySchema.plugin(autoIncrement, { field: 'activitySortFlag', collection: 'AdminActivity' });
    return mongoose.model('AdminActivity', activitySchema);
};
