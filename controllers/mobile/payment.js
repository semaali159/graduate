require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../models");
const asyncHandler = require("express-async-handler");
const s = asyncHandler(async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 6000, // 60.00 USD
      currency: "usd",
      payment_method: "pm_card_visa", // هذا اختصار لبطاقة 4242...
      confirm: true, // يخلي العملية تتم فوراً
      metadata: {
        userId: "123",
        eventId: "456",
        seats: 2,
      },
    });

    res.json(paymentIntent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
const createPaymentIntent = asyncHandler(async (req, res) => {
  try {
    const { eventId, seats = 1 } = req.body;
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

    const userId = req.user.id;

    const event = await db.publicEvent.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "event not found" });

    const totalPrice = event.price * seats;
    console.log(totalPrice);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "usd",
      metadata: {
        userId,
        eventId,
        seats,
      },
      automatic_payment_methods: { enabled: true },
    });
    console.log(paymentIntent);
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "faild" });
  }
});
module.exports = { createPaymentIntent, s };
