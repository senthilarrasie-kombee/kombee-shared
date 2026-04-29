import { ROUTES } from '../../constants/routes';

// navigation types
type MainStack = {
    [ROUTES.HOME]: undefined | Record<string, any>;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.DASHBOARD]: undefined;
    [ROUTES.PRODUCTS_LISTING]: undefined;
    [ROUTES.MAIN_TAB]: undefined;
};

export type { MainStack };
