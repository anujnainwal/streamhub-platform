import { subscriptionApi } from "@/features/subscriptionApi/subscriptionApi";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(subscriptionApi.middleware),
});

export default store;
