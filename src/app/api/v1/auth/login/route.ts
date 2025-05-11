import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/response.utils";
import { login_user } from "@/validation/auth/auth_validation";
import dbConnect from "@/lib/db";
import UserModel from "@/models/userSchema.model";
import { generateToken } from "@/utils/generateToken.utils";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { error, value } = login_user.validate(body, {
      abortEarly: false,
    });
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
    const userData = user.toJSON();
    let accessToken = await generateToken({ _id: user._id });
    return ApiResponse.success({ userInfo: userData, token:accessToken }, "Login successful");
  } catch (error: any) {
    return ApiResponse.error("Registration failed", 500, error);
  }
}
