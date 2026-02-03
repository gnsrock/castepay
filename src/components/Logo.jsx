import React from 'react';

const Logo = ({ size = 48, className = "" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
                <defs>
                    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                        <stop offset="100%" stopColor="#4f46e5" /> {/* indigo-600 */}
                    </linearGradient>
                    <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" /> {/* blue-400 */}
                        <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
                    </linearGradient>
                </defs>

                {/* Outer Glow Ring */}
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" strokeOpacity="0.1" fill="#1e293b" fillOpacity="0.2" />

                {/* Stylized 'C' - Outer Curve */}
                <path
                    d="M72 28C66 20 55 18 45 22C30 28 25 45 30 60C35 75 52 82 68 76C75 73 80 68 82 60"
                    stroke="url(#brandGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Wallet Symbol in the center */}
                <rect
                    x="42" y="42" width="34" height="22" rx="4"
                    fill="url(#walletGradient)"
                    className="animate-pulse"
                    style={{ animationDuration: '3s' }}
                />

                {/* Wallet Flap */}
                <path
                    d="M68 46H78C80 46 82 48 82 50V56C82 58 80 60 78 60H68"
                    fill="url(#brandGradient)"
                    stroke="white"
                    strokeWidth="1"
                />

                {/* Detail Dot */}
                <circle cx="75" cy="53" r="2" fill="white" />

                {/* Inner white rim for 'pop' */}
                <path
                    d="M72 28C66 20 55 18 45 22"
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default Logo;
