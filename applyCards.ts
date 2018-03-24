import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as autoIncrement from '../extend/autoIncrement';
import * as friends from 'mongoose-friends'
import * as findOrCreate from 'mongoose-findorcreate'
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

  

export const applyCardSchema = new Schema({
  applyId: { type: String, default: '' }, //申请人id
  toCurator: { type: Number, default: '' }, //奖励馆长
  applyInfo:{type: Mixed, default: {}}, //申请内容 cardCount  applyDesc  

  status:{ type: Number, default: '' }, //申请状态0:待审核1：待发放2：已拒绝
  applyAt: { type: Date, default: '' }//申请日期

  
}, {timestamps: true})

applyCardSchema.plugin(QueryPlugin)
applyCardSchema.plugin(findOrCreate)
applyCardSchema.plugin(autoIncrement, { field: 'shortId', collection: 'User' })
applyCardSchema.plugin(friends({pathName: "friends"}));
applyCardSchema.plugin(mongoose_delete)



export default (app) => {
  return app.mongoose.model('ApplyCards', applyCardSchema);
};