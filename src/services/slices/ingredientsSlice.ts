import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export default ingredientsSlice.reducer;
