import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

type TFormData = {
    name: string
    price: number
    productId:number | null
}

const actEditProduct = createAsyncThunk(
  "products/actEditProduct",
  async (formData:TFormData, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/products/${formData.productId}`, {...formData});
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actEditProduct;
