const router = require("express").Router();
const appController = require("../controllers/app_c");

router.get("/get_dept", appController.getDept);

module.exports = router;
