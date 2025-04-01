const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        enum:['user','admin'],
        type:String,
        default:'user'

    },
    profilePic: {
        type: String,
        default: 'https://www.w3schools.com/howto/img_avatar.png'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now()
    }
}, {timestamps:true})

