import { NextResponse } from "next/server";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export type ResponseStatus = true | false;

interface ApiResponseBase {
  status: ResponseStatus;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
}

interface SuccessResponse<T> extends ApiResponseBase {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

interface ErrorResponse extends ApiResponseBase {
  data: any | null;
  error?: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

export class ApiResponse {
  private static formatResponse<T>(
    status: ResponseStatus,
    statusCode: number,
    message: string,
    data?: T,
    meta?: any,
    error?: any,
    path?: string
  ): SuccessResponse<T> | ErrorResponse {
    const baseResponse: ApiResponseBase = {
      status,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path,
    };

    if (status === false) {
      return {
        ...baseResponse,
        data: null,
        error: error
          ? {
              code: error.code || "UNKNOWN_ERROR",
              message: error.message || message,
              details:
                process.env.NODE_ENV !== "production"
                  ? error.details
                  : undefined,
              stack:
                process.env.NODE_ENV !== "production" ? error.stack : undefined,
            }
          : undefined,
      };
    }

    return {
      ...baseResponse,
      data: data as T,
      meta,
    };
  }

  static success<T>(
    data: T,
    message: string = "Success",
    statusCode: number = HttpStatus.OK,
    meta?: any,
    path?: string
  ) {
    const response = this.formatResponse(
      true,
      statusCode,
      message,
      data,
      meta,
      undefined,
      path
    );
    return NextResponse.json(response, { status: statusCode });
  }

  static created<T>(
    data: T,
    message: string = "Resource created successfully",
    meta?: any,
    path?: string
  ) {
    return this.success(data, message, HttpStatus.CREATED, meta, path);
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: {
      code?: string;
      message?: string;
      details?: any;
      stack?: string;
    },
    path?: string
  ) {
    const response = this.formatResponse(
      false,
      statusCode,
      message,
      undefined,
      undefined,
      error,
      path
    );
    return NextResponse.json(response, { status: statusCode });
  }

  static badRequest(
    message: string = "Bad request",
    error?: { code: string; message: string; details?: any },
    path?: string
  ) {
    return this.error(message, HttpStatus.BAD_REQUEST, error, path);
  }

  static notFound(message: string = "Resource not found", path?: string) {
    return this.error(
      message,
      HttpStatus.NOT_FOUND,
      {
        code: "NOT_FOUND",
        message: message,
      },
      path
    );
  }

  static unauthorized(message: string = "Unauthorized access", path?: string) {
    return this.error(
      message,
      HttpStatus.UNAUTHORIZED,
      {
        code: "UNAUTHORIZED",
        message: message,
      },
      path
    );
  }

  static forbidden(message: string = "Access forbidden", path?: string) {
    return this.error(
      message,
      HttpStatus.FORBIDDEN,
      {
        code: "FORBIDDEN",
        message: message,
      },
      path
    );
  }

  static conflict(message: string = "Resource conflict", path?: string) {
    return this.error(
      message,
      HttpStatus.CONFLICT,
      {
        code: "CONFLICT",
        message: message,
      },
      path
    );
  }
}
