// src/services/subscriptionApi.ts
import { baseQueryApi } from "@/config/baseApiConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

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

interface PaymentMethodData {
  id: string;
  brand: string;
  last4: string;
  expYear: number;
  expMonth: number;
  funding: string;
  country: string;
  isDefault?: boolean;
}

interface PaymentMethodResponse {
  setupIntentClientSecret: string;
  cards: PaymentMethodData[];
}

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

    getVerifyPayment: builder.query<
      VerifyPaymentResponse,
      { sessionId: string; userId: string }
    >({
      query: ({ sessionId, userId }) =>
        `/subscriptions/verification?sessionId=${encodeURIComponent(
          sessionId
        )}&userId=${encodeURIComponent(userId)}`,
      providesTags: ["Subscription"],
      transformResponse: (response: { data: VerifyPaymentResponse }) =>
        response.data,
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
    //fetch payment attached method
    getPaymentMethod: builder.query<PaymentMethodResponse, void>({
      query: () => "/subscriptions/payment-method",
      providesTags: ["Subscription"],
      transformResponse: (response: { data: PaymentMethodResponse }) =>
        response.data,
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetVerifyPaymentQuery,
  useCreateCheckoutSessionMutation,
  useGetPaymentMethodQuery,
} = subscriptionApi;
