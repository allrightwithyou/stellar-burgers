import userReducer, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  authChecked,
  userLogout,
  initialState
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token'
  };

  test('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('synchronous actions', () => {
    test('should handle authChecked', () => {
      const state = { ...initialState, isAuthChecked: false };
      const action = authChecked();
      const newState = userReducer(state, action);

      expect(newState.isAuthChecked).toBe(true);
    });

    test('should handle userLogout', () => {
      const state = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = userLogout();
      const newState = userReducer(state, action);

      expect(newState.user).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser async thunk', () => {
    test('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.registerUserRequest).toBe(true);
      expect(state.registerUserError).toBeNull();
    });

    test('should handle registerUser.rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.registerUserRequest).toBe(false);
      expect(state.registerUserError).toBe('Registration failed');
    });

    test('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = userReducer(initialState, action);

      expect(state.registerUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser async thunk', () => {
    test('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
      expect(state.loginUserError).toBeNull();
    });

    test('should handle loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Login failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.loginUserRequest).toBe(false);
      expect(state.loginUserError).toBe('Login failed');
    });

    test('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      };
      const state = userReducer(initialState, action);

      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('getUser async thunk', () => {
    test('should handle getUser.pending', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      // pending не должен изменять isAuthChecked
      expect(state).toEqual(initialState);
    });

    test('should handle getUser.rejected', () => {
      const action = { type: getUser.rejected.type };
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });

    test('should handle getUser.fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser async thunk', () => {
    test('should handle updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      // pending не должен ничего изменять
      expect(state).toEqual(initialState);
    });

    test('should handle updateUser.rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Update failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.registerUserError).toBe('Update failed');
    });

    test('should handle updateUser.fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('logoutUser async thunk', () => {
    test('should handle logoutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
