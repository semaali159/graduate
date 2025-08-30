require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../models");
const asyncHandler = require("express-async-handler");
const s = asyncHandler(async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // المبلغ بالسنت (20.00 USD)
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // عشان يتجاهل طرق الدفع اللي تعمل redirect
      },
      metadata: {
        userId: "151ab96c-a38f-4d26-84be-c693bf20cc5a",
        eventId: 10,
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
