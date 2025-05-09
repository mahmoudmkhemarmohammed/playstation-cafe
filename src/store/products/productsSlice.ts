import { createSlice } from "@reduxjs/toolkit";
import actGetProducts from "./act/actGetProducts";
import { isString, TLoading, TProduct } from "@types";
import actAddProducts from "./act/actAddProducts";
import actEditProduct from "./act/actEditProduct";
import actRemoveProduct from "./act/actRemoveProduct";
import actChangeProductQuantity from "./act/actChangeProductQuantity";

type TProductsState = {
  loading: TLoading;
  products: TProduct[];
  error: string | null;
};

const initialState: TProductsState = {
  loading: "idle",
  products: [],
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Products
    builder.addCase(actGetProducts.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actGetProducts.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.products = action.payload;
      state.error = null;
    });
    builder.addCase(actGetProducts.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Add Products
    builder.addCase(actAddProducts.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actAddProducts.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddProducts.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Edit Products
    builder.addCase(actEditProduct.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actEditProduct.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actEditProduct.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // changeQuantity
    builder.addCase(actChangeProductQuantity.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actChangeProductQuantity.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actChangeProductQuantity.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Remove Product
    builder.addCase(actRemoveProduct.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actRemoveProduct.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actRemoveProduct.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export default productsSlice.reducer;
