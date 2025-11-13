// disableDarkMode.js
module.exports = function ({ addVariant }) {
    // sobrescreve o registrador de variantes e não cria "dark"
    addVariant('dark', () => { });
};