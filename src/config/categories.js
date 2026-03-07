import {
    Utensils,
    Car,
    Zap,
    Gamepad2,
    Stethoscope,
    Home,
    GraduationCap,
    Wallet,
    Briefcase,
    Key,
    ShoppingBag,
    Gift,
    Sparkles,
    Tag,
    TrendingUp,
    Building2,
    Landmark,
    PieChart,
    Bitcoin
} from 'lucide-react';

export const CATEGORIES = {
    ingreso: [
        { name: 'Sueldo', icon: Briefcase },
        { name: 'Alquiler', icon: Key },
        { name: 'Venta', icon: ShoppingBag },
        { name: 'Intereses', icon: Wallet },
        { name: 'Regalo', icon: Gift },
        { name: 'Varios', icon: Tag },
    ],
    egreso: [
        { name: 'Comida', icon: Utensils },
        { name: 'Transporte', icon: Car },
        { name: 'Servicios', icon: Zap },
        { name: 'Higiene', icon: Sparkles },
        { name: 'Ocio', icon: Gamepad2 },
        { name: 'Salud', icon: Stethoscope },
        { name: 'Hogar', icon: Home },
        { name: 'Educación', icon: GraduationCap },
        { name: 'Varios', icon: Tag },
    ],
    inversion: [
        { name: 'CEDEARs', icon: TrendingUp },
        { name: 'Acciones', icon: Building2 },
        { name: 'Bonos', icon: Landmark },
        { name: 'Fondos Comunes', icon: PieChart },
        { name: 'Criptomonedas', icon: Bitcoin },
        { name: 'Varios', icon: Tag },
    ]
};

export const getCategoryIcon = (name, type = 'egreso') => {
    const list = CATEGORIES[type] || CATEGORIES.egreso;
    const category = list.find(c => c.name === name);
    return category ? category.icon : Tag;
};
