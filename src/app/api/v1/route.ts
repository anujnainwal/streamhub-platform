import { ApiResponse, HttpStatus } from "@/utils/response.utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = { version: "1.0.0" };
    return ApiResponse.success(
      data,
      "API is working",
      HttpStatus.OK,
      { apiVersion: "1.0" },
      request.url
    );
  } catch (error) {
    return ApiResponse.error(
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
      request.url
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return ApiResponse.created(body);
  } catch (error) {
    return ApiResponse.badRequest("Invalid request body", error);
  }
}
