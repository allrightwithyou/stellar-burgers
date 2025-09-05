import { ProfileOrdersUI } from '@ui-pages';
import { useSelector, useDispatch, getOrders } from '../../services';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const isLoading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  console.log('ProfileOrders component:', { orders, isLoading, error });

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки заказов: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
