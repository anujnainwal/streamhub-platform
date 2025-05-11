import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    plan_id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Plan description is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["BASIC", "STANDARD", "PREMIUM", "ENTERPRISE"],
      default: "BASIC",
      required: true,
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
        uppercase: true,
      },
    },

    interval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      default: "DAILY",
      required: true,
    },

    features: [
      {
        name: String,
        included: Boolean,
        limit: Number,
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DEPRECATED"],
      default: "ACTIVE",
    },

    stripeProductId: {
      type: String,
      trim: true,
      default: null,
    },

    stripePriceId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

planSchema.index({ plan_id: 1, status: 1 });
planSchema.index({ type: 1, interval: 1 });

const SubscriptionPlanModel =
  mongoose.models.SubscriptionPlan ||
  mongoose.model("SubscriptionPlan", planSchema);

export default SubscriptionPlanModel;
