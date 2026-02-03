import React from 'react';
// import { ... } from 'lucide-react'; // Restoring previous state
import {
    LayoutDashboard,
    History,
    CreditCard,
    TrendingUp,
    LogOut,
    User as UserIcon
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isMobile, onClose, onLogout, user }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
        { id: 'history', label: 'Movimientos', icon: History },
        { id: 'bills', label: 'Cuentas y Deudas', icon: CreditCard },
    ];

    const handleNav = (id) => {
        setActiveTab(id);
        if (onClose) onClose();
    };

    const userEmail = user?.is_anonymous ? 'Invitado' : user?.email;

    return (
        <div className={`
      ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out' : 'sticky top-0 h-screen w-64 hidden md:flex'}
      bg-slate-900 border-r border-slate-800 flex-col
      ${isMobile && !onClose ? '-translate-x-full' : 'translate-x-0'}
    `}>
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-blue-500/10 overflow-hidden bg-white">
                    <img src="/logo.png" alt="CastePay" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        CastePay
                    </h1>
                    <p className="text-xs text-slate-500">Gestión Personal</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${activeTab === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-white transition-colors'} />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-slate-700 rounded-lg text-slate-400">
                        <UserIcon size={18} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-slate-500 font-medium">Usuario</p>
                        <p className="text-[11px] text-slate-300 font-bold truncate tracking-tight">{userEmail}</p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
