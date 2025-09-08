import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Базовые селекторы
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectLoginUserRequest = (state: RootState) =>
  state.user.loginUserRequest;
export const selectLoginUserError = (state: RootState) =>
  state.user.loginUserError;
export const selectRegisterUserRequest = (state: RootState) =>
  state.user.registerUserRequest;
export const selectRegisterUserError = (state: RootState) =>
  state.user.registerUserError;

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorBun = (state: RootState) =>
  state.constructorBurger.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructorBurger.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.constructorBurger.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.constructorBurger.orderModalData;

export const selectFeedOrders = (state: RootState) => state.feed.orders.orders;
export const selectFeedTotal = (state: RootState) => state.feed.orders.total;
export const selectFeedTotalToday = (state: RootState) =>
  state.feed.orders.totalToday;

export const selectUserOrders = (state: RootState) => state.orders.orders;

// Сложные селекторы
export const getIngredientsCountSelector = createSelector(
  [(state: RootState) => state.constructorBurger],
  (constructorBurger) => {
    const count: { [key: string]: number } = {};

    if (constructorBurger.bun) {
      count[constructorBurger.bun._id] = 2;
    }

    constructorBurger.ingredients.forEach((ingredient) => {
      count[ingredient._id] = (count[ingredient._id] || 0) + 1;
    });

    return count;
  }
);

export const selectConstructorItems = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);
