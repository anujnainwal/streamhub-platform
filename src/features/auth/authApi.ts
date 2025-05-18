import { baseQueryApi } from "@/config/baseApiConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

export const getAuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryApi,
  tagTypes: ["user-authentication"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      { success: boolean; message: string },
      {
        planId: number;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        password: string;
      }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user-authentication"],
    }),
    loginUser: builder.mutation<
      { success: boolean; message: string; token: string },
      { email: string; password: string; rememberMe: boolean }
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user-authentication"],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = getAuthApi;
