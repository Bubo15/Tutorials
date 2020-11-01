const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: [true, 'Title is unique']
    },

    description: {
        type: String,
        required: true,
        max: 50
    },

    imageUrl: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
        required: true
    },

    creator: {
        type: ObjectId,
        ref: 'User'
    },

    usersEnrolled: [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Course', CourseSchema);