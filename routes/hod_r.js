const hodController = require('../controllers/hod_c');
const router = require('express').Router();
const isAuthorized = require('../middleware/middleware').isAuthorized;

router.all("/save_curriculum", isAuthorized, hodController.saveCurriculum);

router.get("/get_unverified_users", isAuthorized, hodController.getUnverifiedUsers);

router.get("/verify_user/:email", isAuthorized, hodController.verifyUser);

// router.post("/add_sub_to_teacher", isAuthorized, hodController.addSubToTeacher);

// router.get("/get_subject_in_sem", isAuthorized, hodController.getSubInSem);

// router.get("/get_unassigned_subjects", isAuthorized, hodController.getUnassignedSubjects);

module.exports = router;