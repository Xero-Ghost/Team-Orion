/**
 * chart-handler.js
 * A reusable module for creating and managing all charts in the application
 * using the Chart.js library.
 */

export const ChartHandler = {
    /**
     * Creates or updates a chart on a given canvas element.
     * @param {string | HTMLCanvasElement} canvasIdOrElement - The ID of the canvas or the canvas element itself.
     * @param {string} type - The type of chart (e.g., 'line', 'bar', 'pie').
     * @param {object} data - The data object for the chart, conforming to Chart.js structure.
     * @param {object} [options] - Optional Chart.js options object.
     * @returns {Chart|null} The new Chart.js instance or null if creation fails.
     */
    createChart(canvasIdOrElement, type, data, options = {}) {
        const canvas = typeof canvasIdOrElement === 'string' 
            ? document.getElementById(canvasIdOrElement) 
            : canvasIdOrElement;

        if (!canvas) {
            console.error('Chart canvas not found:', canvasIdOrElement);
            return null;
        }

        const ctx = canvas.getContext('2d');

        // To prevent multiple charts from being drawn on top of each other,
        // we can check if a chart instance already exists and destroy it.
        if (canvas.chart) {
            canvas.chart.destroy();
        }

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            // You can add other global default options here
        };

        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: { ...defaultOptions, ...options },
        });

        // Store the chart instance on the canvas element for later access
        canvas.chart = chart;
        return chart;
    }
};