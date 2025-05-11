import mongoosee from "mongoose";

const userSubscriptionSchema = new mongoosee.Schema(
  {
    userId: {
      type: mongoosee.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoosee.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: String,
      required: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    trialStart: {
      type: Date,
      default: null,
    },
    trialEnd: {
      type: Date,
      default: null,
    },
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
    isTrial: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "paused",
        "incomplete",
      ],
      default: "incomplete",
    },

    paymentMethodId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ currentPeriodEnd: 1 });
userSubscriptionSchema.index({ trialEnd: 1 }, { sparse: true });

let UserSubscriptionModel =
  mongoosee.models.UserSubscription ||
  mongoosee.model("UserSubscription", userSubscriptionSchema);

export default UserSubscriptionModel;
