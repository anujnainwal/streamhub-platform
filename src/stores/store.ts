import { getAuthApi } from "@/features/auth/authApi";
import { subscriptionApi } from "@/features/subscriptionApi/subscriptionApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

const store = configureStore({
  reducer: {
    authInfo: authReducer,
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
