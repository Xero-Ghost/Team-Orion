/**
 * chart-handler.js
 * This file is responsible for creating and managing all charts in the application
 * using the Chart.js library.
 */

const ChartHandler = {
    /**
     * Initializes all charts on the current page.
     */
    initCharts() {
        this.createExpenseTrendChart();
        this.createCategoryChart();
        this.createDepartmentChart();
    },

    /**
     * Creates the Expense Trends line chart.
     */
    createExpenseTrendChart() {
        const ctx = document.getElementById('expenseTrendChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [12000, 19000, 15000, 22000, 18000, 25000],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    },

    /**
     * Creates the Category Breakdown pie chart.
     */
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Travel', 'Food', 'Accommodation', 'Supplies'],
                datasets: [{
                    label: 'Expense by Category',
                    data: [4500, 2500, 3200, 1500],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(107, 114, 128, 0.8)',
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    },
    
    /**
     * Creates the Department Spending bar chart.
     */
    createDepartmentChart() {
        const ctx = document.getElementById('departmentChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Engineering', 'Sales', 'Marketing', 'HR'],
                datasets: [{
                    label: 'Spending by Department',
                    data: [35000, 52000, 28000, 15000],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
};
