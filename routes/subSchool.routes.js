// subjectRoutes.js
const express = require("express");
const subSchoolController = require("../controllers/subSchoolController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
  "/get_sub_schools",
  paginationMiddleware,
  accessControl([1]),
  subSchoolController.getSubSchoolsController
);

router.get(
  "/get_sub_schools",
  accessControl([1]),
  subSchoolController.getSubSchoolsWithoutBodyController
);

router.get(
  "/get_sub_school/:id",
  accessControl([1]),
  subSchoolController.getSubSchoolController
);

router.post(
  "/create_sub_school",
  accessControl([1]),
  subSchoolController.createSubSchoolController
);

router.put(
  "/update_sub_school/:id",
  accessControl([1]),
  subSchoolController.updateSubSchoolController
);

router.delete(
  "/delete_sub_school/:id",
  accessControl([1]),
  subSchoolController.deleteSubSchoolController
);

module.exports = router;
