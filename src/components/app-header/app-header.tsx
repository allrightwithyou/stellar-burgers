import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  return (
    <AppHeaderUI
      userName={user?.name || ''}
      onConstructorClick={() => navigate('/')}
      onFeedClick={() => navigate('/feed')}
      onProfileClick={() => navigate('/profile')}
      onLogoClick={() => navigate('/')}
      pathname={location.pathname}
    />
  );
};
