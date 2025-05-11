import { ApiResponse } from "@/utils/response.utils";
import customStripe from "@/lib/stripe";
import dbConnect from "@/lib/db";
import UserSubscriptionModel from "@/models/userSubscription.model";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");

    // Validate query parameters
    if (!sessionId || !userId) {
      return ApiResponse.badRequest(
        "Both 'sessionId' and 'userId' are required."
      );
    }

    // Retrieve the Stripe checkout session
    const session = await customStripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return ApiResponse.notFound("Stripe checkout session not found.");
    }

    const {
      payment_status: paymentStatus,
      status: sessionStatus,
      subscription: stripeSubscriptionId,
    } = session;

    // Look for the user’s subscription in your DB
    const subscription = await UserSubscriptionModel.findOne({
      userId,
      subscriptionId: stripeSubscriptionId || `pending_${sessionId}`,
    });

    if (!subscription) {
      return ApiResponse.notFound("No subscription found for this user.");
    }

    // Determine response message based on subscription status
    let message = "Payment verification failed";
    let isPaid = false;

    if (paymentStatus === "paid") {
      switch (subscription.status) {
        case "active":
          message = "Subscription is active and payment verified successfully.";
          isPaid = true;
          break;
        case "trialing":
          message = "Trial period started successfully.";
          isPaid = true;
          break;
        case "incomplete":
          message = "Payment succeeded but subscription is still incomplete.";
          break;
        default:
          message = `Subscription is in '${subscription.status}' status.`;
      }
    }

    return ApiResponse.success(
      {
        paid: isPaid,
        stripe_status: sessionStatus,
        subscription_status: subscription.status,
        message,
      },
      "Payment status retrieved."
    );
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return ApiResponse.error(
      error.message || "Internal server error",
      error.statusCode || 500
    );
  }
}
