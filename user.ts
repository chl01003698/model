import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as autoIncrement from '../extend/autoIncrement';
import * as friends from 'mongoose-friends'
import * as findOrCreate from 'mongoose-findorcreate';
import * as moment from 'moment';
import * as mongoose_delete from 'mongoose-delete';


const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

const Award = {
  count: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}

const MobileAuth = {
  auth: { type: Boolean, default: false },  // 手机号验证
  phone: { type: String, trim: true, index: true, unique: true, sparse: true },  // 用户手机号(唯一)
  password: { type: String, default: '' }  // 用户密码
}

const WeChatAuth = {
  auth: { type: Boolean, default: false },  // 微信授权用户
  openid: { type: String, default: '' },    // 微信openid
  unionid: { type: String, default: '' },   // 微信unionid
  nickname: { type: String, default: '' },  
  sex: { type: Number, default: 0 },
  language: { type: String, default: '' },
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  headimgurl: { type: String, default: '' }
}

const QQAuth = {
  auth:{type:Boolean,default:false},
  openid:{type:String,default:''},
  nickname:{type:String,default:''},
}

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
}

const Coin = {
  card: { type: Number, default: 0 },  // 游戏中房卡数
  // stock: { type: Number, default: 0 }  // 库存
}

const Count = {
  name: { type: String, default: '' },     // 游戏类型, 全局为 default
  seriesMax: { type: Number, default: 0 }, // 最大连胜次数
  series: { type: Number, default: 0 },    // 当前连胜次数
  winCount: { type: Number, default: 0 },  // 总计胜利次数
  count: { type: Number, default: 0 }      // 参与游戏总计
}

const Invited = {
  friends: [{ type: ObjectId, ref: 'User' }],  // 邀请好友数组
  award: [{ type: Number, default: 0 }]        // 邀请好友奖励
}

const Loc = {                             // 玩家当前经纬度信息
  lat:{type:Number,default:0.0},
  long:{type:Number,default:0.0}
}

const Bank = {
  auth: { type: Boolean, default: false }, // 是否已银行认证
  bankOpening: { type: String, default: '' }, // 开户行
  bankCardholder: { type: String, default: '' }, // 银行持卡人
  bankCode: { type: Number, default: 0 },  // 银行卡号
}

const HotItem = {
  friend:{type:ObjectId,ref:'User'},
  value:{type:Number,default:0}
}

//领取实物奖励时填写的确认信息
const Confirm = {
  phone:      { type: String,  default:''},
  realname:   { type: String,  default:''},
  identity:   { type: String,  default:''}
}

const Game = {
  chess:[{type:String,default:''}]
}

const NameCard = {                              //名片地址
  curatorCardUrl: { type: String, default: '' }, //邀请馆长
  friendCardUrl:{ type: String, default: '' } //邀请好友
}
// 玩家信息表
export const UserSchema = new Schema({
  nickname: { type: String, default: '' },    // 昵称
  mobileAuth: MobileAuth,  // 手机认证信息
  wechatAuth: WeChatAuth,  // 微信认证信息
  realAuth: RealAuth,      // 实名认证信息
  token: { type: String, default: '', index: true },  // 玩家登录token验证
  isGuest: { type: Boolean, default: false },  // 是否游戏
  level: { type: Number, default: 0 },  // 玩家等级
  vipLevel: { type: Number, default: 0 },  // 玩家VIP等级
  sex: { type: Number, default: 0 },  // 玩家性别 0: 女 1: 男
  signature: { type: String, default: '' },  // 个性签名
  coin: Coin,  // 玩家货币信息
  count: Count,  // 玩家总体胜率统计
  agent: { type: ObjectId, ref: 'Agent', },   //代理
  curator: { type: ObjectId, ref: 'Curator' }, //馆长
  curatorParent: { type: ObjectId }, // 管内用户上级
  agentParent: { type: ObjectId }, // 馆长上级
  agentStatus:{type:Number,default: 0}, //馆长升级到代理 0未升级 1待升级 2升级成功
  counts: [Count],  // 玩家各游戏胜率统计
  headimgurl: { type: String, default: '' },  // 玩家头像URL
  sumPay: { type: Number, default: 0 },  // 充值总计 (分为单位)
  loginAt: { type: Date, default: Date.now() },  // 玩家登陆时间
  GMLevel: { type: Number, default: 0 },  // GM等级
  chessRoomId: { type: Number, default: 0 },  // 棋牌室ID
  sumMoney: { type: Number, default: 0 }, // 总计收入
  money: { type: Number, default: 0 }, // (代理&馆长)提现金额
  bank: Bank,
  wechatNumber: { type: String, default: '' },  // (代理&馆长)微信号
  invited: Invited,  // 邀请好友信息
  loc:Loc,           // 地理位置信息
  playArea:{ type:String, default:'' },  // 选择地区
  cardConsume:{ type:Number, default:0 }, //桌卡消耗
  purchaseMoney: { type: Number, default: 0 }, // 进货额
  shareAward:Award,                      // 分享奖励
  luckAward:Award,                       // 抽奖奖励
  hot:[{HotItem}],                       // 好友热度值
  nameCard:NameCard,                     //名片
  block:{type:Boolean,default:false},    //是否禁闭用户 true:封号|false:正常启用
  game:Game,                              //用户添加的游戏
  confirm:Confirm                        //领取实物奖励时填写的确认信息
}, { 
  timestamps: true ,
  // toObject: {virtuals: true},
  // toJSON: {virtuals: true}
})

UserSchema.plugin(QueryPlugin)
UserSchema.plugin(findOrCreate)
UserSchema.plugin(autoIncrement, { field: 'shortId', collection: 'User' })
UserSchema.plugin(friends({ pathName: "friends" }));
UserSchema.plugin(mongoose_delete)

//虚拟属性 创收
// UserSchema.virtual('revenue').get(function(){
//   return this.sumPay  + this.purchaseMoney;
// })

//onlineAward 未定义该字段
const clientSelectKeys = 'shortId nickname isGuest level vipLevel sex signature coin storeGold brokeAward  payAward headimgurl count counts mobileAuth sumPay loginAt agentParent curatorParent chessRoomId createdAt money  bank realAuth.auth loginAt token loc playArea device platform shareAward agentStatus agent curator'


UserSchema.statics.findClientUser = function (id: string) {
  return this.findById(id).select(clientSelectKeys).exec()
}

UserSchema.statics.findClientUserByPhone = function (phone: string) {
  return this.findOne({ 'mobileAuth.phone': phone }).select(clientSelectKeys).exec()
}



UserSchema.statics.findGameUser = function (id: string,select:string='shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts curator agent loginAt count.count sumPay') {
  return this.findById(id).select(select).exec()
}

UserSchema.statics.findWechatUser = function (unionid: string) {
  return this.findOne({ 'wechatAuth.unionid': unionid }).select('token shortId nickname isGuest level vipLevel sex signature coin storeGold brokeAward onlineAward payAward headimgurl count counts mobileAuth sumPay loginAt').exec()
}
//代理系统在使用
UserSchema.statics.findUserAndUpdateCard = function (id: string, card: number) {
  return this.findByIdAndUpdate(
    id,
    {
      $inc: {
        'coin.card': card
      }
    },
    { new: true }
  ).select('shortId nickname isGuest level vipLevel sex signature coin headimgurl count counts').exec();
}


UserSchema.statics.byShortIds = function (shortIds: Array<number>) {
  return this.find({ shortId: { $in: shortIds } }).exec();
}

UserSchema.statics.byShortId = function (shortId: number) {
  return this.findOne({ "shortId": shortId }).exec();
}

UserSchema.statics.findPhoneToUserInfo = function (phone: number) {
  return this.find({ "mobileAuth.phone": phone })
    .populate("curator")
    .populate("agent")
    .select("mobileAuth.phone mobileAuth.password mobileAuth.auth coin  shortId nickname money _id createdAt level wechatNumber bank realAuth nameCard") //agent curator
    .exec();
}

/******************************************************************************************************/
/** 以下是大厅业务  都在使用 ****************************************************************************/
/******************************************************************************************************/

const commonSelectKey   = 'shortId nickname sex coin headimgurl shareAward mobileAuth.auth mobileAuth.phone agentParent curatorParent chessRoomId realAuth.auth loc playArea invited block confirm ';
const registerSelectKey = 'shortId nickname sex coin headimgurl shareAward mobileAuth.auth mobileAuth.phone agentParent curatorParent chessRoomId realAuth.auth loc playArea invited block confirm token ';
/**
 * 通过_id查询个人信息
 */
UserSchema.statics.findUserById = function (id: string) {
  return this.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    {
      $set: {
        'loginAt': Date.now()
      }
    },
    { new: true }
  )
  .populate('curator', '-_id enabled block shortId')
  .populate('agent', '-_id enabled block')
  .select(commonSelectKey)
  .exec()
}
/**
 * 通过shortId查询个人信息
 */
UserSchema.statics.findUserByShortId = function (shortId: number) {
  return this.findOneAndUpdate(
    { shortId: shortId },
    {
      $set: {
        'loginAt': Date.now()
      }
    },
    { new: true }
  )
  .populate('curator', '-_id enabled block shortId')
  .populate('agent', '-_id enabled block award')
  .select(registerSelectKey)
  .exec()
}
/**
 * 自定义查询字段 _id
 */
UserSchema.statics.findUserByIdCustomSelect = function(id:string,customSelectKey:string){
  return this.findOne({'_id':mongoose.Types.ObjectId(id)})
  .select(customSelectKey)
  .exec();
}
/**
 * 自定义查询字段 shortId
 */
UserSchema.statics.findUserByShortIdCustomSelect = function(shrotId:number,customSelectKey:string){
  return this.findOne({'shrotId':shrotId})
  .select(customSelectKey)
  .exec();
}

/**
 * 通过token查询用户信息
 */
UserSchema.statics.findClientUserByToken = function (token: string) {
  return this.findOne({ 'token': token })
  .populate('curator', '-_id enabled block shortId ')
  .populate('agent', '-_id enabled block ')
  .select(commonSelectKey)
  .exec()
}
/**
 * 通过unionid查询用户信息
 */
UserSchema.statics.findUserByUnionid = function(unionid:string){
  return this.findOne({ 'wechatAuth.unionid': unionid })
  .populate('curator', '-_id enabled block shortId ')
  .populate('agent', '-_id enabled block ')
  .select(commonSelectKey)
  .exec()
}
/**
 * 通过手机号查询用户信息
 */
UserSchema.statics.findUserByPhone = function (phone: string) {
  return this.findOne({ 'mobileAuth.phone': phone })
  .select(commonSelectKey)
  .exec()
}
/**
 * 获取用户手机号密码
 */
UserSchema.statics.findUserPhonePassword = function(phone:string){
  return this.findOne({ 'mobileAuth.phone': phone })
  .select(' mobileAuth ')
  .exec()
}

/**
 * 更新用户token
 */
UserSchema.statics.findAndUpdateToken = function(id:string,token:string){
  return this.findOneAndUpdate(
    {_id:mongoose.Types.ObjectId(id)},
    {
      $set:{
        'token':token
      }
    },
    { new: true }
  ).select(registerSelectKey).exec()
}
/**
 * 更新用户昵称
 */
UserSchema.statics.updateUserNickname = function (id: string, nickname: string) {
  return this.update({ _id: mongoose.Types.ObjectId(id) }, { $set: { nickname: nickname } }).exec()
}
/**
 * 更新用户位置信息
 */
UserSchema.statics.findAndUpdateLocation = function (id: string, loc: any) {
  return this.update({ _id: id }, { $set: { loc: loc } }).exec()
}
/**
 * 查询指定手机认证用户
 */
UserSchema.statics.findMobileAuthById = function (id: string) {
  return this.findById(id)
    .select('_id mobileAuth')
    .exec()
}
/**
 * 查询指定实名认证用户
 */
UserSchema.statics.findRealAuthById = function (id: string) {
  return this.findById(id)
    .select('_id realAuth')
    .exec()
}
/**
 * 查询指定邀请好友用户相关信息
 */
UserSchema.statics.findInvitedById = function (id: string) {
  return this.findById(id)
    .populate("invited.friends", '_id nickname headimgurl createdAt')
    .select('_id invited')
    .exec()
}
/**
 * 查询指定邀请好友用户
 */
UserSchema.statics.findInviter = function(id:string){
  return this.findOne({_id:mongoose.Types.ObjectId(id)})
  .select('-_id coin.card invited')
  .exec()
}
/**
 * 添加邀请好友
 */
UserSchema.statics.addInvited = function (id: string, friendId: string) {
  return this.update({ _id: mongoose.Types.ObjectId(id) }, { $push: { 'invited.friends': mongoose.Types.ObjectId(friendId) } }).exec()
}
/**
 * 查询是否已邀请过该好友
 */
UserSchema.statics.findInvitedChildById = function (id: string, friendId: string) {
  return this.findOne({ _id: mongoose.Types.ObjectId(id), 'invited.friends': { $in: [mongoose.Types.ObjectId(friendId)] } })
  .select('-_id invited')
  .exec()
}
/**
 * 更新邀请奖励
 */
UserSchema.statics.findAndUpdateInviteAward = function(id:string,card:number,awardIndex:number){
  return this.update(
    {_id:mongoose.Types.ObjectId(id)},
    {
      $push:{
        'invited.award': awardIndex
      },
      $inc:{
        'coin.card': card
      }
    },
    {new:true}
  ).exec()
}
/**
 * 查询是否领取该次奖励
 */
UserSchema.statics.findUserAwardIndex = function(id:string,awardIndex:string){
  return this.findOne({_id:mongoose.Types.ObjectId(id),'invited.award':{$in:[awardIndex]}})
  .select('invited')
  .exec()
}
/**
 * 查询用户详细信息
 */
UserSchema.statics.findUserDetail = function(shortId: string){
  return this.findOne({shortId:shortId}).select('shortId headimgurl nickname sex loc').exec()
}
/**
 * 绑定棋牌室
 */
UserSchema.statics.bindChessRoom = function(id:string,curatorId:string,chessRoomId:number,agentId:string){
  const field:any = {
    'curatorParent':curatorId,
    'chessRoomId':chessRoomId
  }
  if(agentId) field['agentParent'] = agentId;
  return this.update(
    {'_id':mongoose.Types.ObjectId(id)},
    {
      $set:field
    }
  ).exec()
}
/**
 *　成为馆长
 */
UserSchema.statics.bindCurator = function(id:string,curatorId,chessRoomId:number,phone:string,passwrod:string){
  return this.update(
    {'_id':mongoose.Types.ObjectId(id)},
    {
      $set:{
        'curator':curatorId,
        'chessRoomId':chessRoomId,
        'mobileAuth.phone':phone,
        'mobileAuth.password':passwrod,
        'mobileAuth.auth':true
      }
    }
  ).exec()
}
/**
 * 查询指定馆长个人信息
 */
UserSchema.statics.findCuratorById = function(id:string){
  return this.findOne({_id:mongoose.Types.ObjectId(id)})
  .populate('curator', 'enabled block shortId ')
  .select('_id agentParent realAuth.realname mobileAuth.phone')
  .exec()
}
/**
 * 自定义查询馆长信息
 */
UserSchema.statics.findCuratorCustomSelect = function(id:string,customSelectKey:string){
  return this.findOne({_id:mongoose.Types.ObjectId(id)})
  .populate('curator', 'enabled block shortId ')
  .select(customSelectKey)
  .exec()
}
/**
 * 
 * 查询指定馆长个人信息
 */
UserSchema.statics.findCuratorByShortId = function(shortId:number){
  return this.findOne({'shortId':shortId})
  .populate('curator', 'enabled block shortId ')
  .select('_id agentParent realAuth.realname mobileAuth.phone')
  .exec()
}
/**
 * 查询购买用户相关个人信息
 */
UserSchema.statics.findBuyer = function(id:string){
  return this.findOne({ _id:mongoose.Types.ObjectId(id)})
  .select('shortId sumPay coin curatorParent agentParent purchaseMoney')
  .exec()
}
/**
 * 更新用户充值总计和card数量
 */
UserSchema.statics.findAndUpdateUserCoin = function(id:string,card:number,money:number){
  return this.findOneAndUpdate(
    {_id:mongoose.Types.ObjectId(id)},
    {
      $inc:{
        'coin.card' : card,
        'sumPay'  : money
      }
    },
    {new:true}
  ).select('_id shortId coin sumPay').exec()
}
/**
 * 更新馆长收入总计和可提现金额
 */
UserSchema.statics.findAndUpdateCuratorMoney = function(id:string,money:number){
  return this.findOneAndUpdate(
    {
      _id:mongoose.Types.ObjectId(id)
    },
    {
      $inc:{
        'sumMoney':money,
        'money':money
      }
    }
  )
}
/**
 * 更新代理收入总计和可提现金额
 */
UserSchema.statics.findAndUpdateAgentMoney = function(id:string,money:number){
  return this.findOneAndUpdate(
    {
      _id:mongoose.Types.ObjectId(id)
    },
    {
      $inc:{
        'sumMoney':money,
        'money':money
      }
    }
  )
}
/**
 * 查询分享用户相关信息
 */
UserSchema.statics.findShareUser = function(id:string){
  return this.findById(id).select('_id shortId shareAward').exec()
}
/**
 * 更新分享奖励
 */
UserSchema.statics.updateShareAward = function (id: string, card: number) {
  return this.update(
    {_id:id},
    {
      $inc: {
        'coin.card': card,
        'shareAward.count':1
      }
    }
  ).exec()
}
/**
 * 重置分享次数
 */
UserSchema.statics.resetShareAward = function(id:string){
  return this.update(
    {_id:mongoose.Types.ObjectId(id)},
    {
      $set:{
        'shareAward.date':Date.now(),
        'shareAward.count':0
      }
    }
  )
}
/**
 * 更新用户card数量
 */
UserSchema.statics.updateUserCardById = function (id: string, card: number) {
  return this.update(
    {_id:mongoose.Types.ObjectId(id)},
    {
      $inc: {
        'coin.card': card
      }
    }
  ).exec();
}
/**
 *　添加用户游戏
 */
UserSchema.statics.addUserGameById = function(id:string,game:string){
  return this.update(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      '$addToSet':{
        'game.chess':game
      }
    }
  ).exec()
}
/**
 *　删除用户游戏
 */
UserSchema.statics.removeUserGameById = function(id:string,game:string){
  return this.update(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      '$pull':{
        'game.chess':game
      }
    }
  ).exec()
}
//麻将 记录玩家所选地区
UserSchema.statics.updatePlayArea = function(id:string,playArea:string){
  return this.update({_id:mongoose.Types.ObjectId(id)},{$set:{playArea:playArea}}).exec()
}
/**
 * 更新领取实物奖励时的确认信息
 */
UserSchema.statics.updateConfirm = function(id:string,realname:string,identity:string,phone:string){
  return this.update(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      $set:
      {
        'confirm.realname':realname,
        'confirm.identity':identity,
        'confirm.phone':phone
      }
    }
  ).exec()
}

/**以上是大厅业务 ********************************/

/*以下是馆长代理系统使用*/
//馆长解绑管内用户 父id清空 管内卡清零
UserSchema.statics.findUserAndUpdateParentInfo = function (id: string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        "curator": null,
        "curatorParent": null,
        "chessRoomId": null,
      }
    },
    { new: true }
  ).select("curatorParent").exec();
}
//更新用户认证 身份证 姓名
UserSchema.statics.findUserAndUpdateRealAuth = function (id: string, addrCode: number, realname: string,birth:string,addr:string,sex:number,identity, auth: boolean) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        'realAuth.addrCode': addrCode,
        'realAuth.realname': realname,
        'realAuth.birth': birth,
        'realAuth.addr': addr,
        'realAuth.sex': sex,
        'realAuth.identity': identity,
        'realAuth.auth': auth
      }
    },
    { new: true }
  ).select('shortId realAuth').exec();
}

//更新用户认证 省 市
UserSchema.statics.findUserAndUpdateRealAuthCity = function (id: string, city: string, province: string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        'realAuth.city': city,
        'realAuth.province': province,
      }
    },
    { new: true }
  ).select('shortId realAuth').exec();
}
//更新金额
UserSchema.statics.findUserAndUpdateMoney = function (id: string, money: number) {
  return this.findByIdAndUpdate(
    id,
    {
      $inc: {
        'money': money
      }
    },
    { new: true }
  ).select('_id money shortId').exec();
}
//修改银行信息
UserSchema.statics.findUserAndUpdateBankInfo = function (id: string, set:object,select:string = '_id money shortId') {
  return this.findByIdAndUpdate(
    id,
    {
      $set: set
    },
    { new: true }
  ).select(select).exec();
}
//更新密码
UserSchema.statics.findUserAndUpdatePassWordInfo = function (id: string, password: string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        "mobileAuth.password": password
      }
    },
    { new: true }
  ).select("mobileAuth.password _id").exec();
}
//更新微信号
UserSchema.statics.findUserAndUpdatewechatNumberInfo = function (id: string, wechatNumber: string) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        "wechatNumber": wechatNumber
      }
    },
    { new: true }
  ).select("wechatNumber shortId RealAuth").exec();
}

//新增用户
UserSchema.statics.findNewlyAdded = function (id: string) {
  return this.findOne({$and:[{curatorParent:new mongoose.Types.ObjectId(id) },{ "createdAt": { "$gt": moment().subtract(1, 'days') } }]})
  .count()
  .exec();
}

//新增馆长
UserSchema.statics.findNewlyCurator = function (id: string) {
  return this.findOne({$and:[{agentParent:new mongoose.Types.ObjectId(id) },{ "createdAt": { "$gt": moment().subtract(1, 'days') } }]})
  .count()
  .exec();
}

//查找馆长
UserSchema.statics.findCurator = function (shortId: number) {
  return this.findOne({ "shortId": shortId })
  .populate({path:'curator',select:"childCount"})
  .select("createdAt money sumMoney cardConsume sumPay realAuth.realname nickname coin agentParent mobileAuth.phone shortId")
  .exec();
}

UserSchema.statics.findByIds = function (ids:any,select:string = "nickname shortId coin realAuth.realname money sumMoney sumPay purchaseMoney  createdAt cardConsume  curator") {
  return this.find({ "_id": { $in: ids }})
  .select(select)
  .exec();
}

UserSchema.statics.findByCuratorParent = function (id:any, select:string = "sumPay cardConsume") {
  return this.find({ "curatorParent": id})
  .select(select)
  .exec();
}

UserSchema.statics.findByCuratorParents = function (ids:any, select:string = "sumPay cardConsume") {
  return this.find({ "curatorParent": {$in:ids}})
  .select(select)
  .exec();
}

//进货金额累加 
UserSchema.statics.findPurchaseMoney = function (shortId:any, purchaseMoney:number,select:string = "purchaseMoney") {
  return this.findOneAndUpdate(
    {"shortId":shortId},
    {
      $inc: {
        'purchaseMoney': purchaseMoney
      }
    },
  )
  .select(select)
  .exec();
}
//邀请好友名片地址更新
UserSchema.statics.findUpdateFriendCardUrl = function (shortId:any, url:string,select:string = "nameCard.friendCardUrl") {
  return this.findOneAndUpdate(
    {"shortId":shortId},
    {
      $set: {
        'nameCard.friendCardUrl': url
      }
    },
  )
  .select(select)
  .exec();
}
//邀请馆长名片地址更新
UserSchema.statics.findUpdateCuratorCardUrl = function (shortId:any, url:string,select:string = "nameCard.curatorCardUrl") {
  return this.findOneAndUpdate(
    {"shortId":shortId},
    {
      $set: {
        'nameCard.curatorCardUrl': url
      }
    },
  )
  .select(select)
  .exec();
}
//通过shortId查找
UserSchema.statics.findShortId = function (shortId:any,select:string = "nameCard nickname RealAuth ") {
  return this.findOne(
    {"shortId":shortId}
  )
  .select(select)
  .exec();
}
//查找指定字段更新
UserSchema.statics.findFieldUpdate = function (findFieldObj:any,setObj:any,select:string = "_id money shortId") {
  return this.findOneAndUpdate(
    findFieldObj,
    {
      $set: setObj
    },
  )
  .select(select)
  .exec();
}
//通过字段查找
UserSchema.statics.findToField = function (field:any,select:string = "_id ,curatorParent") {
  return this.find(
    field
  )
  .select(select)
  .exec();
}
//查找指定字段更新
UserSchema.statics.findUpdate = function (findFieldObj:any,setObj:any,select:string = "_id money shortId") {
  return this.findOneAndUpdate(
    findFieldObj,
    setObj,
  )
  .select(select)
  .exec();
}

/*以上是馆长代理系统使用*/
export default (app) => {
  return app.mongoose.model('User', UserSchema);
};