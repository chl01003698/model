import * as mongoose from 'mongoose';
import * as QueryPlugin from 'mongoose-query';
import * as moment from 'moment'
import * as mongoose_delete from 'mongoose-delete'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
/**
 * 活动
 */
export const ActivitySchema = new Schema({
    app: { type: String, default: 'public' },   // poker:扑克 | mahjong:麻将 | public:公共
    title: { type: String, default: '' },       // 活动标题
    btnTitle: { type: String, default: '' },    // 活动按钮标题
    content: { type: String, default: '' },     // 活动文字内容
    weight: { type: Number, default: 0 },       // 活动权重,数字越大权重越高
    imageurl: { type: String, default: '' },    // 活动图片URL
    link: { type: String, default: '' }         // 活动跳转链接
}, { timestamps: true })

ActivitySchema.plugin(QueryPlugin)
ActivitySchema.plugin(mongoose_delete)


ActivitySchema.statics.removeActivity = function (id: string) {
    return this.remove({ _id: mongoose.Types.ObjectId(id) }).exec()
}

ActivitySchema.statics.removeActivities = function (ids: Array<string>) {
    return this.remove({ '_id': { $in: ids } }).exec()
}

ActivitySchema.statics.findLast7DaysActivities = function (app:string) {
    const queryKey = {$in:[app,'public']}; 
    return this.find({'app':queryKey, createdAt: { $gte: moment().subtract(7, 'days').toDate() } })
        .select('link imageurl weight btnTitle')
        .sort({ weight: -1 })
        .exec()
}

export default (app) => {
    return app.mongoose.model('Activity', ActivitySchema);
};