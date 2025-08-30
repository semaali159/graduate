const express = require("express");
const { createPaymentIntent, s } = require("../../controllers/mobile/payment");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/create-payment", verifyToken, s);
module.exports = router;
