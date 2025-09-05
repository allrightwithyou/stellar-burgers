import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch, getFeeds } from '../../services';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders.orders);
  const isLoading = useSelector((state) => state.feed.loading);
  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  console.log('Feed component:', { orders, isLoading, error });

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки ленты заказов: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
