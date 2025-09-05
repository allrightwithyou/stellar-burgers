import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

export interface TFeedState {
  orders: TOrdersData;
  loading: boolean;
  error: string | null;
}

export const initialState: TFeedState = {
  orders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export default feedSlice.reducer;
