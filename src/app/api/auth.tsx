import { RootState } from "@/store/reduxStore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginApi = createAsyncThunk<
  any,
  void,
  { rejectValue: { message: string } }
>("auth/login", async (_, { getState, rejectWithValue }) => {
  try {
    const { email, pin } = (getState() as RootState).login;

    const loginRes = await axios.post(
      `https://prosperity.omnisuiteai.com/auth/login`,
      { identifier: email, pin }
    );
    console.log(loginRes);
    const { access_token } = loginRes.data;
    console.log(access_token);

    if (!access_token) {
      return rejectWithValue({ message: "Login failed: No access token" });
    }

    const meRes = await axios.get(`https://prosperity.omnisuiteai.com/user/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    console.log(meRes)
    const custNo = meRes.data?.user?.custNo;

    if (custNo) {
      localStorage.setItem("custNo", custNo);
    }

    return {
      ...loginRes.data,
      custNo: custNo || null,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || { message: "Something went wrong" }
    );
  }
});
