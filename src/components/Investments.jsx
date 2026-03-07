import React, { useMemo } from 'react';
import { TrendingUp, PieChart, History, Plus, ArrowUpRight, ArrowDownRight, Briefcase, Landmark, Building2, Bitcoin } from 'lucide-react';
import DistributionChart from './DistributionChart';
import TransactionHistory from './TransactionHistory';

const InvestmentCard = ({ title, amount, icon: Icon, colorClass, gradient }) => (
    <div className={`glass-card p-6 overflow-hidden relative group transition-all hover:scale-[1.02] border border-white/5`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 blur-3xl -mr-16 -mt-16 group-hover:opacity-30 transition-opacity`} />
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-')}/10 ${colorClass} border border-white/5`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white italic tracking-tight">
                    ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
            </div>
        </div>
    </div>
);

const Investments = ({ transactions, onTogglePaid, onDelete }) => {
    // Filter investments
    const investmentTransactions = useMemo(() =>
        transactions.filter(t => t.tipo === 'inversion'),
        [transactions]);

    const totalInvested = useMemo(() =>
        investmentTransactions.reduce((acc, curr) => acc + (curr.monto || 0), 0),
        [investmentTransactions]);

    return (
        <div className="space-y-8 pb-10">
            {/* Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InvestmentCard
                    title="Total Patrimonio en Activos"
                    amount={totalInvested}
                    icon={Briefcase}
                    colorClass="text-blue-400"
                    gradient="from-blue-500 to-indigo-600"
                />
                <div className="glass-card p-6 border border-white/5 flex flex-col justify-center bg-slate-800/20 backdrop-blur-md">
                    <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">Estado del Mercado</p>
                    <h2 className="text-xl font-bold text-white mb-2">Resumen de Cartera</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Aquí puedes ver la distribución de tus activos. Tus inversiones en {
                            [...new Set(investmentTransactions.map(t => t.categoria))].join(', ') || 'diversas categorías'
                        } se reflejan en el gráfico inferior.
                    </p>
                </div>
            </div>

            {/* Distribution Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 glass-card p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <PieChart className="text-blue-400" size={20} />
                        <h2 className="text-xl font-bold text-white">Distribución de Activos</h2>
                    </div>
                    <div className="h-64 sm:h-80 lg:h-64 xl:h-80 w-full">
                        <DistributionChart
                            type="inversion"
                            transactions={investmentTransactions}
                        />
                    </div>
                </div>

                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <History className="text-blue-400" size={20} />
                            <h2 className="text-xl font-bold text-white">Historial de Operaciones</h2>
                        </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <TransactionHistory
                            transactions={investmentTransactions}
                            onTogglePaid={onTogglePaid}
                            onDelete={onDelete}
                            compact={true}
                        />
                    </div>
                </div>
            </div>

            {/* Empty State info */}
            {investmentTransactions.length === 0 && (
                <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-900/40">
                    <TrendingUp size={48} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Comienza a Diversificar</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Registra tus compras de acciones, CEDEARs o cripto usando el botón "Nuevo Registro" y seleccionando el tipo "Inversión".
                    </p>
                </div>
            )}
        </div>
    );
};

export default Investments;
