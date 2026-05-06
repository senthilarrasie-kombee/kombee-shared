import { ROUTES } from '@app/routes';
import { Habit } from '@features/habits/types/habit';

// navigation types
type MainStack = {
    [ROUTES.HOME]: undefined | Record<string, any>;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.DASHBOARD]: undefined;
    [ROUTES.HABITS_LISTING]: undefined;
    [ROUTES.ACCOUNT]: undefined;
    [ROUTES.ALL_HABITS]: undefined;
    [ROUTES.EDIT_PROFILE]: undefined;
    [ROUTES.MAIN_TAB]: undefined;
    [ROUTES.DRAWER]: undefined;
    [ROUTES.HABIT_DETAILS]: { habit: Habit };
    [ROUTES.HABIT_FORM]: { habit?: Habit };
};

export type { MainStack };
