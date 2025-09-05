import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector, useDispatch } from '../../services';
import { getOrderByNumberApi } from '@api';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  // Определяем, откуда мы пришли, чтобы искать заказ в нужном стейте
  const feedOrders = useSelector((state) => state.feed.orders.orders);
  const userOrders = useSelector((state) => state.orders.orders);

  const isFromFeed = location.pathname.includes('/feed/');
  const orders = isFromFeed ? feedOrders : userOrders;

  let orderData = orders.find((order) => order.number === Number(number));

  // Если заказ не найден в текущих данных, попытаемся загрузить его по номеру
  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number)).then((response) => {
        if (response.success && response.orders.length > 0) {
          // Можно добавить новый action для сохранения этого заказа в стейт
          orderData = response.orders[0];
        }
      });
    }
  }, [number, orderData]);

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
