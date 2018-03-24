/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 17:09:37
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 17:46:09
 */
import * as Bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Application } from 'egg';
import { Document, Schema } from 'mongoose';

const SALT_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 10
const LOCK_TIME = 30 * 60 * 1000;

/**
 * 用户模型
 */
export default (app: Application) => {
    const mongoose = app.mongoose;

    const userSchema = new mongoose.Schema({
        username: {
            type: Schema.Types.String,
            required: true
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
        nickname: {
            type: Schema.Types.String,
            required: false
        },
        mobile: {
            type: Schema.Types.String
        },
        bindMobile: {
            type: Schema.Types.Boolean,
            default: false
        },
        email: {
            type: Schema.Types.String
        },
        status: {
            type: Schema.Types.Number,
            default: 0
        },//状态：0 正常 1 冻结
        lastLogin: {
            type: Schema.Types.Number
        },
        signed_in_times: {
            type: Schema.Types.Number,
            default: 0
        }, //登陆次数
        firstLogin: {
            type: Schema.Types.Boolean,
            default: true
        },
        needSMScode: {
            type: Schema.Types.Boolean,
            default: true
        },
        last_login_ip: Schema.Types.String,
        last_login_time: Schema.Types.Date,
        last_logout_time: Schema.Types.Date,
        loginTimesToday: {
            type: Schema.Types.Number, default: 0
        },    //今天登陆次数
        lockUntil: {
            type: Schema.Types.Number
        },
        userRoleType: {
            type: Schema.Types.Number,//0.特权用户，忽略ACL, 1.普通用户
            default: 1
        },
        loginEnabled: {
            type: Schema.Types.Boolean,
            default: false
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false
        }
    }, { timestamps: true });

    userSchema.index({ username: 1, isDeleted: 1 }, { unique: true });
    userSchema.index({ nickName: 1 });

    userSchema.virtual('gravatar').get(function(size) {
        if (!size) {
            size = 200;
        }
        if (!this.email) {
            return `https://gravatar.ihuan.me/avatar/?s=${size}&d=retro`;
        }
        const md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return `https://gravatar.ihuan.me/avatar/${md5}?s=${size}&d=retro`;
    });

    userSchema.pre('save', function(next) {
        var ref, ref1, user;
        user = this;
        if (user.isModified('last_logout_time')) {
            this.last_online_time = (((ref = this.last_logout_time) != null ? ref.getTime() : void 0) - ((ref1 = this.last_login_time) != null ? ref1.getTime() : void 0)) / 1000;
        }
        if (user.isModified('password')) {
            console.log("user pre save " + this.password);
            return Bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
                if (err) {
                    return next(err);
                }
                return Bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    return next();
                });
            });
        } else {
            return next();
        }
    });

    userSchema.virtual('passwordHash').set(function(pass, next) {
        var user;
        user = this;
        return Bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) {
                return next(err);
            }
            return Bcrypt.hash(pass, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                return next();
            });
        });
    });

    userSchema.methods.incLoginAttempts = async function() {
        let updates, result;
        if (this.lockUntil && this.lockUntil < Date.now()) {
            result = await this.update({
                $set: {
                    loginAttempts: 1,
                    $unset: {
                        lockUntil: 1
                    }
                }
            });

            return result;
        }
        updates = {
            $inc: {
                loginAttempts: 1
            }
        };
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocaled) {
            updates.$set = {
                lockUntil: Date.now() + LOCK_TIME
            };
        }
        result = await this.update(updates);
        return result;
    };

    userSchema.methods.comparePassword = async function(candidatePassword) {
        try {
            let isMatch = await Bcrypt.compare(candidatePassword, this.password);
            return [null, isMatch];
        } catch (err) {
            return [err];
        }
    };

    userSchema.statics.passwordHash = async function(pwd) {
        let result, hashResult, salt;
        try {
            result = await Bcrypt.genSalt(SALT_FACTOR);
        } catch (e) {
            return [e];
        }

        try {
            hashResult = await Bcrypt.hash(pwd, result.salt);
            return [null, hashResult];
        } catch (err) {
            return [err];
        }
    };

    userSchema.statics.getAuthenticated = async function(query, password, compareName, clientIp, selectField) {
        let user, isMatch, error;

        try {
            if (selectField && Array.isArray(selectField)) {
                user = await this.findOne(query).select(selectField).exec();
            } else {
                user = await this.findOne(query).exec();
            }
        } catch (e_user) {
            return [e_user];
        }

        if (!user) {
            return ['用户不存在'];
        }


        [error, isMatch] = await user[compareName](password);

        if (error) {
            return [error];
        }

        let d, ref;
        if (isMatch) {
            if (!user.loginEnabled) {
                return ['抱歉，你的账号已经被禁用了'];
            }

            d = new Date();
            user.loginTimesToday || (user.loginTimesToday = 0);

            if (d.toDateString() !== ((ref = user.last_login_time) != null ? ref.toDateString() : 0)) {
                user.loginTimesToday = 0;
            } else {
                user.loginTimesToday += 1;
            }

            user.last_login_time = d;
            user.signed_in_times || (user.signed_in_times = 0);
            user.signed_in_times += 1;

            let pre_last_login_ip = user.last_login_ip;

            if (clientIp) {
                user.last_login_ip = clientIp;
            }

            user.save();
            if (!user.loginAttempts && !user.loginEnabled) {
                return [null, user];
            }


            try {
                await user.update({
                    $set: {
                        loginAttempts: 0
                    },
                    $unset: {
                        lockUntil: 1
                    }
                })

                return [null, { ...user.toJSON(), pre_last_login_ip }];
            } catch (e_update) {
                return [e_update];
            }
        } else {
            await user.incLoginAttempts();
            return ['密码错误'];
        }
    };

    return mongoose.model<Document & Relationship.AdminUser>('AdminUser', userSchema);
};
