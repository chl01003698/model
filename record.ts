import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const RecordSchema = new Schema({
  owner: {type: ObjectId, ref: 'User'},  // 游戏房主
  game: {type: String, required: true,index:true},  // 游戏类型
  type: { type: String },               // 玩法类型
  roomId: { type: String, required: true},  // 房间ID
  chessRoomId:{type:Number,default:0},      // 棋牌室ID
  roundCount: {type: Number, default: 0},  // 总局数
  currentRound: {type: Number, default: 0},  // 当前第几局
  config: {type: Mixed, default: {}, required: true}, // 房间配置
  done: { type: Boolean, defualt: false },  // 是否已打完
  startAt: { type: Date },  // 游戏开始时间
  players: [{
    user: { type: ObjectId, ref: 'User', index: true },  // 玩家信息
    score: { type: Number, default: 0 },  // 玩家得分
    winCount: { type: Number, default: 0 },  // 胜局次数
    loseCount: { type: Number, default: 0 },  // 输局次数
    drawCount: { type: Number, default: 0 }   // 平局次数
  }],
  rounds: { type: Mixed, default: []},  // 每一局的详细数据
  playbackIds: [{type: String}],  // 回放id
  payUIds: [{type: String}]  // 支付玩家ID
}, {timestamps: true})

RecordSchema.plugin(QueryPlugin)
RecordSchema.plugin(mongoose_delete)

RecordSchema.statics.findRecordBriefsByUserId = function(userId: string) {
  return this.find({ 'players.user': new mongoose.Types.ObjectId(userId) })
  .populate('players.user', 'nickname shortId isGuest headimgurl')
  .select('-playbackIds -rounds')
  .limit(30)
  .sort({createdAt: -1})
  .exec()
}

RecordSchema.statics.findRecordBriefsByUserIdAndGame = function(userId: string,game:string) {
  return this.find({'players.user': new mongoose.Types.ObjectId(userId),'game':game})
  .populate('players.user', 'nickname shortId isGuest headimgurl')
  .select('-__v -deleted -updatedAt')
  .limit(30)
  .sort({createdAt: -1})
  .exec()
}

RecordSchema.statics.findRecordBriefsByOwnerId = function(userId: string,game:string) {
  return this.find({ 'owner': new mongoose.Types.ObjectId(userId),'game':game })
  .populate('players.user', 'nickname shortId isGuest headimgurl')
  .select('-__v -deleted -updatedAt')
  .limit(30)
  .sort({createdAt: -1})
  .exec()
}

RecordSchema.statics.findRecordBriefsByChessRoomId = function(chessRoomId: number,game:string) {
  return this.find({ 'chessRoomId': chessRoomId,'game':game })
  .populate('players.user', 'nickname shortId isGuest headimgurl')
  .select('-__v -deleted -updatedAt')
  .limit(30)
  .sort({createdAt: -1})
  .exec()
}

RecordSchema.statics.findRecordById = function(id: string) {
  return this.findById(id)
  .populate('players.user', 'nickname shortId isGuest headimgurl')
  .exec()
}

export default (app) => {
  return app.mongoose.model('Record', RecordSchema);
};