import { getAuthApi } from "@/features/auth/authApi";
import { subscriptionApi } from "@/features/subscriptionApi/subscriptionApi";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [getAuthApi.reducerPath]: getAuthApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      getAuthApi.middleware,
      subscriptionApi.middleware
    ),
});

export default store;
