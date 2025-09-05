import store from './store';

export default store;
export type { RootState, AppDispatch } from './store';
export { useDispatch, useSelector } from './store';

export { getIngredients } from './slices/ingredientsSlice';
export {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModalData,
  orderBurger
} from './slices/constructorSlice';
export {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  authChecked,
  userLogout
} from './slices/userSlice';
export { getFeeds } from './slices/feedSlice';
export { getOrders } from './slices/ordersSlice';

export * from './selectors';
