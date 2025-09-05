import { useSelector } from '../../services';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (!isAuthChecked) {
    // Пока проверяется авторизация, показываем загрузку
    return null;
  }

  if (onlyUnAuth && user) {
    // Если роут только для неавторизованных, а пользователь авторизован
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    // Если роут только для авторизованных, а пользователь не авторизован
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
