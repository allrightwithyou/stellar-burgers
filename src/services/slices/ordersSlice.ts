import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export const getOrders = createAsyncThunk('orders/getOrders', getOrdersApi);

export interface TOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

export const initialState: TOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export default ordersSlice.reducer;
