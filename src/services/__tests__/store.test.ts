import { configureStore } from '@reduxjs/toolkit';
import store from '../store';

// Импортируем все слайсы для проверки инициализации
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import userReducer from '../slices/userSlice';
import feedReducer from '../slices/feedSlice';
import ordersReducer from '../slices/ordersSlice';

describe('Store', () => {
  test('should initialize with correct initial state', () => {
    const state = store.getState();

    // Проверяем, что все слайсы инициализированы
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructorBurger');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
  });

  test('should have correct reducer structure', () => {
    const testStore = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        constructorBurger: constructorReducer,
        user: userReducer,
        feed: feedReducer,
        orders: ordersReducer
      }
    });

    const state = testStore.getState();

    // Проверяем структуру состояния
    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(state.constructorBurger).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });

    expect(state.user).toEqual({
      user: null,
      isAuthChecked: true,
      isAuthenticated: false,
      loginUserRequest: false,
      loginUserError: null,
      registerUserRequest: false,
      registerUserError: null
    });

    expect(state.feed).toEqual({
      orders: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      loading: false,
      error: null
    });
  });
});
