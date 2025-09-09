import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import {
  useSelector,
  useDispatch,
  selectIngredients,
  selectFeedOrders,
  selectUserOrders,
  getIngredients,
  getFeeds
} from '../../services';
import { getOrderByNumberApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFromFeed = location.pathname.includes('/feed/');
  const orders = isFromFeed ? feedOrders : userOrders;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Загружаем ингредиенты, если они не загружены
      if (ingredients.length === 0) {
        dispatch(getIngredients());
        // Ожидаем загрузки ингредиентов перед продолжением
        return;
      }

      // Если мы в ленте и заказы не загружены, загружаем их
      if (isFromFeed && feedOrders.length === 0) {
        dispatch(getFeeds());
        // Ожидаем загрузки заказов ленты перед продолжением
        return;
      }

      // Ищем заказ в уже загруженных данных
      const foundOrder = orders.find(
        (order) => order.number === Number(number)
      );

      if (foundOrder) {
        setOrderData(foundOrder);
        setIsLoading(false);
        return;
      }

      // Если заказ не найден в стейте, загружаем по номеру
      if (number) {
        try {
          const response = await getOrderByNumberApi(Number(number));
          if (response.success && response.orders.length > 0) {
            setOrderData(response.orders[0]);
          } else {
            setOrderData(null);
          }
        } catch (error) {
          console.error('Error loading order:', error);
          setOrderData(null);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [
    number,
    dispatch,
    ingredients.length,
    feedOrders.length,
    isFromFeed,
    orders
  ]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Показываем прелоадер во время загрузки или если нет данных
  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
