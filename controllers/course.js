require('dotenv').config()
const courseErrorHandler = require('../validations/course')
const { addCourseToUser } = require('../controllers/user')

const Course = require('../models/course')

const createCourse = async (req) => {
    const errors = await courseErrorHandler(req)

    if (JSON.stringify(errors) !== JSON.stringify({})) { return errors }

    const {title, description, imageUrl, duration } = req.body

    const course = new Course({ title, description, imageUrl, duration, createdAt: new Date(), creator: req.session.userID })

    try {
        await course.save()
        return errors
    } catch (err) {
        errors['error'] = err;
        return errors
    }
}

const getFirstNCoursesOrderByLikes = async (N) => {
    Course.aggregate([{ $addFields: {usersEnrolledCount:{ $size: "usersEnrolled"}} }]);
    return await Course
        .find()
        .sort({usersEnrolledCount: -1})
        .limit(N)
        .lean()
}

const getAllCoursesOrderByCreatedAt = async () => {
    return await Course
        .find()
        .sort({
            'createdAt': 1
        })
        .populate('usersEnrolled')
        .lean()
}

const getCourseById = async (id) => {
    return await Course.findById(id).lean();
}

const enroll = async (id, userID) => {
    await Course.findByIdAndUpdate(id, {
        $addToSet: {
            usersEnrolled: [userID]
        }
    })
    await addCourseToUser(userID, id);
}

const deleteCourseById = async (req) => {
    const courseId = req.params.id
    const isDeleted = await Course.findByIdAndDelete(courseId);
    return isDeleted
}

const editCourseById = async (req) => {
    const objErrors = await courseErrorHandler(req);
    const course = await Course.findById(req.params.id)
  
    if(course.title === req.body.title){
        delete objErrors.title
    }

    if (JSON.stringify(objErrors) !== JSON.stringify({})) {
        return objErrors;
    }

    await Course.findByIdAndUpdate(req.params.id, req.body)
}

const getAllCoursesByWhichIncludetTextInName = async (text) => {
    return await Course.find({
        title: {
            "$regex": text
        }
    }).lean();
}

module.exports = {
    createCourse,
    getFirstNCoursesOrderByLikes,
    getAllCoursesOrderByCreatedAt,
    getCourseById,
    enroll,
    deleteCourseById,
    editCourseById,
    getAllCoursesByWhichIncludetTextInName
};