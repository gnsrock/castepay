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
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                            padding: '12px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                        formatter={(value) => [`$${value.toLocaleString('es-AR')}`]}
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
