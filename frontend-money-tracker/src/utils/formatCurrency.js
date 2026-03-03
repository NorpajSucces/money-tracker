/**
 * Format angka ke format mata uang Rupiah
 * @param {number} amount
 * @returns {string} - contoh: "Rp 1.500.000"
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};
