import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import { TaddProductSchema } from "@validations/addProductSchema";
import axios from "axios";

const actAddProducts = createAsyncThunk(
  "products/actAddProducts",
  async (formData: TaddProductSchema, { rejectWithValue }) => {
    try {
      const res = await axios.post("/products", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddProducts;
