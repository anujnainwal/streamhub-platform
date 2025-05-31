import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/response.utils";
import { login_user } from "@/validation/auth/auth_validation";
import dbConnect from "@/lib/db";
import UserModel from "@/models/userSchema.model";
import { generateToken } from "@/utils/generateToken.utils";
import UserSubscriptionModel from "@/models/userSubscription.model";

async function getUserSubscriptionStatus(userId: string) {
  const subscription = await UserSubscriptionModel.findOne({ userId });
  if (subscription && subscription.status === "active") {
    return {
      isActive: true,
      isSubscribed: true,
      subscriptionDetails: subscription,
      planId: subscription.planId,
      isCardAttched: !!subscription.paymentMethodId,
    };
  }
  return {
    isActive: false,
    isSubscribed: false,
    subscriptionDetails: null,
    planId: null,
    isCardAttched: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { error, value } = login_user.validate(body, { abortEarly: false });
    if (error) {
      return ApiResponse.badRequest("Validation failed", {
        code: "Validation Error",
        message: error.details[0].message,
      });
    }
    const user = await UserModel.findOne({
      email: value.email.toLowerCase(),
    }).select("+password");
    if (!user) {
      return ApiResponse.unauthorized("Invalid email or password");
    }
    const isValidPassword = await user.comparePassword(value.password);
    if (!isValidPassword) {
      return ApiResponse.unauthorized("Invalid email or password");
    }
    const subscriptionStatus = await getUserSubscriptionStatus(user._id);

    const userData = user.toJSON();
    let extendedUserData = {
      ...userData,
      isSubscritionActive: subscriptionStatus?.isActive,
      isSubscribed: subscriptionStatus?.isSubscribed,
      subscribePlanId: subscriptionStatus?.planId,
      isCardAttched: subscriptionStatus?.isCardAttched,
    };

    const accessToken = await generateToken({ _id: user._id });
    return ApiResponse.success(
      { userInfo: extendedUserData, token: accessToken },
      "Login successful"
    );
  } catch (error: any) {
    return ApiResponse.error("Login failed", 500, error);
  }
}
