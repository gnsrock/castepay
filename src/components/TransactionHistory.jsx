import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar as CalendarIcon, Tag, History, SearchX, Plus } from 'lucide-react';

const TransactionHistory = ({ transactions, onTogglePaid, onDelete, compact = false }) => {
    // Sort logic
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    );

    if (compact) {
        if (sortedTransactions.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20 text-center">
                    <History size={32} className="text-slate-600 mb-3 opacity-50" />
                    <p className="text-sm font-medium text-slate-400">Sin movimientos recientes</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {sortedTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${t.tipo === 'ingreso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {t.tipo === 'ingreso' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{t.nombre}</h4>
                                <p className="text-xs text-slate-500 capitalize">{t.categoria}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                {t.tipo === 'ingreso' ? '+' : '-'}${t.monto.toLocaleString('es-AR')}
                            </p>
                            <p className="text-[10px] text-slate-500">{format(parseISO(t.created_at), 'dd MMM', { locale: es })}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sortedTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 glass-card text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-800/50 p-6 rounded-full mb-6 border border-white/5 shadow-2xl">
                    <History size={64} className="text-slate-500 opacity-40" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Historial Vacío</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8">
                    Todavía no has registrado ningún movimiento o no hay datos que coincidan con tu búsqueda.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider text-center">
                            <th className="px-6 py-4 font-black">Fecha</th>
                            <th className="px-6 py-4 font-black text-left">Descripción</th>
                            <th className="px-6 py-4 font-black">Categoría</th>
                            <th className="px-6 py-4 font-black">Estado</th>
                            <th className="px-6 py-4 font-black text-right">Monto</th>
                            <th className="px-6 py-4 font-black w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {sortedTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-300">
                                        <CalendarIcon size={14} className="text-slate-500" />
                                        <span className="text-sm font-mono">{format(parseISO(t.created_at), 'dd/MM/yyyy', { locale: es })}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-100">{t.nombre}</span>
                                        {t.fecha_vencimiento && !t.pagado && (
                                            <span className="text-[10px] text-amber-500 font-black tracking-tighter uppercase">Pendiente</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 text-slate-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                        <Tag size={10} />
                                        {t.categoria}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {!t.pagado ? (
                                        <button
                                            onClick={() => onTogglePaid && onTogglePaid(t.id, t.pagado)}
                                            className="text-[10px] font-black px-3 py-1 rounded-lg transition-all border text-amber-400 bg-amber-400/5 border-amber-400/20 hover:bg-amber-400/10"
                                        >
                                            PENDIENTE
                                        </button>
                                    ) : t.fecha_vencimiento ? (
                                        <button
                                            onClick={() => onTogglePaid && onTogglePaid(t.id, t.pagado)}
                                            className="text-[10px] font-black px-3 py-1 rounded-lg transition-all border text-emerald-400 bg-emerald-400/5 border-emerald-400/20 hover:bg-emerald-400/10"
                                        >
                                            COMPLETADO
                                        </button>
                                    ) : (
                                        <span className="text-slate-500 text-[9px] font-black tracking-[0.2em] uppercase">Contado</span>
                                    )}
                                </td>
                                <td className={`px-6 py-4 text-right font-mono font-bold text-lg ${t.tipo === 'ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {t.tipo === 'ingreso' ? '+' : '-'}${t.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="text-slate-600 hover:text-rose-500 transition-all p-2 rounded-lg hover:bg-rose-500/10 opacity-0 group-hover:opacity-100"
                                        title="Eliminar registro"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
