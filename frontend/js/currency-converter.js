/**
 * currency-converter.js
 * This file handles logic related to currency conversion. In a real application,
 * it would fetch live exchange rates from an API. Here, it uses mock data.
 */

const CurrencyConverter = {
    // Mock exchange rates relative to USD
    mockRates: {
        "USD": 1.0,
        "EUR": 0.92,
        "GBP": 0.79,
        "INR": 83.31,
    },

    /**
     * Fetches the latest exchange rates. (Mocked)
     * @returns {Promise<object>}
     */
    async getExchangeRates() {
        console.log('Fetching mock exchange rates...');
        // In a real app: return await Api.getRates();
        return Promise.resolve(this.mockRates);
    },

    /**
     * Converts an amount from one currency to another.
     * @param {number} amount - The amount to convert.
     * @param {string} fromCurrency - The currency to convert from (e.g., 'USD').
     * @param {string} toCurrency - The currency to convert to (e.g., 'INR').
     * @returns {Promise<number|null>} - The converted amount or null if conversion fails.
     */
    async convert(amount, fromCurrency, toCurrency) {
        try {
            const rates = await this.getExchangeRates();
            if (!rates[fromCurrency] || !rates[toCurrency]) {
                throw new Error('Invalid currency code provided.');
            }
            
            // Convert the amount to the base currency (USD) first
            const amountInUsd = amount / rates[fromCurrency];
            
            // Then convert from the base currency to the target currency
            const convertedAmount = amountInUsd * rates[toCurrency];
            
            return parseFloat(convertedAmount.toFixed(2));
        } catch (error) {
            console.error('Currency conversion failed:', error);
            return null;
        }
    }
};
