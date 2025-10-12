/** @type {import('tailwindcss').Config} */
const { phillyColors } = require('./constants/colors');
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                'philly': phillyColors,
            },
        },
    },
    plugins: [],
}