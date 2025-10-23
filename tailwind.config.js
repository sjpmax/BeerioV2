/** @type {import('tailwindcss').Config} */
const { phillyColors } = require('./constants/colors');

module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                'philly-navy': phillyColors.navy,
                'philly-deepNavy': phillyColors.deepNavy,
                'philly-midnight': phillyColors.midnight,
                'philly-lighterNavy': phillyColors.lighterNavy,
                'philly-gold': phillyColors.gold,
                'philly-mutedGold': phillyColors.mutedGold,
                'philly-lightGold': phillyColors.lightGold,
                'philly-darkGold': phillyColors.darkGold,
                'philly-accent': phillyColors.accent,
                'philly-lightNavy': phillyColors.lightNavy,
                'philly-popLight': phillyColors.popLight,
                'philly-cardBG': phillyColors.cardBG,
            },
        },
    },
    plugins: [],
}