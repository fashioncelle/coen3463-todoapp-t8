var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var timestamps = require('mongoose-timestamp');
var tasks = require('./tasks');

mongoose.Promise = Promise;

var usersSchema = new Schema
(
    {
        firstName: {type:String, default: ''},
        lastName: {type:String, default: ''},
        email: {type:String, default: ''},
        tasks: [{
            type: Schema.Types.ObjectId,
            ref: 'tasks'
        }],
        socialLinks: [{
            website: {type: String, default: ''},
            facebook: {type: String, default: ''},
            twitter: {type: String, default: ''},
            instagram: {type: String, default: ''}
        }]
    },
    {
        collection: 'users'
    }
);

usersSchema.plugin(passportLocalMongoose);
usersSchema.plugin(timestamps);

module.exports = mongoose.model('users', usersSchema);