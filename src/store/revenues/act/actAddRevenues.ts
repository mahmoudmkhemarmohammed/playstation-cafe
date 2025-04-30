import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@utils/axiosErrorHandler";

type TRevenueData = {
  date: string;
  total: number;
};

const actAddRevenues = createAsyncThunk(
  "revenues/actAddRevenues",
  async (data: TRevenueData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/revenues", data);

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddRevenues;
