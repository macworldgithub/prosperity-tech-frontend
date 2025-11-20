import { LoginApi } from "@/app/api/auth";
import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
  email: string;
  pin: string;
  loading: boolean;
  error: string | null;
  access_token: string | null;
  custNo?: string | null;
}

const initialState: LoginState = {
  email: "",
  pin: "",
  loading: false,
  error: null,
  access_token: null,
  custNo: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPin: (state, action) => {
      state.pin = action.payload;
    },
    logout: (state) => {
      state.access_token = null;
      state.email = "";
      state.pin = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload?.access_token || null;
        state.custNo = action.payload?.custNo || null;
      })
      .addCase(LoginApi.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Login failed";
      });
  },
});

export const { setEmail, setPin, logout } = loginSlice.actions;
export default loginSlice;
