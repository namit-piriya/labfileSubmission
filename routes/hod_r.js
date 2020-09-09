const hodController = require('../controllers/hod_c');
const router = require('express').Router();
const isAuthorized = require('../middleware/middleware').isAuthorized;

router.post("/save_curriculum", isAuthorized, hodController.saveCurriculum);

router.post("/update_curriculum", isAuthorized, hodController.updateCurriculum);

router.get("/get_unverified_users", isAuthorized, hodController.getUnverifiedUsers);

router.get("/verify_user/:email", isAuthorized, hodController.verifyUser);

router.post("/add_sub_to_teacher", isAuthorized, hodController.addSubToTeacher);

// router.get("/info_of_sem/:sem",isAuthorized,hodController.infoOfSem);

// router.get("/get_subject_in_sem", isAuthorized, hodController.getSubInSem);

// router.get("/get_unassigned_subjects", isAuthorized, hodController.getUnassignedSubjects);

// router.get("generate_marksheet_of_subject", isAuthorized, hodController.generateMarksheet);


module.exports = router;