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

  
export const RoleSchema = new Schema({
  name: { type: String, required: true },//管理员、高级总监、区域总监、高级经理、团队经理、推广员
  isReview: {type: Number, required: true},//有无房卡审核权限 0:无 1: 有
  isApply: {type: Number, required: true} //有无房卡申请权限 0:无 1: 有  
}, {timestamps: true})

RoleSchema.plugin(QueryPlugin)
// RoleSchema.plugin(autoIncrement, { field: 'shortId', collection: 'CrmRole' })
RoleSchema.plugin(mongoose_delete)

RoleSchema.statics.findByRoleName =  function(name: string){
  return this.findOne({'name':name}).select('name isReview').exec();
}

RoleSchema.statics.findByRoleId =  function(id: string){
  return this.findById(id).select('name isReview').exec();
}

RoleSchema.statics.queryRoleList =  function(){
  return this.find({}).select('name').exec();
}

RoleSchema.statics.findAndUpdateRoleName = function(roleInfo: any){

  return this.findByIdAndUpdate(
    roleInfo.id,
    {
      $set:{
        "name": roleInfo.name,
        "isReview": roleInfo.isReview,
        "isApply":roleInfo.isApply
      }
    },
    {new: true}
  ).select("name").exec();
}

RoleSchema.statics.delete = function(id: string){
  return this.findByIdAndRemove(
    id
  ).select(id).exec();
}

export default (app) => {
  return app.mongoose.model('CrmRole', RoleSchema);
};