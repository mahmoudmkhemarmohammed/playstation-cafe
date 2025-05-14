import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import { TOrder } from "@types";

type TAddOrderData = {
  deviceId: number;
  totalPrice: number;
  newOrder: {
    id: number;
    name: string;
    quantity: number;
  };
};

const actAddOrderToClient = createAsyncThunk(
  "clients/actAddOrderToClient",
  async ({ deviceId, newOrder, totalPrice }: TAddOrderData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axios.get(`/clients?deviceId=${deviceId}`);
      const client = res.data;

      if (!client) {
        return rejectWithValue("العميل غير موجود");
      }

      const currentOrders = client[0].orders || [];

      // is Order Excited
      const existingOrderIndex = currentOrders.findIndex(
        (order: TOrder) => order.id === newOrder.id
      );

      let updatedOrders;

      if (existingOrderIndex !== -1) {
        // if order finded Update Quantity
        updatedOrders = [...currentOrders];
        updatedOrders[existingOrderIndex] = {
          ...updatedOrders[existingOrderIndex],
          quantity:
            updatedOrders[existingOrderIndex].quantity + newOrder.quantity,
        };
      } else {
        // Add New Order
        updatedOrders = [...currentOrders, newOrder];
      }

      // Send Updata
      const updateRes = await axios.patch(`/clients/${client[0].id}`, {
        orders: updatedOrders,
        price: client[0].price + totalPrice,
        ordersRevenue: client[0].ordersRevenue + totalPrice
      });

      return updateRes.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddOrderToClient;
