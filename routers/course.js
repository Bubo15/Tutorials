const { Router } = require('express');
const { getUserStatus, isAuthenticated } = require('../controllers/auth');
const { createCourse, getCourseById, enroll, deleteCourseById, editCourseById } = require('../controllers/course');

const router = Router();

router.get('/create/course', isAuthenticated,  getUserStatus, async (req, res) => {
    return res.render('create-course', {
        isLogged: req.isLogged,
        username: req.session.username,
    })
})

router.post('/create/course', getUserStatus, async (req, res) => {
    const areThereErrors = await createCourse(req)
    const course = {title, description, imageUrl, duration} = req.body

    if(JSON.stringify(areThereErrors) !== JSON.stringify({})){
        return res.render('create-course', {
            username: req.session.username,
            errors: areThereErrors,
            isLogged: req.isLogged,
            course
        })
    }

    return res.redirect('/')
})

router.get('/details/course/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const course = await getCourseById(req.params.id)

    const isAlreadyEnroll = course.usersEnrolled.map(id => JSON.stringify(id)).includes(`"${req.session.userID}"`)
    const isCurrentUserCreator = JSON.stringify(course.creator) === JSON.stringify(req.session.userID)

    return res.render('course-details', {
        username: req.session.username,
        isLogged: req.isLogged,
        isCurrentUserCreator,
        isAlreadyEnroll,
        course
    })
})

router.get('/enroll/course/:id', isAuthenticated, async (req, res) => {
    await enroll(req.params.id, req.session.userID);
    res.redirect('/details/course/' + req.params.id)
})

router.get('/edit/course/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const course = await getCourseById(req.params.id)
 
    res.render('edit-course', {
        username: req.session.username,
        isLogged: req.isLogged,
        course
    })
})

router.post('/edit/course/:id', getUserStatus, async (req, res) => {
    const areThereErrors = await editCourseById(req)
    const course = await getCourseById(req.params.id);
 
    if (areThereErrors && areThereErrors.length !== 0) {
        return res.render('edit-course', {
            username: req.session.username,
            errors: areThereErrors,
            isLogged: req.isLogged,
            course
        })
    }

    return res.redirect('/details/course/' + course._id)
})

router.get('/delete/course/:id', isAuthenticated, async (req, res) => {
    const isDeleted = await deleteCourseById(req);

    if (isDeleted) {
        return res.redirect('/')
    }

    return res.status(404);
})

module.exports = router;