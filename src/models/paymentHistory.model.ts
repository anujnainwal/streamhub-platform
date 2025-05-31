import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeInvoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
    // Always store this: Stripe's external subscription ID
    stripeSubscriptionId: {
      type: String,
      required: true,
      Comment: "This is the Stripe subscription ID, not the internal one.",
    },

    // Optional: internal reference to another sub-doc/model if needed
    subscriptionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
      default: null,
      Comment:
        "Optional: internal reference to another sub-doc/model if needed",
    },

    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["paid", "failed", "open", "void", "uncollectible"],
      required: true,
    },
    paidAt: {
      type: Date,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    hostedInvoiceUrl: {
      type: String,
    },
    receiptUrl: {
      type: String,
    },
    rawStripeInvoice: {
      type: mongoose.Schema.Types.Mixed, // optional full payload
    },
  },
  { timestamps: true }
);

paymentHistorySchema.index({ userId: 1, paidAt: -1 });

const PaymentHistory =
  mongoose.models.PaymentHistory ||
  mongoose.model("PaymentHistory", paymentHistorySchema);

export default PaymentHistory;
