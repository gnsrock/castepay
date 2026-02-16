import React, { useEffect, useState } from 'react';

const SuccessSplash = ({ type, onComplete }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const count = 28;
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            angle: (i / count) * Math.PI * 2 + (Math.random() * 0.5),
            distance: 100 + Math.random() * 180,
            size: 3 + Math.random() * 8,
            duration: 0.6 + Math.random() * 0.6,
            delay: Math.random() * 0.1
        }));

        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const color = type === 'ingreso' ? '#10b981' : '#f43f5e';

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
            {/* Screen Flash */}
            <div className="absolute inset-0 animate-flash" style={{ backgroundColor: color, opacity: 0 }} />

            {/* Central Burst */}
            <div className="relative">
                <div
                    className="absolute inset-x-0 inset-y-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl animate-burst-glow"
                    style={{ backgroundColor: color }}
                />

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
                            boxShadow: `0 0 12px ${color}, 0 0 4px white`,
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
                    0% { opacity: 0.2; }
                    100% { opacity: 0; }
                }
                @keyframes burst-glow {
                    0% { transform: scale(1); opacity: 1; }
                    70% { opacity: 0.5; }
                    100% { transform: scale(150); opacity: 0; }
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
                    animation: flash 0.8s ease-out forwards;
                }
                .animate-burst-glow {
                    animation: burst-glow 0.7s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
                }
                .animate-particle-premium {
                    animation: particle-premium var(--p-duration) cubic-bezier(0.1, 0.9, 0.2, 1) var(--p-delay) forwards;
                }
            `}} />
        </div>
    );
};

export default SuccessSplash;
