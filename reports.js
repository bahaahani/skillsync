// Sample data for reports
const reportData = {
    skillDistribution: {
        labels: ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP'],
        datasets: [{
            data: [30, 25, 20, 15, 5, 5],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
    },
    courseCompletion: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Completed Courses',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#36A2EB',
            tension: 0.1
        }]
    },
    departmentPerformance: {
        labels: ['IT', 'HR', 'Marketing', 'Finance', 'Sales'],
        datasets: [{
            label: 'Average Skill Score',
            data: [85, 75, 80, 90, 70],
            backgroundColor: '#36A2EB'
        }]
    }
};

let currentChart = null;
let customReports = [];

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportContainer = document.getElementById('reportContainer');
    const reportSummary = document.getElementById('reportSummary');
    const ctx = document.getElementById('reportChart').getContext('2d');

    // Destroy previous chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Generate new chart
    switch (reportType) {
        case 'skillDistribution':
            currentChart = new Chart(ctx, {
                type: 'pie',
                data: reportData.skillDistribution,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Skill Distribution'
                        }
                    }
                }
            });
            reportSummary.innerHTML = generateSkillDistributionSummary();
            break;
        case 'courseCompletion':
            currentChart = new Chart(ctx, {
                type: 'line',
                data: reportData.courseCompletion,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Course Completion Trends'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            reportSummary.innerHTML = generateCourseCompletionSummary();
            break;
        case 'departmentPerformance':
            currentChart = new Chart(ctx, {
                type: 'bar',
                data: reportData.departmentPerformance,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Department Performance'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            reportSummary.innerHTML = generateDepartmentPerformanceSummary();
            break;
    }
}

function generateSkillDistributionSummary() {
    const totalSkills = reportData.skillDistribution.datasets[0].data.reduce((a, b) => a + b, 0);
    const topSkill = reportData.skillDistribution.labels[
        reportData.skillDistribution.datasets[0].data.indexOf(
            Math.max(...reportData.skillDistribution.datasets[0].data)
        )
    ];
    return `
        <h3>Skill Distribution Summary</h3>
        <p>Total skills: ${totalSkills}</p>
        <p>Top skill: ${topSkill}</p>
        <p>This report shows the distribution of skills across the organization. It helps identify the most common skills and areas where training may be needed.</p>
    `;
}

function generateCourseCompletionSummary() {
    const totalCompleted = reportData.courseCompletion.datasets[0].data.reduce((a, b) => a + b, 0);
    const averagePerMonth = (totalCompleted / reportData.courseCompletion.labels.length).toFixed(2);
    return `
        <h3>Course Completion Summary</h3>
        <p>Total courses completed: ${totalCompleted}</p>
        <p>Average completions per month: ${averagePerMonth}</p>
        <p>This report shows the trend of course completions over time. It can help identify periods of high and low engagement with training programs.</p>
    `;
}

function generateDepartmentPerformanceSummary() {
    const averageScore = (reportData.departmentPerformance.datasets[0].data.reduce((a, b) => a + b, 0) / reportData.departmentPerformance.labels.length).toFixed(2);
    const topDepartment = reportData.departmentPerformance.labels[
        reportData.departmentPerformance.datasets[0].data.indexOf(
            Math.max(...reportData.departmentPerformance.datasets[0].data)
        )
    ];
    return `
        <h3>Department Performance Summary</h3>
        <p>Average skill score across departments: ${averageScore}</p>
        <p>Top performing department: ${topDepartment}</p>
        <p>This report compares the average skill scores across different departments. It can help identify departments that may need additional support or training.</p>
    `;
}

function createReport(event) {
    event.preventDefault();
    const title = document.getElementById('reportTitle').value;
    const type = document.getElementById('reportType').value;

    const newReport = { id: customReports.length + 1, title, type };
    customReports.push(newReport);
    populateCustomReportList();
    closeAllModals();
    showNotification(`Report "${title}" created successfully!`, "success");
    event.target.reset();
}

function populateCustomReportList() {
    const customReportList = document.getElementById('customReportList');
    customReportList.innerHTML = '';

    customReports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${report.title}</h3>
            <p><strong>Type:</strong> ${report.type}</p>
            <button onclick="generateCustomReport(${report.id})" class="btn">View Report</button>
            <button onclick="editReport(${report.id})" class="btn">Edit</button>
            <button onclick="deleteReport(${report.id})" class="btn">Delete</button>
        `;
        customReportList.appendChild(card);
    });
}

function generateCustomReport(id) {
    const report = customReports.find(r => r.id === id);
    if (!report) return;
    document.getElementById('reportType').value = report.type;
    generateReport();
    showNotification(`Generating report: "${report.title}"`, "info");
}

function editReport(id) {
    const report = customReports.find(r => r.id === id);
    if (!report) return;
    showNotification(`Editing report: "${report.title}"`, "info");
    // TODO: Implement report editing functionality
}

function deleteReport(id) {
    const report = customReports.find(r => r.id === id);
    if (!report) return;
    if (confirm(`Are you sure you want to delete "${report.title}"?`)) {
        customReports = customReports.filter(r => r.id !== id);
        populateCustomReportList();
        showNotification(`Report "${report.title}" deleted successfully!`, "success");
    }
}

// Event listeners
window.onload = function() {
    generateReport();
    document.getElementById('createReportForm').addEventListener('submit', createReport);
};