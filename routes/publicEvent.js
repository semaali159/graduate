const express = require("express");
const { createEvent } = require("../controllers/publicEvent");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createEvent);
// router.get("/", getAllInterests);
// router.get("/:id", getInterestById);
// router.put("/:id", updatePhotograph);
module.exports = router;
