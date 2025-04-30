import { createAsyncThunk } from "@reduxjs/toolkit";
import { TOrder } from "@types";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

type TFormData = {
  name: string;
  startTime: string;
  endTime: string;
  orders: TOrder[];
  price: number;
  deviceId: number
  sessionPrice: number
};

const actAddClient = createAsyncThunk(
  "users/actAddClient",
  async (formData: TFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post("/clients", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);
export default actAddClient;
