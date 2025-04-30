import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";
import { TRevenue } from "../revenuesSlice";

const actDeleteAllRevenues = createAsyncThunk(
  "revenues/actDeleteAllRevenues",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get("/revenues");
      const revenues = res.data;

      const deletePromises = revenues.map((revenues: TRevenue) =>
        axios.delete(`revenues/${revenues.id}`)
      );

      await Promise.all(deletePromises);
      return [];
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteAllRevenues;
