/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0F172A',
                    card: '#1E293B',
                    text: '#F8FAFC',
                    muted: '#94A3B8'
                },
                primary: {
                    DEFAULT: '#3B82F6',
                    hover: '#2563EB',
                },
                accent: {
                    DEFAULT: '#8B5CF6',
                    hover: '#7C3AED',
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
