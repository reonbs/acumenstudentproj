const db = require('../startup/db');
// const request = require('request'); 
const config = require('config');
const query = require('array-query');
const { date } = require('joi');
const fetch = require('node-fetch');
const { doc } = require('../startup/db');


class CourseService{

     async getCourses(){
            try {
          
              const response = await fetch(config.get('availablecourses'))
              const courses = await response.json();

              return courses;

            } catch (error) {
              console.log(error.response.body);
            }
    }

    async createEnrollment(enrollment){

        if(!enrollment.course_id)
            return {status: "FAILED", message : "course id is required"}

        //temp get all courses 
        const courses = await this.getCourses();

        var course = query('id').is(enrollment.course_id).on(courses);

        if(course.length <= 0)
            return {status: "FAILED", message : "course id not found"}

        const enrollments = db.collection('enrollments');

        //verify user exists
        const courseEnrollments = await enrollments
        .where('course_id', "==", enrollment.course_id)
        .where('student_id', "==",enrollment.student_id).get();

        if(!courseEnrollments.empty)
            return {status:"FAILED", message : "course enrollment  exist"};

        const enrollmentObj = {
            student_id : enrollment.student_id,
            course_id : enrollment.course_id,
            course_name : course[0].title,
            registration_date: new Date()
        }

        var res = await enrollments.add(enrollmentObj);

        
        //get student number of enrollment
        const courseEnrollmentsCount = await enrollments
        .where('student_id', "==",enrollment.student_id).get();

        let count = courseEnrollmentsCount.docs.length;

        return {status :"SUCCESS" , message : `you have ${count} enrollment(s)`}
    }

    async ListEnrollments(){
        const enrollmentsCol = await db.collection('enrollments');

        const _enrollments = await enrollmentsCol.get();

        let enrollments = [];

        _enrollments.forEach(_data => {
            const data = _data.data();

            const items = {
                student_id : data.student_id,
                course_name : data.course_name,
                registration_date : data.registration_date

            };

            enrollments.push(items);
        });

        return {enrollments};

    }

    async DeleteEnrollment(enrollemtId){

        if(!enrollemtId)
            return {status:"FAILED", message : "invalid enrollment"};

        const enrollments = db.collection('enrollments').doc(enrollemtId);

        if(enrollments.empty)
            return {status:"FAILED", message : "enrollment not found"};

        await enrollments.delete();

        return {status:"SUCCESS", message : "enrollment deleted"}; 
    }
}


module.exports = CourseService