document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart and ChartHandler are available.
    // This is a safeguard to ensure the chart library has loaded.
    if (typeof Chart === 'undefined' || typeof ChartHandler === 'undefined') {
        console.error('Chart.js or ChartHandler is not available.');
        return;
    }

    // --- MOCK DATA for initial chart display ---
    const mockReportData = {
        trend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [12000, 19000, 15000, 22000, 18000, 25000],
        },
        department: {
            labels: ['Engineering', 'Marketing', 'Sales'],
            data: [45000, 32000, 58000],
        }
    };

    // --- RENDER INITIAL CHARTS ---
    const trendCtx = document.getElementById('reportTrendChart');
    if (trendCtx) {
        ChartHandler.createChart(trendCtx, 'line', {
            labels: mockReportData.trend.labels,
            datasets: [{
                label: 'Expenses Over Time',
                data: mockReportData.trend.data,
                borderColor: 'var(--primary-color)',
                tension: 0.3,
                fill: false
            }]
        });
    }

    const deptCtx = document.getElementById('reportDepartmentChart');
    if (deptCtx) {
        ChartHandler.createChart(deptCtx, 'bar', {
            labels: mockReportData.department.labels,
            datasets: [{
                label: 'Spending by Department',
                data: mockReportData.department.data,
                backgroundColor: ['var(--primary-color)', 'var(--success-color)', 'var(--warning-color)'],
            }]
        });
    }

    // --- FORM SUBMISSION LOGIC ---
    // Attaches a click listener to the "Generate Report" button.
    const generateBtn = document.getElementById('generateReportBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Gathers the current values from all the filter fields in the form.
            const reportType = document.getElementById('reportType').value;
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const department = document.getElementById('departmentFilter').value;
            const status = document.getElementById('statusFilter').value;

            // Logs the selected filters to the console for testing purposes.
            console.log('Generating report with the following filters:');
            console.log({
                reportType,
                dateFrom,
                dateTo,
                department,
                status
            });

            // In a real application, you would now use these values
            // to fetch new data from your backend API and then update
            // the charts and tables in the "Report Display Area".

            // Shows a success notification to the user.
            Notification.show('Report generated successfully!', 'success');
        });
    }
});

