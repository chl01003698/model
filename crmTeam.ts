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

//
export const CrmTeamSchema = new Schema({
    
    parent: { type: ObjectId, ref: 'CrmTeam' },
    users: [{ type: ObjectId, ref: 'CrmUser' }],
    //users: [{type:Mixed, default:{}}], //[{parentId:12345,userId: 456789}]
    children: [{ type: ObjectId,ref: 'CrmTeam' }],
    name: { type: String, default: '' }
    //userCount: { type: Number, default: 0 }
}, {timestamps: true})

CrmTeamSchema.plugin(QueryPlugin)
CrmTeamSchema.plugin(findOrCreate)
CrmTeamSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmTeam' })
CrmTeamSchema.plugin(mongoose_delete)

const selectKeys = '_id children users parent name';

CrmTeamSchema.statics.findTeamInfoById = function(id: string){
  return this.findById(id).select(selectKeys).exec();
}

CrmTeamSchema.statics.findTeamInfoByName = function(name: string){
  return this.findOne({name}).select(selectKeys).exec();
}

CrmTeamSchema.statics.updateTeamInfoById = function(id: string, teamInfo: any){
  return this.findByIdAndUpdate(
  id,
  {
    $set:{
        'name': teamInfo.name,
        'parent': teamInfo.parent       
    }
  }
  ).select('_id').exec();
}

//更新用户相关的组织信息
CrmTeamSchema.statics.updateTeamUsersById = function(id, teamInfo: any){
  return this.findByIdAndUpdate(
  id,
  {
    $set:{
        'users': teamInfo.users     
    }
  }
  ).select('_id').exec();
}

// CrmTeamSchema.statics.findParentTeamInfoBy_Id = function(_id){

//   //return this.

// }

CrmTeamSchema.statics.remove = function(id){
  return this.remove({'_id': mongoose.Types.ObjectId(id)}).exec();
}

export default (app) => {
  return app.mongoose.model('CrmTeam', CrmTeamSchema);
};