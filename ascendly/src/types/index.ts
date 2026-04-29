import { PropsWithChildren } from 'react';


// login
type LoginType = PropsWithChildren<{
    title?: string | undefined;
}>;

// dashboard
type DashboardType = PropsWithChildren<{
    title?: string | undefined;
}>;

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface Category {
    id: number;
    name: string;
    image: string;
}

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    activeOrders: number;
}

export type { LoginType, DashboardType, Product, Category, DashboardStats };
