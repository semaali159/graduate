const express = require("express");
const {
  createInterest,
  getAllInterests,
  getInterestById,
} = require("../../controllers/mobile/interest");
const router = express.Router();
router.post("/", createInterest);
router.get("/", getAllInterests);
router.get("/:id", getInterestById);
// router.put("/:id", updatePhotograph);
module.exports = router;
