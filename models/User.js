const mongoose = require('mongoose');

const UserScherma = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email : {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password : {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ''
    },
    coverPicture: {
        type: String,
        default: ''
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    sex: {
        type: String,
        enum: ['M', 'F', 'Not Binary'],
    },
    age: {
        type: Number,
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: ['single', 'in a relationship', 'married']
    }
},
{ timestamps:true});

module.exports = mongoose.model('User', UserScherma);