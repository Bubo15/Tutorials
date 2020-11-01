const { Router } = require('express');
const { getUserStatus, isAuthenticated } = require('../controllers/auth');
const { getFirstNCoursesOrderByLikes, getAllCoursesOrderByCreatedAt, getAllCoursesByWhichIncludetTextInName } = require('../controllers/course')

const router = Router();

router.get('/', getUserStatus, async (req, res) => {
    const courses = req.isLogged ? await getAllCoursesOrderByCreatedAt() : await getFirstNCoursesOrderByLikes(3)
    return res.render('home', {
        username: req.session.username,
        isLogged: req.isLogged,
        courses
    })
})

router.get('/search', isAuthenticated, getUserStatus, async (req, res) => {
    const text = req.query.text;
    const courses = await getAllCoursesByWhichIncludetTextInName(text)

    return res.render('home', {
        username: req.session.username,
        isLogged: req.isLogged,
        courses
    })
})

module.exports = router;