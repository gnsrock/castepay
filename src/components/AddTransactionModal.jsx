import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, Type, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../config/categories';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded, user, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        monto: '', // Numeric string for internal logic
        displayMonto: '', // Formatted string for UI
        tipo: 'egreso', // 'ingreso' or 'egreso'
        categoria: 'Varios',
        fecha_vencimiento: '',
        is_pending: false
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const rawMonto = initialData.monto.toString();
                const formattedMonto = rawMonto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                setFormData({
                    nombre: initialData.nombre,
                    monto: rawMonto,
                    displayMonto: formattedMonto,
                    tipo: initialData.tipo,
                    categoria: initialData.categoria,
                    fecha_vencimiento: initialData.fecha_vencimiento || '',
                    is_pending: !initialData.pagado
                });
            } else {
                setFormData({
                    nombre: '',
                    monto: '',
                    displayMonto: '',
                    tipo: 'egreso',
                    categoria: 'Varios',
                    fecha_vencimiento: '',
                    is_pending: false
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'monto') {
            // 1. Get only digits. We'll handle decimals as the last 2 digits if the user wants, 
            // but for simplicity and Pesos, let's just use automatic thousands formatting for integers.
            // If the user types a comma or dot, we treat it as a decimal separator.

            let rawValue = value.replace(/[^0-9]/g, ''); // Strict digits only for now

            // Format for display (Argentine style: dots for thousands)
            const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            setFormData(prev => ({
                ...prev,
                monto: rawValue,
                displayMonto: value === '' ? '' : formatted
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isPaidStatus = !formData.is_pending;

            const transactionData = {
                nombre: formData.nombre,
                monto: parseFloat(formData.monto),
                tipo: formData.tipo,
                categoria: formData.categoria,
                pagado: isPaidStatus,
                fecha_vencimiento: formData.fecha_vencimiento || null
            };

            let returnedData;

            if (initialData) {
                const { data, error } = await supabase
                    .from('finanzas')
                    .update(transactionData)
                    .eq('id', initialData.id)
                    .select();

                if (error) throw error;
                returnedData = data[0];
            } else {
                transactionData.created_at = new Date().toISOString();
                transactionData.user_id = user.id;

                const { data, error } = await supabase
                    .from('finanzas')
                    .insert([transactionData])
                    .select();

                if (error) throw error;
                returnedData = data[0];
            }

            if (onTransactionAdded) onTransactionAdded(returnedData, !!initialData);
            onClose();

            setFormData({
                nombre: '',
                monto: '',
                displayMonto: '',
                tipo: 'egreso',
                categoria: 'Varios',
                fecha_vencimiento: '',
                is_pending: false
            });

        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Error al guardar. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header - Fixed at top */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50 shrink-0">
                    <h3 className="text-xl font-bold text-white">{initialData ? 'Editar Registro' : 'Nuevo Registro'}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Type Selection */}
                        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/50 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, tipo: 'ingreso', categoria: CATEGORIES.ingreso[0].name })}
                                className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${formData.tipo === 'ingreso'
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Ingreso
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, tipo: 'egreso', categoria: CATEGORIES.egreso[0].name })}
                                className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${formData.tipo === 'egreso'
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Gasto
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, tipo: 'inversion', categoria: CATEGORIES.inversion[0].name })}
                                className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${formData.tipo === 'inversion'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Inversión
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">¿Qué es?</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder={
                                            formData.tipo === 'ingreso' ? 'Ej: Sueldo, Venta, Alquiler...' :
                                                formData.tipo === 'egreso' ? 'Ej: Luz, Super, Internet...' :
                                                    'Ej: Dólares, Apple Inc, Bitcoin...'
                                        }
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Monto</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        name="monto"
                                        required
                                        value={formData.displayMonto}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                                    />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="p-4 bg-slate-800/30 rounded-2xl border border-white/5 space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Estado del Movimiento</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_pending: !prev.is_pending }))}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all w-full ${formData.is_pending
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            }`}
                                    >
                                        {formData.is_pending ? <Circle size={18} /> : <CheckCircle2 size={18} />}
                                        <span className="font-bold text-sm">
                                            {formData.tipo === 'ingreso'
                                                ? (formData.is_pending ? 'Pendiente de Cobro' : 'Cobrado')
                                                : formData.tipo === 'egreso'
                                                    ? (formData.is_pending ? 'Pendiente de Pago' : 'Pagado ya')
                                                    : (formData.is_pending ? 'Inversión Programada' : 'Inversión realizada')
                                            }
                                        </span>
                                    </button>
                                </div>

                                {formData.is_pending && (
                                    <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-xs font-medium text-slate-400 mb-1 block">¿Cuándo vence / se cobra? (Opcional)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input
                                                type="date"
                                                name="fecha_vencimiento"
                                                required={false}
                                                value={formData.fecha_vencimiento}
                                                onChange={handleChange}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Categoría</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer font-medium"
                                    >
                                        {CATEGORIES[formData.tipo].map(cat => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Fixed at bottom of scrollable area or outside */}
                        <div className="pt-4 flex gap-3 sticky bottom-0 bg-slate-900 pb-2 mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${formData.tipo === 'ingreso' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20' :
                                    formData.tipo === 'egreso' ? 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-500/20' :
                                        'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        {initialData ? 'Actualizar' : formData.is_pending ? 'Programar' : 'Registrar'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;
