import { createAsyncThunk } from "@reduxjs/toolkit";
import { TChangeQuantity } from "@types";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

const actChangeProductQuantity = createAsyncThunk(
  "products/actChangeProductQuantity",
  async (data: TChangeQuantity[], thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const requests = data.map(async (item) => {
        const res = await axios.get(`/products/${item.id}`);
        const currentQty = res.data.quantity;
        const newQty = currentQty - item.quantity;

        return axios.patch(`/products/${item.id}`, {
          quantity: newQty,
        });
      });

      await Promise.all(requests);
      return true;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);


export default actChangeProductQuantity;
