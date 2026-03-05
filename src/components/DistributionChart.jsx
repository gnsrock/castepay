import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INCOME_COLORS = ['#10B981', '#059669', '#34D399', '#064E3B', '#10B981', '#6EE7B7'];
const EXPENSE_COLORS = ['#F43F5E', '#E11D48', '#FB7185', '#9F1239', '#F43F5E', '#FDA4AF'];

const DistributionChart = ({ transactions, type = 'egreso' }) => {
    const { data, total } = useMemo(() => {
        // Filter transactions by type and ensure monto > 0
        const filtered = transactions.filter(t => t.tipo === type && t.monto > 0);

        // Group by category
        const categoryTotals = filtered.reduce((acc, curr) => {
            const cat = curr.categoria || 'Varios';
            acc[cat] = (acc[cat] || 0) + curr.monto;
            return acc;
        }, {});

        const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);

        const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);

        return { data: chartData, total: totalSum };
    }, [transactions, type]);

    const colors = type === 'ingreso' ? INCOME_COLORS : EXPENSE_COLORS;
    const accentColor = type === 'ingreso' ? 'text-emerald-400' : 'text-rose-400';
    const labelText = type === 'ingreso' ? 'Total Cobrado' : 'Total Gastado';

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                <p className="text-slate-500 font-medium">Sin datos para mostrar</p>
            </div>
        );
    }

    return (
        <div className="w-full h-80 relative flex items-center justify-center">
            {/* Central Total Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{labelText}</span>
                <span className={`text-2xl font-black italic ${accentColor}`}>
                    ${total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                                className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const { name, value } = payload[0].payload;
                                return (
                                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Categoría</p>
                                        <p className="text-sm font-bold text-white mb-2">{name}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${type === 'ingreso' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <p className="text-lg font-black text-white italic">
                                                ${value.toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DistributionChart;
