import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import ExpenseChart from './ExpenseChart';

const SummaryCard = ({ title, amount, icon: Icon, colorClass, gradient, percentage }) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl border border-white/5 bg-slate-800/50 backdrop-blur-sm group transition-all hover:scale-[1.02]`}>
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${gradient}`} />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-900/50 border border-white/5 ${colorClass}`}>
                    <Icon size={20} />
                </div>
                {percentage && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center gap-1`}>
                        <TrendingUp size={12} />
                        {percentage}%
                    </span>
                )}
            </div>

            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
                ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </h3>
        </div>
    </div>
);

const Dashboard = ({ transactions, user }) => {
    // Current Summary: Real money (where pagado is true)
    const summary = transactions.reduce(
        (acc, curr) => {
            if (curr.pagado) {
                if (curr.tipo === 'ingreso') {
                    acc.income += curr.monto;
                    acc.balance += curr.monto;
                } else {
                    acc.expenses += curr.monto;
                    acc.balance -= curr.monto;
                }
            } else {
                // Keep track of pending for future display
                if (curr.tipo === 'ingreso') acc.pendingIncome += curr.monto;
                else acc.pendingExpenses += curr.monto;
            }
            return acc;
        },
        { income: 0, expenses: 0, balance: 0, pendingIncome: 0, pendingExpenses: 0 }
    );

    const userName = user?.is_anonymous ? "Invitado" : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario");

    return (
        <div className="space-y-10">
            {/* Welcome User Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        ¡Hola, {userName}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Aquí tienes un resumen de tus finanzas reales hoy.</p>
                </div>
                <div className="flex items-center gap-6">
                    {(summary.pendingIncome > 0 || summary.pendingExpenses > 0) && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-800/40 rounded-xl border border-white/5 animate-pulse">
                            <Calendar className="text-blue-400" size={18} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-black uppercase">Próximos Movimientos</span>
                                <div className="flex gap-3 text-xs font-bold">
                                    {summary.pendingIncome > 0 && <span className="text-emerald-400">+$ {summary.pendingIncome.toLocaleString()}</span>}
                                    {summary.pendingExpenses > 0 && <span className="text-rose-400">-$ {summary.pendingExpenses.toLocaleString()}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-slate-800/40 p-1.5 rounded-2xl border border-white/5">
                        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
                            <Wallet size={20} />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Estado de Cuenta</p>
                            <p className="text-sm font-bold text-white">Sincronizado</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Balance Real"
                    amount={summary.balance}
                    icon={DollarSign}
                    colorClass="text-blue-400"
                    gradient="from-blue-500 to-indigo-600"
                />
                <SummaryCard
                    title="Ingresos Cobrados"
                    amount={summary.income}
                    icon={TrendingUp}
                    colorClass="text-emerald-400"
                    gradient="from-emerald-500 to-teal-600"
                />
                <SummaryCard
                    title="Gastos Pagados"
                    amount={summary.expenses}
                    icon={TrendingDown}
                    colorClass="text-rose-400"
                    gradient="from-rose-500 to-pink-600"
                />
            </div>

            {/* Visualizations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="glass-card p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-blue-400" size={20} />
                                Distribución de Gastos Efectuados
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Análisis por categorías de consumo real.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ExpenseChart transactions={transactions.filter(t => t.pagado)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
