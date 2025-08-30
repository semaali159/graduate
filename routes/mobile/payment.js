const express = require("express");
const { createPaymentIntent } = require("../../controllers/mobile/payment");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
module.exports = router;
