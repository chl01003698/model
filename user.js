"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const QueryPlugin = require("mongoose-query");
const autoIncrement = require("../extend/autoIncrement");
const friends = require("mongoose-friends");
const findOrCreate = require("mongoose-findorcreate");
const moment = require("moment");
const mongoose_delete = require("mongoose-delete");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
const Award = {
    count: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
};
const MobileAuth = {
    auth: { type: Boolean, default: false },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true },
    password: { type: String, default: '' } // 用户密码
};
const WeChatAuth = {
    auth: { type: Boolean, default: false },
    openid: { type: String, default: '' },
    unionid: { type: String, default: '' },
    nickname: { type: String, default: '' },
    sex: { type: Number, default: 0 },
    language: { type: String, default: '' },
    province: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    headimgurl: { type: String, default: '' }
};
const QQAuth = {
    auth: { type: Boolean, default: false },
    openid: { type: String, default: '' },
    nickname: { type: String, default: '' },
};
const RealAuth = {
    auth: { type: Boolean, default: false },
    realname: { type: String, default: '' },
    identity: { type: String, default: '' },
    addrCode: { type: String, default: 0 },
    sex: { type: Number, default: 0 },
    addr: { type: String, default: '' },
    birth: { type: String, default: '' },
    province: { type: String, default: '' },
    city: { type: String, default: '' },
};
const Coin = {
    card: { type: Number, default: 0 },
};
const Count = {
    name: { type: String, default: '' },
    seriesMax: { type: Number, default: 0 },
    series: { type: Number, default: 0 },
    winCount: { type: Number, default: 0 },
    count: { type: Number, default: 0 } // 参与游戏总计
};
const Invited = {
    friends: [{ type: ObjectId, ref: 'User' }],
    award: [{ type: Number, default: 0 }] // 邀请好友奖励
};
const Loc = {
    lat: { type: Number, default: 0.0 },
    long: { type: Number, default: 0.0 }
};
const Bank = {
    auth: { type: Boolean, default: false },
    bankOpening: { type: String, default: '' },
    bankCardholder: { type: String, default: '' },
    bankCode: { type: Number, default: 0 },
};
const HotItem = {
    friend: { type: ObjectId, ref: 'User' },
    value: { type: Number, default: 0 }
};
//领取实物奖励时填写的确认信息
const Confirm = {
    phone: { type: String, default: '' },
    realname: { type: String, default: '' },
    identity: { type: String, default: '' }
};
const Game = {
    chess: [{ type: String, default: '' }]
};
const NameCard = {
    curatorCardUrl: { type: String, default: '' },
    friendCardUrl: { type: String, default: '' } //邀请好友
};
// 玩家信息表
exports.UserSchema = new Schema({
    nickname: { type: String, default: '' },
    mobileAuth: MobileAuth,
    wechatAuth: WeChatAuth,
    realAuth: RealAuth,
    token: { type: String, default: '', index: true },
    isGuest: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    vipLevel: { type: Number, default: 0 },
    sex: { type: Number, default: 0 },
    signature: { type: String, default: '' },
    coin: Coin,
    count: Count,
    agent: { type: ObjectId, ref: 'Agent', },
    curator: { type: ObjectId, ref: 'Curator' },
    curatorParent: { type: ObjectId },
    agentParent: { type: ObjectId },
    agentStatus: { type: Number, default: 0 },
    counts: [Count],
    headimgurl: { type: String, default: '' },
    sumPay: { type: Number, default: 0 },
    loginAt: { type: Date, default: Date.now() },
    GMLevel: { type: Number, default: 0 },
    chessRoomId: { type: Number, default: 0 },
    sumMoney: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    bank: Bank,
    wechatNumber: { type: String, default: '' },
    invited: Invited,
    loc: Loc,
    playArea: { type: String, default: '' },
    cardConsume: { type: Number, default: 0 },
    purchaseMoney: { type: Number, default: 0 },
    shareAward: Award,
    luckAward: Award,
    hot: [{ HotItem }],
    nameCard: NameCard,
    block: { type: Boolean, default: false },
    game: Game,
    confirm: Confirm //领取实物奖励时填写的确认信息
}, {
    timestamps: true,
});
exports.UserSchema.plugin(QueryPlugin);
exports.UserSchema.plugin(findOrCreate);
exports.UserSchema.plugin(autoIncrement, { field: 'shortId', collection: 'User' });
exports.UserSchema.plugin(friends({ pathName: "friends" }));
exports.UserSchema.plugin(mongoose_delete);
//虚拟属性 创收
// UserSchema.virtual('revenue').get(function(){
//   return this.sumPay  + this.purchaseMoney;
// })
//onlineAward 未定义该字段
const clientSelectKeys = 'shortId nickname isGuest level vipLevel sex signature coin storeGold brokeAward  payAward headimgurl count counts mobileAuth sumPay loginAt agentParent curatorParent chessRoomId createdAt money  bank realAuth.auth loginAt token loc playArea device platform shareAward agentStatus agent curator';
exports.UserSchema.statics.findClientUser = function (id) {
    return this.findById(id).select(clientSelectKeys).exec();
};
exports.UserSchema.statics.findClientUserByPhone = function (phone) {
    return this.findOne({ 'mobileAuth.phone': phone }).select(clientSelectKeys).exec();
};
exports.UserSchema.statics.findGameUser = function (id, select = 'shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts curator agent loginAt count.count sumPay') {
    return this.findById(id).select(select).exec();
};
exports.UserSchema.statics.findWechatUser = function (unionid) {
    return this.findOne({ 'wechatAuth.unionid': unionid }).select('token shortId nickname isGuest level vipLevel sex signature coin storeGold brokeAward onlineAward payAward headimgurl count counts mobileAuth sumPay loginAt').exec();
};
//代理系统在使用
exports.UserSchema.statics.findUserAndUpdateCard = function (id, card) {
    return this.findByIdAndUpdate(id, {
        $inc: {
            'coin.card': card
        }
    }, { new: true }).select('shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts').exec();
};
exports.UserSchema.statics.byShortIds = function (shortIds) {
    return this.find({ shortId: { $in: shortIds } }).exec();
};
exports.UserSchema.statics.byShortId = function (shortId) {
    return this.findOne({ "shortId": shortId }).exec();
};
exports.UserSchema.statics.findPhoneToUserInfo = function (phone) {
    return this.find({ "mobileAuth.phone": phone })
        .populate("curator")
        .populate("agent")
        .select("mobileAuth.phone mobileAuth.password mobileAuth.auth coin  shortId nickname money _id createdAt level wechatNumber bank realAuth nameCard") //agent curator
        .exec();
};
/******************************************************************************************************/
/** 以下是大厅业务  都在使用 ****************************************************************************/
/******************************************************************************************************/
const commonSelectKey = 'shortId nickname sex coin headimgurl shareAward mobileAuth.auth mobileAuth.phone agentParent curatorParent chessRoomId realAuth.auth loc playArea invited block confirm ';
const registerSelectKey = 'shortId nickname sex coin headimgurl shareAward mobileAuth.auth mobileAuth.phone agentParent curatorParent chessRoomId realAuth.auth loc playArea invited block confirm token ';
/**
 * 通过_id查询个人信息
 */
exports.UserSchema.statics.findUserById = function (id) {
    return this.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {
        $set: {
            'loginAt': Date.now()
        }
    }, { new: true })
        .populate('curator', '-_id enabled block shortId')
        .populate('agent', '-_id enabled block')
        .select(commonSelectKey)
        .exec();
};
/**
 * 通过shortId查询个人信息
 */
exports.UserSchema.statics.findUserByShortId = function (shortId) {
    return this.findOneAndUpdate({ shortId: shortId }, {
        $set: {
            'loginAt': Date.now()
        }
    }, { new: true })
        .populate('curator', '-_id enabled block shortId')
        .populate('agent', '-_id enabled block award')
        .select(registerSelectKey)
        .exec();
};
/**
 * 自定义查询字段 _id
 */
exports.UserSchema.statics.findUserByIdCustomSelect = function (id, customSelectKey) {
    return this.findOne({ '_id': mongoose.Types.ObjectId(id) })
        .select(customSelectKey)
        .exec();
};
/**
 * 自定义查询字段 shortId
 */
exports.UserSchema.statics.findUserByShortIdCustomSelect = function (shrotId, customSelectKey) {
    return this.findOne({ 'shrotId': shrotId })
        .select(customSelectKey)
        .exec();
};
/**
 * 通过token查询用户信息
 */
exports.UserSchema.statics.findClientUserByToken = function (token) {
    return this.findOne({ 'token': token })
        .populate('curator', '-_id enabled block shortId ')
        .populate('agent', '-_id enabled block ')
        .select(commonSelectKey)
        .exec();
};
/**
 * 通过unionid查询用户信息
 */
exports.UserSchema.statics.findUserByUnionid = function (unionid) {
    return this.findOne({ 'wechatAuth.unionid': unionid })
        .populate('curator', '-_id enabled block shortId ')
        .populate('agent', '-_id enabled block ')
        .select(commonSelectKey)
        .exec();
};
/**
 * 通过手机号查询用户信息
 */
exports.UserSchema.statics.findUserByPhone = function (phone) {
    return this.findOne({ 'mobileAuth.phone': phone })
        .select(commonSelectKey)
        .exec();
};
/**
 * 获取用户手机号密码
 */
exports.UserSchema.statics.findUserPhonePassword = function (phone) {
    return this.findOne({ 'mobileAuth.phone': phone })
        .select(' mobileAuth ')
        .exec();
};
/**
 * 更新用户token
 */
exports.UserSchema.statics.findAndUpdateToken = function (id, token) {
    return this.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {
        $set: {
            'token': token
        }
    }, { new: true }).select(registerSelectKey).exec();
};
/**
 * 更新用户昵称
 */
exports.UserSchema.statics.updateUserNickname = function (id, nickname) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, { $set: { nickname: nickname } }).exec();
};
/**
 * 更新用户位置信息
 */
exports.UserSchema.statics.findAndUpdateLocation = function (id, loc) {
    return this.update({ _id: id }, { $set: { loc: loc } }).exec();
};
/**
 * 查询指定手机认证用户
 */
exports.UserSchema.statics.findMobileAuthById = function (id) {
    return this.findById(id)
        .select('_id mobileAuth')
        .exec();
};
/**
 * 查询指定实名认证用户
 */
exports.UserSchema.statics.findRealAuthById = function (id) {
    return this.findById(id)
        .select('_id realAuth')
        .exec();
};
/**
 * 查询指定邀请好友用户相关信息
 */
exports.UserSchema.statics.findInvitedById = function (id) {
    return this.findById(id)
        .populate("invited.friends", '_id nickname headimgurl createdAt')
        .select('_id invited')
        .exec();
};
/**
 * 查询指定邀请好友用户
 */
exports.UserSchema.statics.findInviter = function (id) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id) })
        .select('-_id coin.card invited')
        .exec();
};
/**
 * 添加邀请好友
 */
exports.UserSchema.statics.addInvited = function (id, friendId) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, { $push: { 'invited.friends': mongoose.Types.ObjectId(friendId) } }).exec();
};
/**
 * 查询是否已邀请过该好友
 */
exports.UserSchema.statics.findInvitedChildById = function (id, friendId) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id), 'invited.friends': { $in: [mongoose.Types.ObjectId(friendId)] } })
        .select('-_id invited')
        .exec();
};
/**
 * 更新邀请奖励
 */
exports.UserSchema.statics.findAndUpdateInviteAward = function (id, card, awardIndex) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, {
        $push: {
            'invited.award': awardIndex
        },
        $inc: {
            'coin.card': card
        }
    }, { new: true }).exec();
};
/**
 * 查询是否领取该次奖励
 */
exports.UserSchema.statics.findUserAwardIndex = function (id, awardIndex) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id), 'invited.award': { $in: [awardIndex] } })
        .select('invited')
        .exec();
};
/**
 * 查询用户详细信息
 */
exports.UserSchema.statics.findUserDetail = function (shortId) {
    return this.findOne({ shortId: shortId }).select('shortId headimgurl nickname sex loc').exec();
};
/**
 * 绑定棋牌室
 */
exports.UserSchema.statics.bindChessRoom = function (id, curatorId, chessRoomId, agentId) {
    const field = {
        'curatorParent': curatorId,
        'chessRoomId': chessRoomId
    };
    if (agentId)
        field['agentParent'] = agentId;
    return this.update({ '_id': mongoose.Types.ObjectId(id) }, {
        $set: field
    }).exec();
};
/**
 *　成为馆长
 */
exports.UserSchema.statics.bindCurator = function (id, curatorId, chessRoomId, phone, passwrod) {
    return this.update({ '_id': mongoose.Types.ObjectId(id) }, {
        $set: {
            'curator': curatorId,
            'chessRoomId': chessRoomId,
            'mobileAuth.phone': phone,
            'mobileAuth.password': passwrod,
            'mobileAuth.auth': true
        }
    }).exec();
};
/**
 * 查询指定馆长个人信息
 */
exports.UserSchema.statics.findCuratorById = function (id) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate('curator', 'enabled block shortId ')
        .select('_id agentParent realAuth.realname mobileAuth.phone')
        .exec();
};
/**
 * 自定义查询馆长信息
 */
exports.UserSchema.statics.findCuratorCustomSelect = function (id, customSelectKey) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate('curator', 'enabled block shortId ')
        .select(customSelectKey)
        .exec();
};
/**
 *
 * 查询指定馆长个人信息
 */
exports.UserSchema.statics.findCuratorByShortId = function (shortId) {
    return this.findOne({ 'shortId': shortId })
        .populate('curator', 'enabled block shortId ')
        .select('_id agentParent realAuth.realname mobileAuth.phone')
        .exec();
};
/**
 * 查询购买用户相关个人信息
 */
exports.UserSchema.statics.findBuyer = function (id) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id) })
        .select('shortId sumPay coin curatorParent agentParent purchaseMoney')
        .exec();
};
/**
 * 更新用户充值总计和card数量
 */
exports.UserSchema.statics.findAndUpdateUserCoin = function (id, card, money) {
    return this.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {
        $inc: {
            'coin.card': card,
            'sumPay': money
        }
    }, { new: true }).select('_id shortId coin sumPay').exec();
};
/**
 * 更新馆长收入总计和可提现金额
 */
exports.UserSchema.statics.findAndUpdateCuratorMoney = function (id, money) {
    return this.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(id)
    }, {
        $inc: {
            'sumMoney': money,
            'money': money
        }
    });
};
/**
 * 更新代理收入总计和可提现金额
 */
exports.UserSchema.statics.findAndUpdateAgentMoney = function (id, money) {
    return this.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(id)
    }, {
        $inc: {
            'sumMoney': money,
            'money': money
        }
    });
};
/**
 * 查询分享用户相关信息
 */
exports.UserSchema.statics.findShareUser = function (id) {
    return this.findById(id).select('_id shortId shareAward').exec();
};
/**
 * 更新分享奖励
 */
exports.UserSchema.statics.updateShareAward = function (id, card) {
    return this.update({ _id: id }, {
        $inc: {
            'coin.card': card,
            'shareAward.count': 1
        }
    }).exec();
};
/**
 * 重置分享次数
 */
exports.UserSchema.statics.resetShareAward = function (id) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, {
        $set: {
            'shareAward.date': Date.now(),
            'shareAward.count': 0
        }
    });
};
/**
 * 更新用户card数量
 */
exports.UserSchema.statics.updateUserCardById = function (id, card) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, {
        $inc: {
            'coin.card': card
        }
    }).exec();
};
/**
 *　添加用户游戏
 */
exports.UserSchema.statics.addUserGameById = function (id, game) {
    return this.update({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        '$addToSet': {
            'game.chess': game
        }
    }).exec();
};
/**
 *　删除用户游戏
 */
exports.UserSchema.statics.removeUserGameById = function (id, game) {
    return this.update({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        '$pull': {
            'game.chess': game
        }
    }).exec();
};
//麻将 记录玩家所选地区
exports.UserSchema.statics.updatePlayArea = function (id, playArea) {
    return this.update({ _id: mongoose.Types.ObjectId(id) }, { $set: { playArea: playArea } }).exec();
};
/**
 * 更新领取实物奖励时的确认信息
 */
exports.UserSchema.statics.updateConfirm = function (id, realname, identity, phone) {
    return this.update({
        '_id': mongoose.Types.ObjectId(id)
    }, {
        $set: {
            'confirm.realname': realname,
            'confirm.identity': identity,
            'confirm.phone': phone
        }
    }).exec();
};
/**以上是大厅业务 ********************************/
/*以下是馆长代理系统使用*/
//馆长解绑管内用户 父id清空 管内卡清零
exports.UserSchema.statics.findUserAndUpdateParentInfo = function (id) {
    return this.findByIdAndUpdate(id, {
        $set: {
            "curator": null,
            "curatorParent": null,
            "chessRoomId": null,
        }
    }, { new: true }).select("curatorParent").exec();
};
//更新用户认证 身份证 姓名
exports.UserSchema.statics.findUserAndUpdateRealAuth = function (id, addrCode, realname, birth, addr, sex, identity, auth) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'realAuth.addrCode': addrCode,
            'realAuth.realname': realname,
            'realAuth.birth': birth,
            'realAuth.addr': addr,
            'realAuth.sex': sex,
            'realAuth.identity': identity,
            'realAuth.auth': auth
        }
    }, { new: true }).select('shortId realAuth').exec();
};
//更新用户认证 省 市
exports.UserSchema.statics.findUserAndUpdateRealAuthCity = function (id, city, province) {
    return this.findByIdAndUpdate(id, {
        $set: {
            'realAuth.city': city,
            'realAuth.province': province,
        }
    }, { new: true }).select('shortId realAuth').exec();
};
//更新金额
exports.UserSchema.statics.findUserAndUpdateMoney = function (id, money) {
    return this.findByIdAndUpdate(id, {
        $inc: {
            'money': money
        }
    }, { new: true }).select('_id money shortId').exec();
};
//修改银行信息
exports.UserSchema.statics.findUserAndUpdateBankInfo = function (id, set, select = '_id money shortId') {
    return this.findByIdAndUpdate(id, {
        $set: set
    }, { new: true }).select(select).exec();
};
//更新密码
exports.UserSchema.statics.findUserAndUpdatePassWordInfo = function (id, password) {
    return this.findByIdAndUpdate(id, {
        $set: {
            "mobileAuth.password": password
        }
    }, { new: true }).select("mobileAuth.password _id").exec();
};
//更新微信号
exports.UserSchema.statics.findUserAndUpdatewechatNumberInfo = function (id, wechatNumber) {
    return this.findByIdAndUpdate(id, {
        $set: {
            "wechatNumber": wechatNumber
        }
    }, { new: true }).select("wechatNumber shortId RealAuth").exec();
};
//新增用户
exports.UserSchema.statics.findNewlyAdded = function (id) {
    return this.findOne({ $and: [{ curatorParent: new mongoose.Types.ObjectId(id) }, { "createdAt": { "$gt": moment().subtract(1, 'days') } }] })
        .count()
        .exec();
};
//新增馆长
exports.UserSchema.statics.findNewlyCurator = function (id) {
    return this.findOne({ $and: [{ agentParent: new mongoose.Types.ObjectId(id) }, { "createdAt": { "$gt": moment().subtract(1, 'days') } }] })
        .count()
        .exec();
};
//查找馆长
exports.UserSchema.statics.findCurator = function (shortId) {
    return this.findOne({ "shortId": shortId })
        .populate({ path: 'curator', select: "childCount" })
        .select("createdAt money sumMoney cardConsume sumPay realAuth.realname nickname coin agentParent mobileAuth.phone shortId")
        .exec();
};
exports.UserSchema.statics.findByIds = function (ids, select = "nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt cardConsume  curator") {
    return this.find({ "_id": { $in: ids } })
        .select(select)
        .exec();
};
exports.UserSchema.statics.findByCuratorParent = function (id, select = "sumPay cardConsume") {
    return this.find({ "curatorParent": id })
        .select(select)
        .exec();
};
exports.UserSchema.statics.findByCuratorParents = function (ids, select = "sumPay cardConsume") {
    return this.find({ "curatorParent": { $in: ids } })
        .select(select)
        .exec();
};
//进货金额累加 
exports.UserSchema.statics.findPurchaseMoney = function (shortId, purchaseMoney, select = "purchaseMoney") {
    return this.findOneAndUpdate({ "shortId": shortId }, {
        $inc: {
            'purchaseMoney': purchaseMoney
        }
    })
        .select(select)
        .exec();
};
//邀请好友名片地址更新
exports.UserSchema.statics.findUpdateFriendCardUrl = function (shortId, url, select = "nameCard.friendCardUrl") {
    return this.findOneAndUpdate({ "shortId": shortId }, {
        $set: {
            'nameCard.friendCardUrl': url
        }
    })
        .select(select)
        .exec();
};
//邀请馆长名片地址更新
exports.UserSchema.statics.findUpdateCuratorCardUrl = function (shortId, url, select = "nameCard.curatorCardUrl") {
    return this.findOneAndUpdate({ "shortId": shortId }, {
        $set: {
            'nameCard.curatorCardUrl': url
        }
    })
        .select(select)
        .exec();
};
//通过shortId查找
exports.UserSchema.statics.findShortId = function (shortId, select = "nameCard nickname RealAuth ") {
    return this.findOne({ "shortId": shortId })
        .select(select)
        .exec();
};
//查找指定字段更新
exports.UserSchema.statics.findFieldUpdate = function (findFieldObj, setObj, select = "_id money shortId") {
    return this.findOneAndUpdate(findFieldObj, {
        $set: setObj
    })
        .select(select)
        .exec();
};
//通过字段查找
exports.UserSchema.statics.findToField = function (field, select = "_id ,curatorParent") {
    return this.find(field)
        .select(select)
        .exec();
};
//查找指定字段更新
exports.UserSchema.statics.findUpdate = function (findFieldObj, setObj, select = "_id money shortId") {
    return this.findOneAndUpdate(findFieldObj, setObj)
        .select(select)
        .exec();
};
/*以上是馆长代理系统使用*/
exports.default = (app) => {
    return app.mongoose.model('User', exports.UserSchema);
};
