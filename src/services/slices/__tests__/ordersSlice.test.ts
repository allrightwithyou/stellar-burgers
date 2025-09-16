import ordersReducer, {
  getOrders,
  initialState
} from '../ordersSlice';
import { TOrder } from '@utils-types';

describe('ordersSlice', () => {
  const mockOrders: TOrder[] = [
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
  ];

  test('should return initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getOrders async thunk', () => {
    test('should handle getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle getOrders.rejected', () => {
      const action = {
        type: getOrders.rejected.type,
        error: { message: 'Failed to fetch orders' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch orders');
    });

    test('should handle getOrders.fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    test('should handle multiple state transitions', () => {
      // Начинаем с pending
      let state = ordersReducer(initialState, { type: getOrders.pending.type });
      expect(state.loading).toBe(true);

      // Затем fulfilled
      state = ordersReducer(state, {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);

      // Проверяем, что при новом запросе состояние сбрасывается
      state = ordersReducer(state, { type: getOrders.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders); // данные остаются
    });

    test('should handle error after successful loading', () => {
      // Сначала успешная загрузка
      let state = ordersReducer(initialState, {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      });

      // Затем ошибка
      state = ordersReducer(state, {
        type: getOrders.rejected.type,
        error: { message: 'Network error' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.orders).toEqual(mockOrders); // данные остаются
    });
  });
});
