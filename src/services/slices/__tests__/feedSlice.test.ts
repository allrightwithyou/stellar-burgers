import feedReducer, { getFeeds, initialState } from '../feedSlice';
import { TOrdersData } from '@utils-types';

describe('feedSlice', () => {
  const mockOrdersData: TOrdersData = {
    orders: [
      {
        _id: '65f4e7e197ede0001d064c2b',
        status: 'done',
        name: 'Краторный бургер',
        createdAt: '2024-03-15T20:32:01.149Z',
        updatedAt: '2024-03-15T20:32:01.796Z',
        number: 37373,
        ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
      },
      {
        _id: '65f4e7e197ede0001d064c2c',
        status: 'pending',
        name: 'Био-марсианский бургер',
        createdAt: '2024-03-15T20:33:01.149Z',
        updatedAt: '2024-03-15T20:33:01.796Z',
        number: 37374,
        ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0942']
      }
    ],
    total: 37374,
    totalToday: 42
  };

  test('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getFeeds async thunk', () => {
    test('should handle getFeeds.pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle getFeeds.rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch feeds');
    });

    test('should handle getFeeds.fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockOrdersData
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrdersData);
      expect(state.error).toBeNull();
    });

    test('should handle multiple state transitions', () => {
      // Начинаем с pending
      let state = feedReducer(initialState, { type: getFeeds.pending.type });
      expect(state.loading).toBe(true);

      // Затем fulfilled
      state = feedReducer(state, {
        type: getFeeds.fulfilled.type,
        payload: mockOrdersData
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrdersData);

      // Проверяем, что при новом запросе состояние сбрасывается
      state = feedReducer(state, { type: getFeeds.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrdersData); // данные остаются
    });

    test('should handle error after successful loading', () => {
      // Сначала успешная загрузка
      let state = feedReducer(initialState, {
        type: getFeeds.fulfilled.type,
        payload: mockOrdersData
      });

      // Затем ошибка
      state = feedReducer(state, {
        type: getFeeds.rejected.type,
        error: { message: 'Network error' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.orders).toEqual(mockOrdersData); // данные остаются
    });
  });
});
