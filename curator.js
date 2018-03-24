"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const autoIncrement = require("../extend/autoIncrement");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
exports.CuratorSchema = new Schema({
    owner: { type: ObjectId, ref: 'User' },
    enabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    name: { type: String, default: "" },
    tablet: { type: String, default: "" },
    declaration: { type: String, default: "" },
    passDate: { type: Date, default: Date.now },
    award: { type: Number, default: 0 },
    children: [{ type: ObjectId, ref: 'User' }],
    childCount: { type: Number, default: 0 } // 玩家总数
}, { timestamps: true });
exports.CuratorSchema.plugin(autoIncrement, { field: 'shortId', collection: 'Curator' });
exports.CuratorSchema.plugin(mongoose_delete);
//牌局数少
exports.CuratorSchema.statics.cardList = function (userId, limit, page, fieldSort = { createdAt: -1 }) {
    return this.find({ '_id': new mongoose.Types.ObjectId(userId) }, { "children": { $slice: [page, limit] } })
        .populate({ path: 'children', select: 'nickname shortId coin realAuth.realname count.count sumPay createdAt loginAt', options: { sort: fieldSort } })
        .exec();
};
exports.CuratorSchema.statics.Info = function (userId, limit, page) {
    return this.findOne({ '_id': new mongoose.Types.ObjectId(userId) }, { "children": { $slice: [page, limit] } })
        .populate('children', 'nickname shortId coin realAuth.realname')
        .exec();
};
exports.CuratorSchema.statics.getChildren = function (id) {
    return this.findOne({ '_id': new mongoose.Types.ObjectId(id) })
        .populate('children', 'nickname shortId cardConsume coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt')
        .exec();
};
exports.CuratorSchema.statics.findUserAndUpdateChessNameInfo = function (id, name) {
    return this.findByIdAndUpdate(id, {
        $set: {
            "name": name
        }
    }, { new: true }).select('name').exec();
};
exports.CuratorSchema.statics.findUserAndUpdateDeclarationInfo = function (id, declaration) {
    return this.findByIdAndUpdate(id, {
        $set: {
            "declaration": declaration
        }
    }, { new: true }).select('declaration ').exec();
};
//解绑管内用户
exports.CuratorSchema.statics.findUserAndUpdateChildrenClearInfo = function (shortId, childrenId) {
    return this.update({ "shortId": shortId }, {
        $inc: {
            "childCount": -1
        },
        $pull: {
            "children": new mongoose.Types.ObjectId(childrenId),
        }
    }, { new: true }).exec();
};
//查找管内用户
exports.CuratorSchema.statics.findChildrenInfo = function (id, childrenId) {
    return this.find({ "_id": new mongoose.Types.ObjectId(id), "children": new mongoose.Types.ObjectId(childrenId) }, { new: true }).exec();
};
exports.CuratorSchema.statics.findInfo = function (shortId) {
    return this.findOne({ 'shortId': shortId })
        .exec();
};
//查找管内用户数
exports.CuratorSchema.statics.findChildrenCount = function (ids) {
    return this.find({ "_id": { $in: ids }, }, { new: true })
        .select("childCount -_id")
        .exec();
};
// #################### 以下为大厅业务 ###############################
/**
 * 查询棋牌室详情
 */
exports.CuratorSchema.statics.findChessRoomByShortId = function (chessRoomId) {
    return this.findOne({ 'shortId': chessRoomId })
        .populate('owner', ' nickname shortId nameCard.friendCardUrl ')
        .select(' -_id owner name declaration tablet childCount ')
        .exec();
};
/**
 * 自定义查询棋牌室资料
 */
exports.CuratorSchema.statics.findCuratorByIdCustomSelect = function (id, customSelectKey) {
    return this.findOne({ '_id': mongoose.Types.ObjectId(id) })
        .select(customSelectKey)
        .exec();
};
/**
 * 查询棋牌室成员
 */
exports.CuratorSchema.statics.findChildren = function (chessRoomId) {
    return this.findOne({ 'shortId': chessRoomId })
        .populate('children', 'nickname shortId headimgurl')
        .exec();
};
/**
 * 添加棋牌室成员
 */
exports.CuratorSchema.statics.insertChild = function (chessRoomId, child) {
    return this.update({
        'shortId': chessRoomId
    }, {
        '$addToSet': {
            'children': mongoose.Types.ObjectId(child)
        }
    }).exec();
};
/**
 * 更新棋牌室牌匾图片
 */
exports.CuratorSchema.statics.updateTablet = function (shortId, tablet) {
    return this.update({
        'shortId': shortId
    }, {
        '$set': {
            'tablet': tablet
        }
    }).exec();
};
// #################### 以上为大厅业务 ###############################
//代理在用
exports.CuratorSchema.statics.findByShortId = function (roomId) {
    return this.findOne({ shortId: roomId }).exec();
};
// ##################################################################
// #################### 以下为代理系统 ###############################
// ##################################################################
exports.CuratorSchema.statics.findById = function (id, select = "childCount") {
    return this.find({ "_id": new mongoose.Types.ObjectId(id) })
        .select(select)
        .exec();
};
exports.default = (app) => {
    return app.mongoose.model('Curator', exports.CuratorSchema);
};
