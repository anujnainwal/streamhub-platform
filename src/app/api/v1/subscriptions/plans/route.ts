import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/response.utils";
import dbConnect from "@/lib/db";
import { subscriptionPlanValidationSchema } from "@/validation/subscriptions/subscriptions";
import SubscriptionPlanModel from "@/models/subscriptionPlan.model";
import customStripe from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [plans, totalCount] = await Promise.all([
      SubscriptionPlanModel.aggregate([
        {
          $addFields: {
            amount: "$price.amount", // flatten nested price.amount
          },
        },
        {
          $sort: { amount: 1 }, // sort descending
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            stripeProductId: 0,
            stripePriceId: 0,
          },
        },
      ]),
      SubscriptionPlanModel.countDocuments(),
    ]);

    const totalPages = Math.ceil((totalCount ?? 0) / limit);

    return ApiResponse.success(
      {
        plans,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages,
        },
      },
      "Subscription plans fetched successfully."
    );
  } catch (error) {
    return ApiResponse.error(
      "Failed to fetch subscription plans",
      500,
      error as any
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    const { error, value } = subscriptionPlanValidationSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return ApiResponse.badRequest("Validation failed", {
        code: "Validation Error",
        message: error.details[0].message,
      });
    }
    await dbConnect();
    const alreadyPlanExist = await SubscriptionPlanModel.findOne({
      name: value.name,
    });
    if (alreadyPlanExist) {
      return ApiResponse.badRequest("Plan already exist", {
        code: "Validation Error",
        message: "Plan already exist",
      });
    }
    const stripeProduct = await customStripe.products.create({
      name: value.name,
      description: value.description,
    });

    const intervalMap: Record<string, string> = {
      DAILY: "day",
      WEEKLY: "week",
      MONTHLY: "month",
      YEARLY: "year",
    };

    const stripeInterval = intervalMap[value.interval] as
      | "day"
      | "week"
      | "month"
      | "year";

    const stripePrice = await customStripe.prices.create({
      unit_amount: Math.round(value.price.amount * 100),
      currency: value.price.currency.toLowerCase(),
      recurring: {
        interval: stripeInterval,
      },
      product: stripeProduct.id,
    });

    // Save plan in database
    const newPlan = new SubscriptionPlanModel({
      ...value,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    await newPlan.save();

    return ApiResponse.success({ planInfo: newPlan });
  } catch (error) {
    return ApiResponse.error("Registration failed", 500, error as any);
  }
}
