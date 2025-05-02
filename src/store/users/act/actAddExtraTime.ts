import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@utils/axiosErrorHandler";

type TFormData = {
  deviceId: number;
  extraTime: number;
  price: number;
};

const actAddExtraTime = createAsyncThunk(
  "users/actAddExtraTime",
  async (formData: TFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const selectedClientRes = await axios.get(
        `/clients?deviceId=${formData.deviceId}`
      );
      const selectedClient = selectedClientRes.data[0];

      if (!selectedClient) {
        return rejectWithValue("لم يتم العثور على العميل.");
      }

      const currentTime = new Date(selectedClient.endTime);
      if (isNaN(currentTime.getTime())) {
        return rejectWithValue("الوقت المخزن غير صالح.");
      }

      currentTime.setMinutes(currentTime.getMinutes() + formData.extraTime);

      const formattedEndTime = currentTime.toISOString();

      const res = await axios.patch(`/clients/${selectedClient.id}`, {
        endTime: formattedEndTime,
        price: selectedClient.price + formData.price,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddExtraTime;