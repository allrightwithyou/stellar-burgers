import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  useSelector,
  useDispatch,
  updateUser,
  selectUser
} from '../../services';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: Partial<{
        name: string;
        email: string;
        password: string;
      }> = {
        name: formValue.name,
        email: formValue.email
      };

      // Добавляем пароль только если он введен
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      await dispatch(updateUser(updateData)).unwrap();

      // Сбрасываем пароль после успешного обновления
      setFormValue((prev) => ({
        ...prev,
        password: ''
      }));

      console.log('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={undefined}
    />
  );
};
