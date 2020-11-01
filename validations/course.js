const Course = require('../models/course')

module.exports = courseErrorHandler = async (req) => {
    const { title, description, imageUrl } = req.body

    let errors = {}

    if(title.length < 5){
        errors['title'] = 'Title must be least 5 characters'
    }else{
        const course = await Course.findOne({ title })
        if (course) {
            errors['title'] = 'Title already exist'
        }
    }

    if(description.length < 20){
        errors['description'] = 'Description must be least 20 characters'
    }else if(description.length > 50){
        errors['description'] = 'Description can not be more then 50 characters'
    }

    if(!(imageUrl.startsWith('http') || imageUrl.startsWith('https'))){
        errors['imageUrl'] = 'Image must start with http or https'
    }
    
    return errors
}