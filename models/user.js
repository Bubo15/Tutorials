const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
    },

    enrolledCourses : [{
        type: ObjectId,
        ref: 'Course'
    }]
})

module.exports = mongoose.model('User', UserSchema);