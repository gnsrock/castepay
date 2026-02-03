import React from 'react';
import {
    LayoutDashboard,
    History,
    CreditCard,
    TrendingUp,
    LogOut,
    User as UserIcon,
    X
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
        <aside className={`
            flex flex-col h-full bg-slate-900 border-r border-slate-800 shadow-2xl
            ${isMobile ? 'w-full shadow-none' : 'w-64'}
        `}>
            {/* Header with Logo and Close button */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white shadow-lg overflow-hidden bg-white shrink-0">
                        <img src="/logo.png" alt="CastePay" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-white truncate leading-none mb-1">
                            CastePay
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gestión PRO</p>
                    </div>
                </div>

                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                        aria-label="Cerrar menú"
                    >
                        <X size={22} />
                    </button>
                )}
            </div>

            {/* Navigation Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`
                            w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 group
                            ${activeTab === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent'}
                        `}
                    >
                        <item.icon size={22} className={activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-white transition-colors'} />
                        <span className="font-bold tracking-tight">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / User info */}
            <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-900/80">
                <div className="bg-slate-800/40 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                    <div className="p-2 bg-slate-700/50 rounded-xl text-slate-400 shrink-0">
                        <UserIcon size={20} />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-0.5">Usuario</p>
                        <p className="text-sm text-slate-200 font-bold truncate leading-tight">{userEmail}</p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-bold border border-transparent hover:border-rose-500/20 active:scale-[0.98]"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
