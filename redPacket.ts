import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'


const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

export const RedPacketSchema = new Schema({
  sender: { type: ObjectId, ref: 'User', index: true},      //发红包用户
  receivers: [{ type: ObjectId, ref: 'User' }],             //领红包用户
  card: { type: Number, default: 0 },                       //card总数
  every: { type: Number, default: 0 },                      //每个红包card
  count: { type: Number, default: 0 },                      //红包个数    
  desc: { type: String, default: '' },                      //红包说明
  state: { type: Boolean, default: true }                   //红包状态
}, {timestamps: true})

RedPacketSchema.plugin(QueryPlugin)
RedPacketSchema.plugin(mongoose_delete)


RedPacketSchema.statics.findRedPacketById = function(id:string){
  return this.findById(id)
  .populate('sender', ' nickname shortId headimgurl ')
  .populate('receivers',' nickname shortId headimgurl ')
  .select(" card every count desc state receivers ")
  .exec()
}

RedPacketSchema.statics.findReceiverById = function(id:string,receiver:string){
  return this.findOne({ _id: mongoose.Types.ObjectId(id), 'receivers': { $in: [mongoose.Types.ObjectId(receiver)] } })
  .select('-_id receivers')
  .exec()
}

RedPacketSchema.statics.receiveRedPacket = function(id:string,receiver:string){
  return this.findOneAndUpdate(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      $addToSet:
      {
        'receivers':receiver
      }
    },
    {new:true}
  ).select('receivers').exec()
}

RedPacketSchema.statics.findRedPacketCountById = function(id:string){
  return this.findOne(
    {
      '_id':mongoose.Types.ObjectId(id)
    }
  ).select('count receivers').exec()
}

RedPacketSchema.statics.updateStateById = function(id:string){
  console.log('id=>',id);
  return this.findOneAndUpdate(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      $set:
      {
        'state':false
      }
    },
    {new:true}
  ).select('state').exec()
}

RedPacketSchema.statics.removeReveicer = function(id:string,receivers:Array<string>){
  return this.findOneAndUpdate(
    {
      '_id':mongoose.Types.ObjectId(id)
    },
    {
      '$pullAll':
      {
        'receivers':receivers
      }
    },
    {new:true}
  )
  .populate('receivers', 'nickname shortId headimgurl')
  .select('receivers')
  .exec()
}

export default (app) => {
  return app.mongoose.model('RedPacket', RedPacketSchema);
};