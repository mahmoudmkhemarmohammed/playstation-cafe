import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

type TData = {
  deviceId: number;
  status: "متاح" | "مستخدم" | "صيانة";
};

const actEditeStatus = createAsyncThunk(
  "devices/actEditeStatus",
  async (data: TData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.patch(`/devices/${data.deviceId}`, {
        status: data.status,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actEditeStatus;
