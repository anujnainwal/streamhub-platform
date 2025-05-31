import customStripe from "@/lib/stripe";
import UserSubscriptionModel from "@/models/userSubscription.model";
import dbConnect from "@/lib/db";
import { ApiResponse } from "@/utils/response.utils";
import { headers } from "next/headers";
import { subscriptionPlanValidationSchema } from "@/validation/subscriptions/subscriptions";

const endpointSecret = process.env.STRIPE_WEBHOOK_KEY!;

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return ApiResponse.error("No signature found", 400);
    }

    let event;
    try {
      event = customStripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      return ApiResponse.error(`Webhook Error: ${err.message}`, 400);
    }

    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        await handleSubscriptionCreated(subscription);
        return ApiResponse.success(
          { event: event.type },
          "Subscription created successfully"
        );
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        return ApiResponse.success(
          { event: event.type },
          "Subscription updated successfully"
        );
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        return ApiResponse.success(
          { event: event.type },
          "Subscription canceled successfully"
        );
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
        return ApiResponse.success(
          { event: event.type },
          "Event acknowledged but not processed"
        );
      }
    }
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return ApiResponse.error(
      error.message || "Webhook processing failed",
      error.statusCode || 500
    );
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const metadata = subscription.metadata || {};
  const isTrial = subscription.status === "trialing" ? true : false;
  const subscriptionData = {
    userId: metadata.userId,
    planId: metadata.planId,
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    isTrial: isTrial,
    paymentMethodId: subscription.default_payment_method || "none",
  };

  const result = await UserSubscriptionModel.findOneAndUpdate(
    {
      userId: metadata.userId,
      $or: [
        { stripeSubscriptionId: subscription.id },
        { stripeSubscriptionId: `pending_${subscription.id}` },
        {
          status: "incomplete",
          stripeCustomerId: subscription.customer,
        },
      ],
    },
    subscriptionData,
    { upsert: true, new: true }
  );

  if (!result) {
    throw new Error("Failed to create or update subscription record");
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const metadata = subscription.metadata || {};
  const isTrial = subscription.status === "trialing";

  const updateData = {
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    pausedAt: subscription.pause_collection?.pause_at
      ? new Date(subscription.pause_collection.pause_at * 1000)
      : null,
    resumeAt: subscription.pause_collection?.resume_at
      ? new Date(subscription.pause_collection.resume_at * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    isTrial: isTrial,
    paymentMethodId: subscription.default_payment_method || "none",
    paymentStatus: "paid",
  };

  const updated = await UserSubscriptionModel.findOneAndUpdate(
    {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
    },
    updateData,
    { new: true }
  );

  if (!updated) {
    throw new Error(`Subscription not found for update: ${subscription.id}`);
  }
}
async function handleSubscriptionCanceled(subscription: any) {
  let cancelSubscriptionDetails = subscription;
  let updateData = {
    status: cancelSubscriptionDetails.status,
    canceledAt: new Date(cancelSubscriptionDetails.canceled_at * 1000),
    currentPeriodStart: new Date(
      cancelSubscriptionDetails.current_period_start * 1000
    ),
    currentPeriodEnd: new Date(
      cancelSubscriptionDetails.current_period_end * 1000
    ),
    cancelAtPeriodEnd: cancelSubscriptionDetails.cancel_at_period_end,
    isTrial: false,
    trialStart: new Date(cancelSubscriptionDetails.trial_start * 1000),
    trialEnd: new Date(cancelSubscriptionDetails.trial_end * 1000),
    paymentMethodId: cancelSubscriptionDetails.default_payment_method,
  };
  try {
    const updated = await UserSubscriptionModel.findOneAndUpdate(
      {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
      },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      throw new Error(
        `Subscription not found for canceled ID: ${subscription.id}`
      );
    }
    // Optionally store cancellation reason
    // if (subscription.cancellation_details?.reason) {
    //   await SubscriptionEventModel.create({
    //     userId: updated.userId,
    //     subscriptionId: subscription.id,
    //     eventType: "subscription_canceled",
    //     reason: subscription.cancellation_details.reason,
    //     eventPayload: subscription,
    //     triggeredAt: new Date(),
    //   });
    // }
    console.log("subscription cancelled successfully.------>");
  } catch (error: any) {
    console.log("error for subscriotion cancellation.-->", error);
  }
}
