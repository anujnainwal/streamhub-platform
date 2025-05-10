import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/response.utils";
import { register_user } from "@/validation/auth/auth_validation";
import dbConnect from "@/lib/db";
import UserModel from "@/models/userSchema.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { error, value } = register_user.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return ApiResponse.badRequest("Validation failed", {
        code: "Validation Error",
        message: error.details[0].message,
      });
    }

    const userExists = await UserModel.findOne({
      $or: [
        { email: value.email.toLowerCase() },
        { username: value.username.toLowerCase() },
      ],
    });

    if (userExists) {
      return ApiResponse.conflict("Email or username already exists");
    }

    const newUser = await UserModel.create(value);
    return ApiResponse.created(newUser, "Registration successful");
  } catch (error: any) {
    return ApiResponse.error("Registration failed", 500, error);
  }
}
