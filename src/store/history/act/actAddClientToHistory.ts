import { createAsyncThunk } from "@reduxjs/toolkit";
import { TOrder } from "@types";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

type TUser = {
  deviceId: number;
  endTime: string;
  name: string;
  orders: TOrder[];
  price: number;
  startTime: string;
};

const actAddClientToHistory = createAsyncThunk(
  "history/actAddClientToHistory",
  async (user: TUser, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { deviceId, endTime, name, orders, price, startTime } = user;
    try {
      const res = await axios.post("/history", {
        deviceId,
        endTime,
        name,
        orders,
        price,
        startTime,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddClientToHistory;
