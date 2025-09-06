const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../models");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(" Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const { userId, eventId, seats } = paymentIntent.metadata;
      console.log(`555555${userId}`);
      console.log(`555555${eventId}`);
      console.log(`5566${seats}`);
      try {
        await db.payment.create({
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: "succeeded",
          userId,
          eventId,
        });

        await db.attendee.create({
          userId,
          eventId,
          seats,
          // availableSeats: seats,
        });

        const eventRecord = await db.publicEvent.findByPk(eventId);
        if (eventRecord) {
          eventRecord.availableSeats -= seats;
          await eventRecord.save();
        }
        console.log(`123${eventRecord}`);
        console.log("Payment processed successfully");
      } catch (err) {
        console.error("DB update failed:", err);
      }
      break;
    }

    case "payment_intent.payment_failed":
      console.warn("Payment failed:", event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = handleStripeWebhook;
