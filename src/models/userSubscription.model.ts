import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
  {
    // Reference to the user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the plan
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    // Stripe identifiers
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
    paymentMethodId: {
      type: String,
      required: false,
    },

    // Subscription period
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },

    // Trial info
    isTrial: {
      type: Boolean,
      default: false,
    },
    trialStart: {
      type: Date,
      default: null,
    },
    trialEnd: {
      type: Date,
      default: null,
    },

    // Lifecycle timestamps
    canceledAt: {
      type: Date,
      default: null,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    resumeAt: {
      type: Date,
      default: null,
    },

    // Status: matches Stripe status
    status: {
      type: String,
      enum: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      default: "incomplete",
    },

    // Subscription renewal status
    isRenewing: {
      type: Boolean,
      default: true, // by default, it will auto-renew
    },

    // Payment status for current cycle
    paymentStatus: {
      type: String,
      enum: ["paid", "due", "failed", "pending"],
      default: "pending",
    },

    // If subscription ended, why?
    expirationReason: {
      type: String,
      enum: ["user_cancelled", "payment_failed", "admin", "paused", null],
      default: null,
    },

    // Optional: For audit/debugging
    metadata: {
      type: Object,
      default: {},
    },

    // Optional: Event history
    history: [
      {
        type: {
          type: String, // e.g., "upgrade", "pause", "resume", "payment_failed"
        },
        status: String,
        note: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ currentPeriodEnd: 1 });
userSubscriptionSchema.index({ trialEnd: 1 }, { sparse: true });
userSubscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

const UserSubscription =
  mongoose.models.UserSubscription ||
  mongoose.model("UserSubscription", userSubscriptionSchema);

export default UserSubscription;
