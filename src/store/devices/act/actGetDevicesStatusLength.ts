import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

const actGetDevicesStatusLength = createAsyncThunk(
  "devices/actGetDevicesStatusLength",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const usedDevice = await axios.get(`/devices?status=مستخدم`);
      const avalDevice = await axios.get("/devices?status=متاح");
      const maintanDevice = await axios.get("/devices?status=صيانة");
      return {
        availableEquipment: avalDevice.data.length,
        usedEquipment: usedDevice.data.length,
        maintenanceEquipment: maintanDevice.data.length,
      };
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);
export default actGetDevicesStatusLength;
