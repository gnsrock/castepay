import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

const ExpenseChart = ({ transactions }) => {
    const { data, total } = useMemo(() => {
        // Filter only expenses (egreso)
        const expenses = transactions.filter(t => t.tipo === 'egreso' && t.monto > 0);

        // Group by category
        const categoryTotals = expenses.reduce((acc, curr) => {
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
    }, [transactions]);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                <p className="text-slate-500 font-medium">Sin gastos este mes</p>
            </div>
        );
    }

    return (
        <div className="w-full h-80 relative flex items-center justify-center">
            {/* Central Total Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Gastado</span>
                <span className="text-2xl font-black text-white italic">
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
                                fill={COLORS[index % COLORS.length]}
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
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
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

export default ExpenseChart;
