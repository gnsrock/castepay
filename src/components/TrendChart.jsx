import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subMonths, startOfMonth, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const TrendChart = ({ transactions }) => {
    const data = useMemo(() => {
        // Generate last 6 months
        const months = Array.from({ length: 6 }).map((_, i) => {
            return startOfMonth(subMonths(new Date(), 5 - i));
        });

        return months.map(month => {
            const monthLabel = format(month, 'MMM', { locale: es });

            const monthStats = transactions.reduce((acc, curr) => {
                const tDate = parseISO(curr.created_at);
                if (isSameMonth(tDate, month) && curr.pagado) {
                    if (curr.tipo === 'ingreso') acc.ingresos += curr.monto;
                    else acc.gastos += curr.monto;
                }
                return acc;
            }, { ingresos: 0, gastos: 0 });

            return {
                name: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                ingresos: monthStats.ingresos,
                gastos: monthStats.gastos,
            };
        });
    }, [transactions]);

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">{label}</p>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-xs text-slate-300">Ingresos</span>
                                                </div>
                                                <span className="text-sm font-bold text-emerald-400">
                                                    ${payload[0].value.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                    <span className="text-xs text-slate-300">Gastos</span>
                                                </div>
                                                <span className="text-sm font-bold text-rose-400">
                                                    ${payload[1].value.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar
                        name="Ingresos"
                        dataKey="ingresos"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        barSize={20}
                    />
                    <Bar
                        name="Gastos"
                        dataKey="gastos"
                        fill="#f43f5e"
                        radius={[6, 6, 0, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
