import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripeApiVersion =
  (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion) || "2022-08-01";

const customStripe = new Stripe(stripeSecretKey, {
  apiVersion: stripeApiVersion,
});

export default customStripe;
