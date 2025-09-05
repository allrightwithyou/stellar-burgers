import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick,
  onLogoClick,
  pathname
}) => {
  const isConstructorActive = pathname === '/';
  const isFeedActive = pathname === '/feed';
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
            onClick={onConstructorClick}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          <div
            className={`${styles.link} ${isFeedActive ? styles.link_active : ''}`}
            onClick={onFeedClick}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div className={styles.logo} onClick={onLogoClick}>
          <Logo className='' />
        </div>
        <div
          className={`${styles.link_position_last} ${styles.link} ${isProfileActive ? styles.link_active : ''}`}
          onClick={onProfileClick}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
