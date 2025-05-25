import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQueryApi = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      let modifiedToken = typeof token === "string" ? JSON.parse(token) : token;
      headers.set("Authorization", `Bearer ${modifiedToken}`);
    }
    return headers;
  },
});
