import { createSlice } from "@reduxjs/toolkit";
import { isString, TDevice, TLoading } from "@types";
import actGetDevices from "./act/actGetDevices";
import actGetDevicesStatusLength from "./act/actGetDevicesStatusLength";

type TDevicesState = {
  loading: TLoading;
  data: TDevice[];
  error: null | string;
  generalStatistics?: {
    availableEquipment: number;
    usedEquipment: number;
    maintenanceEquipment: number;
  };
};

const initialState: TDevicesState = {
  loading: "idle",
  data: [],
  error: null,
  generalStatistics: {
    availableEquipment: 0,
    usedEquipment: 0,
    maintenanceEquipment: 0,
  },
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    cleanUpDevices: (state) => {
      state.data = [];
      state.error = null;
      state.loading = "idle";
      state.generalStatistics = {
        availableEquipment: 0,
        maintenanceEquipment: 0,
        usedEquipment: 0,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(actGetDevices.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });

    builder.addCase(actGetDevices.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.data = action.payload;
      state.error = null;
    });

    builder.addCase(actGetDevices.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Get All Devices Using Status Perfix
    builder.addCase(actGetDevicesStatusLength.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });

    builder.addCase(actGetDevicesStatusLength.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.generalStatistics = action.payload;
      state.error = null;
    });

    builder.addCase(actGetDevicesStatusLength.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export default devicesSlice.reducer;
export const { cleanUpDevices } = devicesSlice.actions;
