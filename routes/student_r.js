const router = require('express').Router();

const studentController = require('../controllers/student_c');

router.post("/register_student", studentController.registerStudent);

module.exports = router;