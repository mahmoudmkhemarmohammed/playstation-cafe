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

      
      const [time, modifier] = selectedClient.endTime.split(" ");
      const [rawHours, minutes] = time.split(":").map(Number);
      let hours = rawHours;

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const currentTime = new Date();
      currentTime.setHours(hours);
      currentTime.setMinutes(minutes);

      
      currentTime.setMinutes(currentTime.getMinutes() + formData.extraTime);

      
      let newHours = currentTime.getHours();
      const newMinutes = currentTime.getMinutes();
      const newModifier = newHours >= 12 ? "PM" : "AM";

      newHours = newHours % 12;
      newHours = newHours === 0 ? 12 : newHours;

      const formattedEndTime = `${String(newHours).padStart(2, "0")}:${String(
        newMinutes
      ).padStart(2, "0")} ${newModifier}`;


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