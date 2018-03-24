import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
/**
 * 服务器状态
 */
export const ServerSchema = new Schema({
  app:{type:String,default:''},　　           //poker:棋牌,mahjong:麻将
  name:{type:String,default:''},             //服务器名称                                
  state:{type:String,default:''},            //服务器状态    'start' 'stop'
  link:{type:String,default:''},             //维护公告页面地址
  startTime:{type:Date,default:Date.now()},　//停服时间
  stopTime:{type:Date,default:Date.now()}　　//开服时间
}, {timestamps: true})

ServerSchema.plugin(QueryPlugin)
ServerSchema.plugin(mongoose_delete)

ServerSchema.statics.findPokerServer = function(){
    return this.findOne({'app':'poker'})
    .select('app name state link startTime stopTime')
    .exec()
}

ServerSchema.statics.findMahjongServer = function(){
    return this.findOne({'app':'mahjong'})
    .select('app name state link startTime stopTime')
    .exec()
}

ServerSchema.statics.createPokerServer = async function(){
    let poker = await this.findPokerServer();
    if(poker) return poker._id;
    poker = await this.create(
        {
            'app':'poker',
            'name':'棋牌',
            'state':'start',
            'link':'',
            'startTime':'',
            'stopTime':''
        }
    )
    return poker._id;
}

ServerSchema.statics.createMahjongServer = async function(){
    let mahjong = await this.findMahjongServer();
    if(mahjong) return mahjong._id;
    mahjong = await this.create(
        {
            'app':'mahjong',
            'name':'麻将',
            'state':'start',
            'link':'',
            'startTime':'',
            'stopTime':''
        }
    )
    return mahjong._id;
}

ServerSchema.statics.startPokerServer = function(){
    return this.findOneAndUpdate(
        {
            'app':'poker'
        },
        {
            '$set':
            {
                'state':'start'
            }
        },
        {new:true}
    ).select('state').exec()
}

ServerSchema.statics.stopPokerServer = function(){
    return this.findOneAndUpdate(
        {
            'app':'poker'
        },
        {
            '$set':
            {
                'state':'stop'
            }
        },
        {new:true}
    ).select('state').exec()
}

ServerSchema.statics.startMahjongServer = function(){
    return this.findOneAndUpdate(
        {
            'app':'mahjong'
        },
        {
            '$set':
            {
                'state':'start'
            }
        },
        {new:true}
    ).select('state').exec()
}

ServerSchema.statics.stopMahjongServer = function(){
    return this.findOneAndUpdate(
        {
            'app':'mahjong'
        },
        {
            '$set':
            {
                'state':'stop'
            }
        },
        {new:true}
    ).select('state').exec()
}

export default (app) => {
  return app.mongoose.model('Server', ServerSchema);
};