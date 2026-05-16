/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
            },
            animation: {
                'bounce-in': 'bounce-in 0.6s ease-out',
                'slide-up': 'slide-up 0.5s ease-out',
                'pulse-glow': 'pulse-glow 2s infinite',
                'spin-slow': 'spin-slow 3s linear infinite',
            },
            keyframes: {
                'bounce-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.3) translateY(20px)',
                    },
                    '50%': {
                        opacity: '1',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1) translateY(0)',
                    },
                },
                'slide-up': {
                    'from': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    },
                    '50%': {
                        boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
                    },
                },
                'spin-slow': {
                    'from': {
                        transform: 'rotate(0deg)',
                    },
                    'to': {
                        transform: 'rotate(360deg)',
                    },
                },
            },
            boxShadow: {
                'lg-custom': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'xl-custom': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
            backdropBlur: {
                sm: '4px',
            },
        },
    },
    plugins: [],
}