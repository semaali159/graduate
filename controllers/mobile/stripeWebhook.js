const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../models");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const { userId, eventId, seats } = paymentIntent.metadata;

      console.log(">>> Metadata:", userId, eventId, seats);

      const t = await db.sequelize.transaction();

      try {
        const newPayment = await db.payment.create(
          {
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: "succeeded",
            userId,
            eventId,
          },
          { transaction: t }
        );
        await db.attendee.create(
          {
            userId,
            eventId,
            seats,
            // availableSeats: seats,
            paymentId: newPayment.id,
          },
          { transaction: t }
        );

        const eventRecord = await db.publicEvent.findByPk(eventId, {
          transaction: t,
        });

        if (eventRecord) {
          eventRecord.availableSeats -= seats;
          await eventRecord.save({ transaction: t });
        }

        await t.commit();
        console.log("Payment + Attendee processed successfully");
      } catch (err) {
        await t.rollback();
        console.error("Transaction failed, rolled back:", err);
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
