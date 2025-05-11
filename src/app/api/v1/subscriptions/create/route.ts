import dbConnect from "@/lib/db";
import customStripe from "@/lib/stripe";
import { getCustomerByEmail } from "@/lib/stripe.helper.lib";
import SubscriptionPlanModel from "@/models/subscriptionPlan.model";
import UserModel from "@/models/userSchema.model";
import UserSubscriptionModel from "@/models/userSubscription.model";
import { ApiResponse } from "@/utils/response.utils";
import { userSubscriptionValidationSchema } from "@/validation/subscriptions/subscriptions";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { error, value } = userSubscriptionValidationSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return ApiResponse.badRequest("Validation Failed..", {
        code: "Validation Error",
        message: error.details[0].message,
      });
    }
    const existingSubscription = await UserSubscriptionModel.findOne({
      userId: value.user_id,
      status: { $in: ["active", "trialing"] },
    });

    if (existingSubscription) {
      return ApiResponse.badRequest("User already has an active subscription");
    }
    const [userDetails, planDetails] = await Promise.all([
      UserModel.findById(value.user_id),
      SubscriptionPlanModel.findOne({ plan_id: value.planId }),
    ]);

    if (!userDetails) {
      return ApiResponse.notFound("User not found");
    }
    console.log("userDetails", planDetails);
    if (!planDetails) {
      return ApiResponse.notFound("Plan not found");
    }

    const stripeCustomerId = await getCustomerByEmail(userDetails.email);

    if (!stripeCustomerId) {
      return ApiResponse.notFound("Stripe customer not found");
    }

    const session = await customStripe.checkout.sessions.create({
      customer: stripeCustomerId.id,
      mode: "subscription",
      payment_method_types: ["card"],
      // customer_email: userDetails.email,
      line_items: [
        {
          price: planDetails.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/payment?success=true&sessionId={CHECKOUT_SESSION_ID}&plan=${planDetails.plan_id}&customer=${stripeCustomerId.id}&userId=${userDetails._id}`,
      cancel_url: `http://localhost:3000/payment?canceled=true&plan=${planDetails.plan_id}`,
      subscription_data: {
        trial_period_days: 1,
        metadata: {
          userId: userDetails._id.toString(),
          planId: planDetails._id.toString(),
        },
      },
      metadata: {
        userId: userDetails._id.toString(),
        planId: planDetails._id.toString(),
      },
    });
    await UserSubscriptionModel.findOneAndUpdate(
      {
        userId: userDetails._id,
        status: "incomplete",
      },
      {
        userId: userDetails._id,
        planId: planDetails._id,
        status: "incomplete",
        stripeCustomerId: stripeCustomerId.id,
        subscriptionId: "pending_" + session.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        paymentMethodId: "pending",
        isTrial: false,
      },
      { upsert: true, new: true }
    );
    return ApiResponse.success(
      {
        sessionId: session.id,
        sessionUrl: session.url,
      },
      "Checkout Session Created Successfully"
    );
  } catch (error: any) {
    console.error("Subscription creation error:", error);
    return ApiResponse.error("Internal Server Error.", 500, {
      code: "Internal Server error",
      message: error.message,
    });
  }
}
