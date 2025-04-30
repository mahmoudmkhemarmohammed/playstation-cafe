import { createAsyncThunk } from "@reduxjs/toolkit";
import { TOwner } from "@types";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import { TsignInType } from "@validations/signInSchema";
import axios from "axios";

type TResponse = {
  accessToken: string;
  user: TOwner;
};

const actAuthLogin = createAsyncThunk(
  "auth/actAuthLogin",
  async (formData: TsignInType, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post<TResponse>("/login", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);
export default actAuthLogin;
