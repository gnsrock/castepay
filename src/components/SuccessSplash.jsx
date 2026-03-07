import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

const SuccessSplash = ({ type, onComplete }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const count = 35; // More particles
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            angle: (i / count) * Math.PI * 2 + (Math.random() * 0.4),
            distance: 120 + Math.random() * 250,
            size: 4 + Math.random() * 8,
            duration: 1.2 + Math.random() * 0.8, // Longer duration
            delay: Math.random() * 0.2
        }));

        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2500); // 2.5 seconds total

        return () => clearTimeout(timer);
    }, [onComplete]);

    const isIncome = type === 'ingreso';
    const isInvestment = type === 'inversion';
    const color = isIncome ? '#10b981' : isInvestment ? '#3b82f6' : '#f43f5e';
    const Icon = isInvestment ? CheckCircle2 : (isIncome ? TrendingUp : TrendingDown);
    const label = isInvestment ? 'INVERSIÓN REGISTRADA' : (isIncome ? 'INGRESO REGISTRADO' : 'GASTO REGISTRADO');

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
            {/* Screen Flash */}
            <div className="absolute inset-0 animate-flash" style={{ backgroundColor: color, opacity: 0 }} />

            {/* Central Content */}
            <div className="relative flex flex-col items-center">
                {/* Glow behind icon */}
                <div
                    className="absolute w-32 h-32 rounded-full blur-[60px] animate-badge-glow"
                    style={{ backgroundColor: color, opacity: 0.6 }}
                />

                {/* The Badge */}
                <div className="relative z-10 flex flex-col items-center animate-badge-pop">
                    <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-xl mb-4"
                        style={{ background: `linear-gradient(135deg, ${color}, #0f172a)` }}
                    >
                        <Icon size={48} className="text-white animate-bounce-slow" />
                    </div>
                    <div
                        className="px-6 py-2 rounded-full bg-slate-900/90 border border-white/10 shadow-xl"
                    >
                        <p className="text-white font-black tracking-[0.2em] text-xs whitespace-nowrap">
                            {label}
                        </p>
                    </div>
                </div>

                {/* Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full animate-particle-premium"
                        style={{
                            backgroundColor: color,
                            width: p.size,
                            height: p.size,
                            '--p-angle': `${p.angle}rad`,
                            '--p-distance': `${p.distance}px`,
                            '--p-duration': `${p.duration}s`,
                            '--p-delay': `${p.delay}s`,
                            boxShadow: `0 0 15px ${color}, 0 0 5px white`,
                            top: '50%',
                            left: '50%',
                            marginLeft: -p.size / 2,
                            marginTop: -p.size / 2
                        }}
                    />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes flash {
                    0% { opacity: 0.3; }
                    100% { opacity: 0; }
                }
                @keyframes badge-pop {
                    0% { transform: scale(0) rotate(-10deg); opacity: 0; }
                    20% { transform: scale(1.2) rotate(5deg); opacity: 1; }
                    40% { transform: scale(1) rotate(0deg); }
                    80% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
                }
                @keyframes badge-glow {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(2); opacity: 0.6; }
                    100% { transform: scale(3); opacity: 0; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes particle-premium {
                    0% { transform: translate(0, 0) scale(1.5); opacity: 1; }
                    20% { opacity: 1; }
                    100% { 
                        transform: translate(calc(cos(var(--p-angle)) * var(--p-distance)), calc(sin(var(--p-angle)) * var(--p-distance))) scale(0); 
                        opacity: 0; 
                    }
                }
                .animate-flash {
                    animation: flash 1.2s ease-out forwards;
                }
                .animate-badge-pop {
                    animation: badge-pop 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .animate-badge-glow {
                    animation: badge-glow 1.5s ease-out forwards;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 1s ease-in-out infinite;
                }
                .animate-particle-premium {
                    animation: particle-premium var(--p-duration) cubic-bezier(0.1, 0.9, 0.2, 1) var(--p-delay) forwards;
                }
            `}} />
        </div>
    );
};

export default SuccessSplash;
