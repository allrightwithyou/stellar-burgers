import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModalData,
  orderBurger,
  initialState,
  TConstructorState
} from '../constructorSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

// Мокаем uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('constructorSlice', () => {
  const mockBun: TConstructorIngredient = {
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'test-uuid-123'
  };

  const mockIngredient: TConstructorIngredient = {
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
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'test-uuid-123'
  };

  const mockOrder: TOrder = {
    _id: '65f4e7e197ede0001d064c2b',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2024-03-15T20:32:01.149Z',
    updatedAt: '2024-03-15T20:32:01.796Z',
    number: 37373,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addIngredient', () => {
    test('should add bun to state', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: 'test-uuid-123'
      });
      expect(state.ingredients).toEqual([]);
    });

    test('should replace existing bun', () => {
      const stateWithBun = {
        ...initialState,
        bun: mockBun
      };

      const newBun = { ...mockBun, name: 'Новая булка' };
      const action = addIngredient(newBun);
      const state = constructorReducer(stateWithBun, action);

      expect(state.bun).toEqual({
        ...newBun,
        id: 'test-uuid-123'
      });
    });

    test('should add ingredient to ingredients array', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toEqual([
        {
          ...mockIngredient,
          id: 'test-uuid-123'
        }
      ]);
      expect(state.bun).toBeNull();
    });

    test('should add multiple ingredients', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockIngredient));

      expect(state.ingredients).toHaveLength(2);
    });
  });

  describe('removeIngredient', () => {
    test('should remove ingredient by id', () => {
      const stateWithIngredients: TConstructorState = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockIngredient, id: 'id-2' },
          { ...mockIngredient, id: 'id-3' }
        ]
      };

      const action = removeIngredient({ ...mockIngredient, id: 'id-2' });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(
        state.ingredients.find((item) => item.id === 'id-2')
      ).toBeUndefined();
    });

    test('should not remove ingredient if id not found', () => {
      const stateWithIngredients: TConstructorState = {
        ...initialState,
        ingredients: [{ ...mockIngredient, id: 'id-1' }]
      };

      const action = removeIngredient({
        ...mockIngredient,
        id: 'non-existent-id'
      });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    test('should move ingredient to new position', () => {
      const stateWithIngredients: TConstructorState = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'Ingredient 1' },
          { ...mockIngredient, id: 'id-2', name: 'Ingredient 2' },
          { ...mockIngredient, id: 'id-3', name: 'Ingredient 3' }
        ]
      };

      // Перемещаем элемент с позиции 0 на позицию 2
      const action = moveIngredient({ from: 0, to: 2 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients[0].name).toBe('Ingredient 2');
      expect(state.ingredients[1].name).toBe('Ingredient 3');
      expect(state.ingredients[2].name).toBe('Ingredient 1');
    });

    test('should handle edge cases in move', () => {
      const stateWithIngredients: TConstructorState = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'Ingredient 1' },
          { ...mockIngredient, id: 'id-2', name: 'Ingredient 2' }
        ]
      };

      // Перемещение на ту же позицию
      const action = moveIngredient({ from: 0, to: 0 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });
  });

  describe('clearConstructor', () => {
    test('should clear all ingredients and bun', () => {
      const stateWithData: TConstructorState = {
        ...initialState,
        bun: mockBun,
        ingredients: [mockIngredient]
      };

      const action = clearConstructor();
      const state = constructorReducer(stateWithData, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('clearOrderModalData', () => {
    test('should clear order modal data', () => {
      const stateWithOrder: TConstructorState = {
        ...initialState,
        orderModalData: mockOrder
      };

      const action = clearOrderModalData();
      const state = constructorReducer(stateWithOrder, action);

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('orderBurger async thunk', () => {
    test('should handle orderBurger.pending', () => {
      const action = { type: orderBurger.pending.type };
      const state = constructorReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle orderBurger.rejected', () => {
      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Order failed' }
      };
      const state = constructorReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Order failed');
    });

    test('should handle orderBurger.fulfilled', () => {
      const stateWithData: TConstructorState = {
        ...initialState,
        bun: mockBun,
        ingredients: [mockIngredient],
        orderRequest: true
      };

      const action = {
        type: orderBurger.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = constructorReducer(stateWithData, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
