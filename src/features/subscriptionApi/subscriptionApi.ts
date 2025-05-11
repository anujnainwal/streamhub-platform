// src/services/subscriptionApi.ts
import { baseQueryApi } from "@/config/baseApiConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

// --- TypeScript types for request/responses ---
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description?: string;
}

export interface CheckoutSessionRequest {
  user_id: string;
  planId: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  paid: boolean;
  status: string;
  stripe_status: string;
  subscription_status: string;
  message: string;
}

// --- RTK Query slice ---
export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryApi,
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    // Fetch available plans
    getPlans: builder.query<Plan[], void>({
      query: () => "/subscriptions/plans",
      providesTags: ["Subscription"],
    }),

    // Verify payment after checkout
    getVerifyPayment: builder.query<
      VerifyPaymentResponse,
      { sessionId: string; userId: string }
    >({
      query: ({ sessionId, userId }) =>
        `/subscriptions/verification?sessionId=${encodeURIComponent(
          sessionId
        )}&userId=${encodeURIComponent(userId)}`,
      providesTags: ["Subscription"],
    }),

    // Create a Stripe checkout session
    createCheckoutSession: builder.mutation<
      CheckoutSessionResponse,
      CheckoutSessionRequest
    >({
      query: (data) => ({
        url: "/subscriptions/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetVerifyPaymentQuery,
  useCreateCheckoutSessionMutation,
} = subscriptionApi;
