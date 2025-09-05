import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const getIngredientsCountSelector = createSelector(
  [(state: RootState) => state.constructorBurger],
  (constructorBurger) => {
    const count: { [key: string]: number } = {};

    if (constructorBurger.bun) {
      count[constructorBurger.bun._id] = 2;
    }

    constructorBurger.ingredients.forEach((ingredient) => {
      count[ingredient._id] = (count[ingredient._id] || 0) + 1;
    });

    return count;
  }
);
