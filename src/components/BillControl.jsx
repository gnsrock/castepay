import React, { useState } from 'react';
import { format, isBefore, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, AlertCircle, Clock, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import PartialPaymentModal from './PartialPaymentModal';
import { supabase } from '../supabaseClient';

const BillControl = ({ transactions, onUpdate, user }) => {
    const [selectedBill, setSelectedBill] = useState(null);
    const [activeSection, setActiveSection] = useState('egreso'); // 'egreso' or 'ingreso'

    // Filter unpaid/uncollected items (now including those without dates)
    const pendingItems = transactions
        .filter(t => t.tipo === activeSection && !t.pagado && (t.fecha_vencimiento || t.pagado === false))
        .sort((a, b) => {
            if (!a.fecha_vencimiento && !b.fecha_vencimiento) return 0;
            if (!a.fecha_vencimiento) return 1; // Put dateless at the end
            if (!b.fecha_vencimiento) return -1;
            return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
        });

    const pendingExpenses = transactions.filter(t => t.tipo === 'egreso' && !t.pagado);
    const pendingIncomes = transactions.filter(t => t.tipo === 'ingreso' && !t.pagado);

    const totalDeuda = pendingExpenses.reduce((acc, curr) => acc + curr.monto, 0);
    const totalCobros = pendingIncomes.reduce((acc, curr) => acc + curr.monto, 0);

    const handleQuickMarkAsDone = async (item) => {
        try {
            const { error } = await supabase
                .from('finanzas')
                .update({ pagado: true })
                .eq('id', item.id)
                .eq('user_id', user.id);

            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error al actualizar el estado.');
        }
    };

    return (
        <>
            <div className="glass-card p-6 h-full flex flex-col min-h-[500px]">
                {/* Header with Tabs */}
                <div className="flex flex-col mb-6 gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-400" />
                            Agenda Financiera
                        </h2>
                    </div>

                    <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveSection('egreso')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSection === 'egreso'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <TrendingDown size={16} />
                            Por Pagar ({pendingExpenses.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('ingreso')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSection === 'ingreso'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <TrendingUp size={16} />
                            Por Cobrar ({pendingIncomes.length})
                        </button>
                    </div>

                    <div className={`p-4 rounded-2xl flex items-center justify-between ${activeSection === 'egreso' ? 'bg-rose-500/5 border border-rose-500/10' : 'bg-emerald-500/5 border border-emerald-500/10'
                        }`}>
                        <span className="text-sm text-slate-400 font-medium">
                            {activeSection === 'egreso' ? 'Total Pendiente' : 'Total por Recibir'}
                        </span>
                        <span className={`text-xl font-black ${activeSection === 'egreso' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            ${(activeSection === 'egreso' ? totalDeuda : totalCobros).toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>

                {/* List of Pending Items */}
                {pendingItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-700 rounded-3xl bg-slate-800/30 animate-in fade-in zoom-in duration-500">
                        <CheckCircle className={`w-14 h-14 mb-4 opacity-20 ${activeSection === 'egreso' ? 'text-emerald-500' : 'text-blue-500'}`} />
                        <h3 className="text-lg font-bold text-white mb-2">
                            {activeSection === 'egreso' ? '¡Sin cuentas pendientes!' : '¡Nada por cobrar!'}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-[200px]">
                            {activeSection === 'egreso' ? 'Has pagado todos tus compromisos.' : 'No tienes cobros programados para estos días.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {pendingItems.map((item) => {
                            const dueDate = item.fecha_vencimiento ? parseISO(item.fecha_vencimiento) : null;
                            const isUrgent = dueDate ? isBefore(dueDate, addDays(new Date(), 3)) : false;
                            const isOverdue = dueDate ? isBefore(dueDate, new Date()) : false;

                            const statusColor = activeSection === 'egreso'
                                ? (isOverdue ? 'rose' : isUrgent ? 'amber' : 'blue')
                                : 'emerald';

                            return (
                                <div
                                    key={item.id}
                                    className={`group p-4 rounded-2xl border relative overflow-hidden transition-all hover:scale-[1.01] ${activeSection === 'egreso'
                                        ? isOverdue ? 'border-rose-500/30 bg-rose-500/5' : isUrgent ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50 bg-slate-800/40'
                                        : 'border-emerald-500/20 bg-emerald-500/5'
                                        }`}
                                >
                                    {/* Indicator Stripe */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${activeSection === 'egreso'
                                        ? isOverdue ? 'bg-rose-500' : isUrgent ? 'bg-amber-500' : 'bg-blue-500'
                                        : 'bg-emerald-500'
                                        }`} />

                                    <div className="flex justify-between items-start pl-3">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-bold text-slate-100 text-lg leading-tight">{item.nombre}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded text-slate-500 border border-white/5">
                                                    {item.categoria}
                                                </span>
                                                <span className={`text-xs font-bold flex items-center gap-1.5 ${activeSection === 'egreso'
                                                    ? isOverdue ? 'text-rose-400' : isUrgent ? 'text-amber-400' : 'text-slate-400'
                                                    : 'text-emerald-400'
                                                    }`}>
                                                    <Clock size={12} />
                                                    {item.fecha_vencimiento ? (
                                                        <>
                                                            {isOverdue ? 'Venció el ' : 'Vence el '}
                                                            {format(dueDate, 'dd MMM', { locale: es })}
                                                        </>
                                                    ) : (
                                                        'A cobrar / pagar pronto'
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-xl font-black tracking-tight text-white italic">
                                                ${item.monto.toLocaleString('es-AR')}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                {activeSection === 'egreso' && (
                                                    <button
                                                        onClick={() => setSelectedBill(item)}
                                                        className="opacity-0 group-hover:opacity-100 transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/5"
                                                    >
                                                        Parcial
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleQuickMarkAsDone(item)}
                                                    className={`px-4 py-1.5 rounded-lg text-white text-[11px] font-black uppercase tracking-wider shadow-lg transition-all transform active:scale-95 ${activeSection === 'egreso'
                                                        ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                                                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                                                        }`}
                                                >
                                                    {activeSection === 'egreso' ? 'Pagar' : 'Cobrar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <PartialPaymentModal
                isOpen={!!selectedBill}
                bill={selectedBill}
                user={user}
                onClose={() => setSelectedBill(null)}
                onSuccess={onUpdate}
            />
        </>
    );
};

export default BillControl;
