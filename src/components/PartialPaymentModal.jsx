import React, { useState, useEffect } from 'react';
import { X, DollarSign, Wallet } from 'lucide-react';
import { supabase } from '../supabaseClient';

const PartialPaymentModal = ({ isOpen, onClose, bill, onSuccess, user }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bill) {
            setAmount(bill.monto.toString());
        }
    }, [bill]);

    if (!isOpen || !bill) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            alert('Error de sesión. Por favor recarga la página.');
            return;
        }

        setLoading(true);
        const payAmount = parseFloat(amount);

        if (isNaN(payAmount) || payAmount <= 0) {
            alert('Por favor ingresa un monto válido.');
            setLoading(false);
            return;
        }

        if (payAmount > bill.monto) {
            alert('El monto del pago no puede ser mayor a la deuda.');
            setLoading(false);
            return;
        }

        try {
            // Full Payment
            if (Math.abs(payAmount - bill.monto) < 0.01) {
                const { error } = await supabase
                    .from('finanzas')
                    .update({ pagado: true })
                    .eq('id', bill.id)
                    .eq('user_id', user.id); // Security: ensure user owns the row

                if (error) throw error;
            } else {
                // Partial Payment Logic
                const newRemaining = bill.monto - payAmount;

                // 1. Update original bill
                const { error: updateError } = await supabase
                    .from('finanzas')
                    .update({ monto: newRemaining })
                    .eq('id', bill.id)
                    .eq('user_id', user.id); // Security check

                if (updateError) throw updateError;

                // 2. Create the payment record
                const { error: insertError } = await supabase
                    .from('finanzas')
                    .insert([{
                        nombre: `Pago parcial: ${bill.nombre}`,
                        monto: payAmount,
                        tipo: 'egreso',
                        categoria: bill.categoria,
                        pagado: true,
                        created_at: new Date().toISOString(),
                        user_id: user.id
                    }]);

                if (insertError) throw insertError;
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error detallado del pago:', err);
            alert(`Error al procesar el pago: ${err.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Registrar Pago</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-slate-400">Total a Pagar de <span className="text-white font-semibold">{bill.nombre}</span></p>
                        <h2 className="text-3xl font-bold text-white">${bill.monto.toLocaleString('es-AR')}</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">¿Cuánto vas a pagar hoy?</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="number"
                                required
                                min="0.01"
                                max={bill.monto}
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    <Wallet size={20} />
                                    Confirmar Pago
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartialPaymentModal;
