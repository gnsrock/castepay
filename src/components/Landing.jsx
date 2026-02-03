import React, { useState } from 'react';
// import Logo from './Logo';
import { supabase } from '../supabaseClient';
import {
    ShieldCheck,
    Zap,
    ArrowRight,
    Users,
    Lock,
    TrendingUp,
    Mail,
    KeyRound,
    UserCircle2,
    Eye,
    EyeOff,
    CheckCircle
} from 'lucide-react';

const Landing = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('landing'); // 'landing' | 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleAnonymousLogin = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (error) {
            console.error('Error in anonymous login:', error);
            alert('Error al conectar. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (isSignUp) => {
        if (!email || !password) {
            alert('Por favor completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            let result;
            if (isSignUp) {
                result = await supabase.auth.signUp({ email, password });
            } else {
                result = await supabase.auth.signInWithPassword({ email, password });
            }

            if (result.error) throw result.error;

            if (isSignUp) {
                // Check if autoconfirm is enabled or if user is returned without session
                if (result.data?.user && !result.data?.session) {
                    setView('confirm-email');
                } else {
                    if (onLoginSuccess) onLoginSuccess(result.data.user);
                }
            } else {
                if (onLoginSuccess) onLoginSuccess(result.data.user);
            }
        } catch (error) {
            console.error('Auth error:', error.message);
            // Handle Spanish translation for common errors
            let msg = error.message;
            if (msg === 'Email not confirmed') msg = 'Por favor confirma tu email. Revisa tu bandeja de entrada o spam.';
            if (msg === 'Invalid login credentials') msg = 'Email o contraseña incorrectos.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    if (view === 'confirm-email') {
        return (
            <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="max-w-md w-full glass-card p-10 text-center relative z-10 animate-in fade-in zoom-in duration-500">
                    <div className="bg-emerald-500/20 text-emerald-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">¡Casi listo!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Te hemos enviado un link de confirmación a <span className="text-white font-bold">{email}</span>.
                        Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
                    </p>
                    <button
                        onClick={() => setView('login')}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                    >
                        Volver al Inicio de Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'login' || view === 'signup') {
        return (
            <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

                <div className="max-w-md w-full glass-card p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button onClick={() => setView('landing')} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 text-sm transition-colors font-bold group">
                        <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Volver
                    </button>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
                        {view === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>
                    <p className="text-slate-400 mb-8 text-sm font-medium">
                        {view === 'login' ? 'Ingresa tus credenciales para acceder a tus finanzas.' : 'Tu información se sincronizará de forma segura en la nube.'}
                    </p>

                    <div className="space-y-5">
                        <div className="space-y-1.5 focus-within:text-blue-400 transition-colors">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dirección de Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:text-blue-400 transition-colors">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contraseña Segura</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-12 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => handleEmailAuth(view === 'signup')}
                            disabled={loading}
                            className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all mt-4 flex items-center justify-center gap-2 transform active:scale-[0.98] ${loading ? 'bg-slate-700' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/20'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' ? 'Iniciar Sesión' : 'Registrar Cuenta'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <div className="pt-4 text-center">
                            <p className="text-slate-500 text-sm font-medium">
                                {view === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya eres miembro?'}
                                <button
                                    onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                    className="text-blue-400 font-bold ml-2 hover:text-blue-300 transition-colors"
                                >
                                    {view === 'login' ? 'Regístrate' : 'Entra aquí'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

            <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                    <div className="w-48 h-48 flex items-center justify-center mb-8 group rounded-full border-[6px] border-white shadow-2xl shadow-blue-500/20 overflow-hidden bg-white">
                        <img
                            src="/logo.png"
                            alt="CastePay Logo"
                            className="w-full h-full object-cover scale-110 group-hover:scale-[1.15] transition-transform duration-700"
                        />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                        Caste<span className="text-blue-500">Pay</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed font-bold opacity-80">
                        Control total, privacidad absoluta y gestión profesional de tu economía.
                    </p>
                </div>

                {/* Main CTA: Guest vs Login */}
                <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4 text-center">
                        <button
                            onClick={handleAnonymousLogin}
                            disabled={loading}
                            className="group flex flex-col items-center p-8 bg-slate-800/40 hover:bg-slate-800/60 transition-all rounded-[2rem] border border-white/5 hover:border-blue-500/50"
                        >
                            <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={32} />
                            </div>
                            <span className="text-2xl font-black text-white mb-2 leading-tight">Modo Invitado</span>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Acceso express sin registros. <br />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-400/50 transition-colors">Sesión temporal</span>
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-[10px] group-hover:translate-y-0">
                                Entrar ahora <ArrowRight size={16} />
                            </div>
                        </button>

                        <button
                            onClick={() => setView('login')}
                            className="group flex flex-col items-center p-8 bg-slate-800/40 hover:bg-slate-800/60 transition-all rounded-[2rem] border border-white/5 hover:border-indigo-500/50"
                        >
                            <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                <UserCircle2 size={32} />
                            </div>
                            <span className="text-2xl font-black text-white mb-2 leading-tight">Acceso Privado</span>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Sincroniza tus datos en la nube.<br />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-indigo-400/50 transition-colors">Sesión permanente</span>
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-[10px] group-hover:translate-y-0">
                                Iniciar Sesión <ArrowRight size={16} />
                            </div>
                        </button>
                    </div>

                    <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        Seguridad de Grado Bancario Activa
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
