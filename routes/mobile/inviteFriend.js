const express = require("express");
const { inviteFrind } = require("../../controllers/mobile/inviteFriend");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
router.post("/:id", verifyToken, inviteFrind);
// router.get("/", getAllInterests);
// router.get("/:id", getInterestById);
// router.put("/:id", updatePhotograph);
module.exports = router;
