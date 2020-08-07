const router = require('express').Router();
const isAuthorized = require('../middleware/middleware').isAuthorized;
const teacherController = require('../controllers/teacher_c');

router.post("/register_teacher", teacherController.registerTeacher);

// router.post("/add_no_of_files", isAuthorized, teacherController.addNoOfFiles);

// router.get("/get_unverified_students", isAuthorized, teacherController.unVerifiedStudents);

// router.get("/assign_due_date", isAuthorized, teacherController.assignDueDate);

module.exports = router;