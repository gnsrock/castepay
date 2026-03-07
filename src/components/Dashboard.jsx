import { DollarSign, TrendingUp, TrendingDown, Wallet, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameMonth, parseISO, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import DistributionChart from './DistributionChart';
import TrendChart from './TrendChart';

const SummaryCard = ({ title, amount, icon: Icon, colorClass, gradient, percentage }) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl border border-white/5 bg-slate-800/50 backdrop-blur-sm group transition-all hover:scale-[1.02] flex flex-col items-center text-center md:items-start md:text-left shrink-0 w-[280px] sm:w-[320px] md:w-auto snap-center md:snap-align-none`}>
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${gradient}`} />

        <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-between mb-4 w-full">
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

            <p className="text-slate-400 text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider md:tracking-normal">{title}</p>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight break-all">
                ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </h3>
        </div>
    </div>
);

const Dashboard = ({ transactions, user, selectedMonth, setSelectedMonth }) => {
    // Current Summary: Real money (where pagado is true)
    // - balance: cumulative (all transactions)
    // - income/expenses: filtered by selected month
    const summary = transactions.reduce(
        (acc, curr) => {
            const transactionDate = parseISO(curr.created_at);
            const isInSelectedMonth = isSameMonth(transactionDate, selectedMonth);

            if (curr.pagado) {
                if (curr.tipo === 'ingreso') {
                    acc.liquidity += curr.monto;
                    acc.netWorth += curr.monto;
                    if (isInSelectedMonth) acc.income += curr.monto;
                } else if (curr.tipo === 'egreso') {
                    acc.liquidity -= curr.monto;
                    acc.netWorth -= curr.monto;
                    if (isInSelectedMonth) acc.expenses += curr.monto;
                } else if (curr.tipo === 'inversion') {
                    acc.liquidity -= curr.monto;
                    acc.invested += curr.monto;
                    acc.netWorth += 0; // Asset movement doesn't change net worth
                    if (isInSelectedMonth) acc.investments += curr.monto;
                }
            } else {
                if (isInSelectedMonth) {
                    if (curr.tipo === 'ingreso') acc.pendingIncome += curr.monto;
                    else if (curr.tipo === 'egreso') acc.pendingExpenses += curr.monto;
                }
            }
            return acc;
        },
        { income: 0, expenses: 0, investments: 0, liquidity: 0, invested: 0, netWorth: 0, pendingIncome: 0, pendingExpenses: 0 }
    );

    const userName = user?.is_anonymous ? "Invitado" : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario");

    return (
        <div className="space-y-10">
            {/* Welcome User & Month Selection Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 items-center text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        ¡Hola, {userName}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Así van tus finanzas en {format(selectedMonth, 'MMMM yyyy', { locale: es })}.</p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center bg-slate-800/40 p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                        className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all transition-all active:scale-90"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="px-4 text-center min-w-[140px]">
                        <p className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-0.5">Seleccionar Mes</p>
                        <p className="text-sm font-bold text-white capitalize">
                            {format(selectedMonth, 'MMMM yyyy', { locale: es })}
                        </p>
                    </div>

                    <button
                        onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                        className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center md:flex-row gap-6 w-full md:w-auto">
                    {(summary.pendingIncome > 0 || summary.pendingExpenses > 0) && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-800/40 rounded-xl border border-white/5 animate-pulse">
                            <Calendar className="text-blue-400" size={18} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-black uppercase">Pendiente {format(selectedMonth, 'MMMM', { locale: es })}</span>
                                <div className="flex gap-3 text-xs font-bold">
                                    {summary.pendingIncome > 0 && <span className="text-emerald-400">+$ {summary.pendingIncome.toLocaleString()}</span>}
                                    {summary.pendingExpenses > 0 && <span className="text-rose-400">-$ {summary.pendingExpenses.toLocaleString()}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-slate-800/40 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto justify-center md:justify-start">
                        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
                            <Wallet size={20} />
                        </div>
                        <div className="pr-4 text-left">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Patrimonio Total</p>
                            <p className="text-sm font-bold text-white">${summary.netWorth.toLocaleString('es-AR')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Grid / Mobile Carousel */}
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-6 -mx-4 px-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
                <SummaryCard
                    title="Liquidez Hoy"
                    amount={summary.liquidity}
                    icon={DollarSign}
                    colorClass="text-emerald-400"
                    gradient="from-emerald-500 to-teal-600"
                />
                <SummaryCard
                    title="Cap. Invertido"
                    amount={summary.invested}
                    icon={TrendingUp}
                    colorClass="text-blue-400"
                    gradient="from-blue-500 to-indigo-600"
                />
                <SummaryCard
                    title={`Gastos ${format(selectedMonth, 'MMMM', { locale: es })}`}
                    amount={summary.expenses}
                    icon={TrendingDown}
                    colorClass="text-rose-400"
                    gradient="from-rose-500 to-pink-600"
                />
                <SummaryCard
                    title="Patrimonio Neto"
                    amount={summary.netWorth}
                    icon={Wallet}
                    colorClass="text-white"
                    gradient="from-slate-700 to-slate-900"
                />
            </div>

            {/* Visualizations Section - Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Distribution Chart */}
                <div className="glass-card p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-emerald-400" size={20} />
                                Distribución de Ingresos ({format(selectedMonth, 'MMMM', { locale: es })})
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Origen de tus ingresos este mes.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <DistributionChart
                            type="ingreso"
                            transactions={transactions.filter(t => t.pagado && isSameMonth(parseISO(t.created_at), selectedMonth))}
                        />
                    </div>
                </div>

                {/* Expense Distribution Chart (Donut) */}
                <div className="glass-card p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingDown className="text-rose-400" size={20} />
                                Distribución de Gastos ({format(selectedMonth, 'MMMM', { locale: es })})
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Análisis por categorías este mes.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <DistributionChart
                            type="egreso"
                            transactions={transactions.filter(t => t.pagado && isSameMonth(parseISO(t.created_at), selectedMonth))}
                        />
                    </div>
                </div>
            </div>

            {/* Historical Trend Section - Full Width Row */}
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-400" size={20} />
                            Análisis de Tendencia Histórica (6 Meses)
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Comparativa de Ingresos vs Gastos para evaluar tu ahorro.</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <TrendChart transactions={transactions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
