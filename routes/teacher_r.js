const router = require("express").Router();
const isAuthorized = require("../middleware/middleware").isAuthorized;
const teacherController = require("../controllers/teacher_c");

router.post("/register_teacher", teacherController.registerTeacher);

// router.post("/add_no_of_files", isAuthorized, teacherController.addNoOfFiles);

// get email and dept from the token no need to send any data
router.get(
  "/get_assigned_subjects",
  isAuthorized,
  teacherController.getAssignedSubjects
);

// router.get("/assign_due_date", isAuthorized, teacherController.assignDueDate);

module.exports = router;