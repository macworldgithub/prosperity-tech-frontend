import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/reduxStore";

export const fetchCustomerServices = createAsyncThunk<
  any,
  void,
  { rejectValue: { message: string }; state: RootState }
>(
  "services/fetchCustomerServices",
  async (_, { getState, rejectWithValue }) => {
    try {
      const custNo = localStorage.getItem("custNo");
      if (!custNo) {
        return rejectWithValue({ message: "Customer number not found" });
      }

      const res = await axios.get(
        `https://prosperity.omnisuiteai.com/api/v1/customers/${custNo}/services`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch services" }
      );
    }
  }
);
