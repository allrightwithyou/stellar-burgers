import ingredientsReducer, {
  getIngredients,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  test('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getIngredients async thunk', () => {
    test('should handle getIngredients.pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle getIngredients.rejected', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Failed to fetch ingredients' }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch ingredients');
    });

    test('should handle getIngredients.fulfilled', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('should handle multiple state transitions', () => {
      // Начинаем с pending
      let state = ingredientsReducer(initialState, { type: getIngredients.pending.type });
      expect(state.loading).toBe(true);

      // Затем fulfilled
      state = ingredientsReducer(state, {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);

      // Проверяем, что при новом запросе состояние сбрасывается
      state = ingredientsReducer(state, { type: getIngredients.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients); // данные остаются
    });

    test('should handle error after successful loading', () => {
      // Сначала успешная загрузка
      let state = ingredientsReducer(initialState, {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      });

      // Затем ошибка
      state = ingredientsReducer(state, {
        type: getIngredients.rejected.type,
        error: { message: 'Network error' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual(mockIngredients); // данные остаются
    });
  });
});
