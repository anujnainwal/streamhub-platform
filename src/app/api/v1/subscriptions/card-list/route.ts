import dbConnect from "@/lib/db";
import customStripe from "@/lib/stripe";
import { getCustomerByEmail, getCustomerById } from "@/lib/stripe.helper.lib";
import UserModel from "@/models/userSchema.model";
import UserSubscriptionModel from "@/models/userSubscription.model";
import { encrypt } from "@/utils/encryption.utils";
import { verifyToken } from "@/utils/generateToken.utils";
import { ApiResponse } from "@/utils/response.utils";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("authorization");

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
        message: "No subscription plans found",
        data: null,
      });
    }

    let userDetails = subscription.stripeCustomerId;
    const customer = await getCustomerById(userDetails);
    const setupIntent = await customStripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    const defaultPaymentMethodId = subscription?.paymentMethodId;

    const paymentMethods = await customStripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    if (!paymentMethods.data.length) {
      return ApiResponse.success({
        message: "No cards attached to this customer.",
        data: {
          subscriptionPlan: subscription.plan,
          subscriptionStatus: subscription.status,
          cards: [],
          setupIntentClientSecret: setupIntent.client_secret,
          defaultCardId: null,
        },
      });
    }

    const cards = paymentMethods.data
      .filter((pm) => pm.id && pm.card) // Ensure the card object exists
      .map((pm: any) => {
        let encryptedId = encrypt(pm.id);
        return {
          id: encryptedId,
          brand: pm.card?.brand,
          last4: pm.card?.last4, // <-- Corrected
          expMonth: pm.card?.exp_month, // <-- Corrected
          expYear: pm.card?.exp_year, // <-- Corrected
          funding: pm.card?.funding,
          country: pm.card?.country,
          isDefault: pm.id === defaultPaymentMethodId,
        };
      });

    console.log("==>", cards);

    return ApiResponse.success(
      {
        subscriptionPlan: subscription.plan,
        subscriptionStatus: subscription.status,
        cards,
        // defaultCardId: defaultPaymentMethodId || null,
        setupIntentClientSecret: setupIntent.client_secret,
      },
      "Card Details fetch successfully."
    );
  } catch (error: any) {
    console.log("==>s", error);
    return ApiResponse.error(error.message);
  }
}
