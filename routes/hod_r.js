const hodController = require("../controllers/hod_c");
const router = require("express").Router();
const isAuthorized = require("../middleware/middleware").isAuthorized;

router.post("/save_curriculum", isAuthorized, hodController.saveCurriculum);

router.post("/update_curriculum", isAuthorized, hodController.updateCurriculum);

router.get(
  "/get_unverified_users",
  isAuthorized,
  hodController.getUnverifiedUsers
);

// pass user email in the body as email: to verify that user and user_type as query parameter
router.post("/verify_user", isAuthorized, hodController.verifyUser);

// subName , subcode , and teacherEmail  in the body
router.post("/add_sub_to_teacher", isAuthorized, hodController.addSubToTeacher);

// router.get("/info_of_sem/:sem", isAuthorized, hodController.infoOfSem);

router.get("/info_of_teachers", isAuthorized, hodController.infoOfTeachers);

// router.get("/get_subject_in_sem", isAuthorized, hodController.getSubInSem);

// router.get("/get_unassigned_subjects", isAuthorized, hodController.getUnassignedSubjects);

// router.get("generate_marksheet_of_subject", isAuthorized, hodController.generateMarksheet);

module.exports = router;
