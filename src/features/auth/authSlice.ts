import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  token: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userInfo: any }>
    ) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
