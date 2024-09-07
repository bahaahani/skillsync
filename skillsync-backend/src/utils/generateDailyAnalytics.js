const fs = require('fs');
const path = require('path');
// Function to generate daily analytics
function generateDailyAnalytics(data) {
    const analytics = {
        date: new Date().toISOString().split('T')[0],
        totalUsers: data.users.length,
        totalTransactions: data.transactions.length,
        totalRevenue: data.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    };

    return analytics;
}

// Function to save analytics to a file
function saveAnalyticsToFile(analytics) {
    const filePath = path.join(__dirname, 'dailyAnalytics.json');
    fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2), 'utf-8');
}

// Example usage
const exampleData = {
    users: [{ id: 1 }, { id: 2 }, { id: 3 }],
    transactions: [{ amount: 100 }, { amount: 200 }, { amount: 300 }]
};

const dailyAnalytics = generateDailyAnalytics(exampleData);
saveAnalyticsToFile(dailyAnalytics);

console.log('Daily analytics generated and saved successfully.');

exports.generateDailyAnalytics = generateDailyAnalytics;