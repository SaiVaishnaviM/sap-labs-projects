// Initialize app
let transactions = [];
let filteredType = 'all';

// Load transactions from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    setTodayDate();
    displayTransactions();
    updateBalance();
});

// Set today's date as default
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Handle form submission
document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!description || !amount || !category || !date) {
        alert('Please fill all fields');
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now(),
        description,
        amount,
        category,
        date,
        timestamp: new Date(date).getTime()
    };

    // Add to transactions array
    transactions.push(transaction);
    saveTransactions();
    displayTransactions();
    updateBalance();

    // Reset form
    document.getElementById('transactionForm').reset();
    setTodayDate();
});

// Display transactions
function displayTransactions() {
    const transactionsList = document.getElementById('transactionsList');

    // Filter transactions based on selected type
    let filteredTransactions = transactions;
    if (filteredType !== 'all') {
        filteredTransactions = transactions.filter(t => t.category === filteredType);
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // Clear list
    transactionsList.innerHTML = '';

    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-message">No transactions yet. Add one to get started!</p>';
        return;
    }

    // Display each transaction
    filteredTransactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = `transaction-item ${transaction.category}`;

        const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const amountSign = transaction.category === 'income' ? '+' : '-';
        const amountColor = transaction.category === 'income' ? 'income' : 'expense';

        transactionDiv.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${formattedDate}</div>
            </div>
            <div class="transaction-details">
                <div class="transaction-amount ${amountColor}">
                    ${amountSign}$${transaction.amount.toFixed(2)}
                </div>
                <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </div>
        `;

        transactionsList.appendChild(transactionDiv);
    });
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        displayTransactions();
        updateBalance();
    }
}

// Clear all transactions
function clearAllTransactions() {
    if (confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
        transactions = [];
        saveTransactions();
        displayTransactions();
        updateBalance();
    }
}

// Filter transactions by type
function filterTransactions(type) {
    filteredType = type;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayTransactions();
}

// Update balance calculations
function updateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.category === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `$${balance.toFixed(2)}`;

    // Change balance color based on positive or negative
    const balanceElement = document.getElementById('totalBalance');
    const balanceCard = balanceElement.closest('.balance-card');
    
    if (balance >= 0) {
        balanceCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        balanceCard.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load transactions from localStorage
function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
    }
}
