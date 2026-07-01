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
      {
        identifier: email,
        pin,
      },
    );
    console.log(loginRes);
    const { access_token } = loginRes.data;
    console.log(access_token);

    if (!access_token) {
      return rejectWithValue({ message: "Login failed: No access token" });
    }

    const meRes = await axios.get(
      `https://prosperity.omnisuiteai.com/user/me`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    console.log(meRes);
    const custNo = meRes.data?.user?.custNo;

    if (custNo) {
      localStorage.setItem("custNo", custNo);
    }
    // Save full user data for manage-account/chatbot features
    if (meRes.data) {
      try {
        localStorage.setItem("userData", JSON.stringify(meRes.data));
      } catch (e) {
        console.warn("Failed to persist userData to localStorage", e);
      }
    }

    return {
      ...loginRes.data,
      custNo: custNo || null,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || { message: "Something went wrong" },
    );
  }
});

export const DeleteCustomerApi = createAsyncThunk<
  any,
  void,
  { rejectValue: { message: string } }
>("customer/delete", async (_, { getState, rejectWithValue }) => {
  try {
    const custNo = localStorage.getItem("custNo");

    if (!custNo) {
      return rejectWithValue({ message: "Customer number not found" });
    }

    await axios.delete(
      `https://prosperity.omnisuiteai.com/api/v1/customers/${custNo}`,
    );

    localStorage.removeItem("custNo");
    localStorage.removeItem("userData");

    return { custNo };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || { message: "Failed to delete customer" },
    );
  }
});
