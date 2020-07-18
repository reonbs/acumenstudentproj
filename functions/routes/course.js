const express = require('express');

const auth = require('../middleware/auth');

const asycMiddleware = require('../middleware/async');

const router = express.Router();

const courseController = require('../controllers/course');

router.post('/', auth, asycMiddleware(courseController.Courses));

router.post('/enrollment', auth, asycMiddleware(courseController.CreateEnrollment));

router.delete('/deleteenrollment/:id', auth, asycMiddleware(courseController.DeleteEnrollment));

router.get('/listenrollments', auth, asycMiddleware(courseController.ListEnrollments));

module.exports = router;