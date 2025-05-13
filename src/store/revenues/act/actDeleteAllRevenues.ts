import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";
import { TRevenue } from "../revenuesSlice";

const actDeleteAllRevenues = createAsyncThunk(
  "revenues/actDeleteAllRevenues",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // Get all revenues
      const resRevenues = await axios.get("/revenues");
      const revenues: TRevenue[] = resRevenues.data;

      // Delete all revenues
      const deleteRevenuePromises = revenues.map((revenue) =>
        axios.delete(`/revenues/${revenue.id}`)
      );

      // Get all history
      const resHistory = await axios.get("/history");
      const history = resHistory.data;

      // Delete all history
      const deleteHistoryPromises = history.map((item: any) =>
        axios.delete(`/history/${item.id}`)
      );

      // Wait for all deletions (revenues + history)
      await Promise.all([...deleteRevenuePromises, ...deleteHistoryPromises]);

      return [];
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteAllRevenues;