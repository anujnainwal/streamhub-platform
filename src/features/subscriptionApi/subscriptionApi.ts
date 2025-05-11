import { baseQueryApi } from "@/config/baseApiConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryApi,
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/subscriptions/plans",
      providesTags: ["Subscription"],
    }),

    getVerifyPayment: builder.query<
      {
        success: boolean;
        paid: boolean;
        status: string;
        stripe_status: string;
        subscription_status: string;
        message: string;
      },
      { sessionId: string; userId: string }
    >({
      query: ({ sessionId, userId }) =>
        // Use the correct backend path
        `/subscriptions/verification?sessionId=${encodeURIComponent(
          sessionId
        )}&userId=${encodeURIComponent(userId)}`,
      providesTags: ["Subscription"],
    }),
  }),
});

export const { useGetPlansQuery, useGetVerifyPaymentQuery } = subscriptionApi;
