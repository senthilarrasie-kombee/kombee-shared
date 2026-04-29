import { ROUTES } from '@app/routes';

// navigation types
type MainStack = {
    [ROUTES.HOME]: undefined | Record<string, any>;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.DASHBOARD]: undefined;
    [ROUTES.HABITS_LISTING]: undefined;
    [ROUTES.PROFILE]: undefined;
    [ROUTES.SETTINGS]: undefined;
    [ROUTES.MAIN_TAB]: undefined;
};

export type { MainStack };
