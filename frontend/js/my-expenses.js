import { Api } from './api.js';
import { Utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const myExpensesBody = document.getElementById('myExpensesBody');
    myExpensesBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    try {
        const expenses = await Api.getMyExpenses();
        myExpensesBody.innerHTML = '';
        if (expenses.length === 0) {
            myExpensesBody.innerHTML = '<tr><td colspan="5">No expenses found.</td></tr>';
            return;
        }
        expenses.forEach(expense => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${expense.date}</td>
                <td>$${expense.amount}</td>
                <td>${Utils.escapeHTML(expense.category)}</td>
                <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                <td><a href="/common/expense-details.html?id=${expense.id}">View</a></td>
            `;
            myExpensesBody.appendChild(tr);
        });
    } catch (error) {
        myExpensesBody.innerHTML = '<tr><td colspan="5">Failed to load expenses.</td></tr>';
    }
});