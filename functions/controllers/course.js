const CourseService = require("../services/courseService");
const CourseServiceInstance = new CourseService();

exports.Courses = async (req, res,next) =>{

    var coursesService =  await CourseServiceInstance.getCourses(req.body);
    res.json(coursesService);
}

exports.CreateEnrollment = async (req, res,next) =>{

    var coursesService =  await CourseServiceInstance.createEnrollment(req.body);
    res.json(coursesService);
}

exports.ListEnrollments = async (req, res,next) =>{

    var coursesService =  await CourseServiceInstance.ListEnrollments(req.body);
    res.json(coursesService);
}

exports.DeleteEnrollment = async (req, res,next) =>{

    var coursesService =  await CourseServiceInstance.DeleteEnrollment(req.params.id);
    res.json(coursesService);
}