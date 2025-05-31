import dbConnect from "@/lib/db";
import customStripe from "@/lib/stripe";
import { getCustomerByEmail, getCustomerById } from "@/lib/stripe.helper.lib";
import UserSubscriptionModel from "@/models/userSubscription.model";
import { verifyToken } from "@/utils/generateToken.utils";
import { ApiResponse } from "@/utils/response.utils";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

    const subscriptions = await UserSubscriptionModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(safeUserId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    const subscription = subscriptions.length > 0 ? subscriptions[0] : null;
    if (!subscription) {
      return ApiResponse.success({
        message: "No subscription found for user.",
        data: null,
      });
    }

    const customerId = subscription.stripeCustomerId;
    const customer = await getCustomerById(customerId);

    if (!customer) {
      return ApiResponse.error("Stripe customer not found.");
    }

    // ✅ Check for attached cards
    const paymentMethods = await customStripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    const isCardAttached = paymentMethods?.data?.length > 0;

    // If card is not attached, generate the billing portal session
    let portalSessionUrl = null;
    if (!isCardAttached) {
      const portalSession = await customStripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url:
          process.env.CUSTOMER_PORTAL_RETURN_URL ||
          "http://localhost:3000/card-portal",
      });

      portalSessionUrl = portalSession.url;
    }

    return ApiResponse.success(
      {
        isCardAttached,
        url: portalSessionUrl, // will be null if card is already attached
      },
      isCardAttached
        ? "Card already attached."
        : "No card found. Billing portal session created."
    );
  } catch (error: any) {
    console.error("Customer portal error:", error);
    return ApiResponse.error(error.message || "Something went wrong.");
  }
}
