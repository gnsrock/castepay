import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

const ExpenseChart = ({ transactions }) => {
    const data = useMemo(() => {
        // Filter only expenses (egreso)
        const expenses = transactions.filter(t => t.tipo === 'egreso');

        // Group by category
        const categoryTotals = expenses.reduce((acc, curr) => {
            const cat = curr.categoria || 'Sin Categoría';
            acc[cat] = (acc[cat] || 0) + curr.monto;
            return acc;
        }, {});

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value
        }));
    }, [transactions]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                No hay datos de egresos para mostrar
            </div>
        );
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']}
                        contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#F8FAFC' }}
                        itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;
