// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
        // Tailwind CSS의 @layer를 사용하여 CSS 추가
        function({ addBase }) {
            addBase({
                '*': {
                    'scrollbar-width': 'none',  // Firefox
                },
                '::-webkit-scrollbar': {
                    display: 'none',  // Chrome/Safari/Edge
                },
            });
        },
    ],
}
