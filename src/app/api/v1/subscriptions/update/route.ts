import dbConnect from "@/lib/db";
import customStripe from "@/lib/stripe";
import { getCustomerByEmail, getCustomerById } from "@/lib/stripe.helper.lib";
import UserSubscriptionModel from "@/models/userSubscription.model";
import SubscriptionPlanModel from "@/models/subscriptionPlan.model";
import { verifyToken } from "@/utils/generateToken.utils";
import { ApiResponse } from "@/utils/response.utils";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(
        "Authorization header is missing or malformed."
      );
    }

    const token = authHeader.substring(7);
    const result = await verifyToken(token);

    const userId =
      typeof result?._id === "object" && (result?._id as any)?.buffer
        ? Buffer.from(Object.values((result?._id as any).buffer)).toString(
            "hex"
          )
        : result?._id;

    const safeUserId = typeof userId === "string" ? userId : String(userId);

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return ApiResponse.badRequest("Missing required fields.");
    }
    const subscriptionPlan = await SubscriptionPlanModel.findOne({
      plan_id: planId,
    });
    if (!subscriptionPlan) {
      return ApiResponse.notFound("Subscription plan not found.");
    }

    const userSubscription = await UserSubscriptionModel.findOne({
      userId: safeUserId,
    });
    if (!userSubscription) {
      return ApiResponse.notFound("User subscription not found.");
    }

    let stripeSubscriptionId = userSubscription.stripeSubscriptionId;

    const subscription = await customStripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    const oldItemId = subscription.items.data[0]?.id;
    if (!oldItemId) {
      return ApiResponse.error("Subscription item not found.");
    }

    let newSubscriptionDetails = await customStripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: oldItemId,
            price: subscriptionPlan.stripePriceId,
          },
        ],
        metadata: {
          userId: safeUserId,
          planId: `${subscriptionPlan._id}`,
        },
        proration_behavior: "create_prorations",
      }
    );

    userSubscription.planId = subscriptionPlan._id;
    userSubscription.stripeSubscriptionId = newSubscriptionDetails.id;
    userSubscription.paymentMethodId = "null";
    await userSubscription.save();

    return ApiResponse.success("Subscription plan updated successfully.");
  } catch (error) {
    console.error("PUT subscription error:", error);
    return ApiResponse.error("Failed to update subscription.");
  }
}
