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
    },
    learningPathProgress: {
        labels: ['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'AI/ML'],
        datasets: [{
            label: 'Average Progress (%)',
            data: [75, 60, 85, 50, 70],
            backgroundColor: '#36A2EB'
        }]
    },
    skillGapAnalysis: {
        labels: ['Problem Solving', 'Communication', 'Leadership', 'Technical Skills', 'Project Management'],
        datasets: [{
            label: 'Current Level',
            data: [7, 8, 6, 9, 7],
            backgroundColor: '#36A2EB'
        }, {
            label: 'Required Level',
            data: [8, 9, 8, 10, 8],
            backgroundColor: '#FF6384'
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
        case 'learningPathProgress':
            currentChart = new Chart(ctx, {
                type: 'radar',
                data: reportData.learningPathProgress,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Learning Path Progress'
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });
            reportSummary.innerHTML = generateLearningPathProgressSummary();
            break;
        case 'skillGapAnalysis':
            currentChart = new Chart(ctx, {
                type: 'bar',
                data: reportData.skillGapAnalysis,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Skill Gap Analysis'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10
                        }
                    }
                }
            });
            reportSummary.innerHTML = generateSkillGapAnalysisSummary();
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

function generateLearningPathProgressSummary() {
    const averageProgress = (reportData.learningPathProgress.datasets[0].data.reduce((a, b) => a + b, 0) / reportData.learningPathProgress.labels.length).toFixed(2);
    const topPath = reportData.learningPathProgress.labels[
        reportData.learningPathProgress.datasets[0].data.indexOf(
            Math.max(...reportData.learningPathProgress.datasets[0].data)
        )
    ];
    return `
        <h3>Learning Path Progress Summary</h3>
        <p>Average progress across learning paths: ${averageProgress}%</p>
        <p>Top progressing path: ${topPath}</p>
        <p>This report shows the average progress in various learning paths. It helps identify which areas employees are focusing on and where additional resources might be needed.</p>
    `;
}

function generateSkillGapAnalysisSummary() {
    const currentLevels = reportData.skillGapAnalysis.datasets[0].data;
    const requiredLevels = reportData.skillGapAnalysis.datasets[1].data;
    const gaps = requiredLevels.map((req, index) => req - currentLevels[index]);
    const avgGap = (gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2);
    const largestGapSkill = reportData.skillGapAnalysis.labels[gaps.indexOf(Math.max(...gaps))];

    return `
        <h3>Skill Gap Analysis Summary</h3>
        <p>Average skill gap: ${avgGap}</p>
        <p>Skill with largest gap: ${largestGapSkill}</p>
        <p>This report compares current skill levels with required levels across various skills. It helps identify areas where additional training or development is needed.</p>
    `;
}

function fetchCustomReportData(metric, dimension, timeframe) {
    // Fetch data from the server or database based on the selected metric, dimension, and timeframe
    // Replace this with your actual data fetching logic
    const data = {
        labels: ['Department A', 'Department B', 'Department C', 'Department D'],
        values: [85, 75, 80, 90]
    };
    return data;
}

function generateCustomReportSummary(metric, dimension, timeframe, data) {
    // Generate a meaningful summary based on the custom report data
    const averageValue = (data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(2);
    const topPerformer = data.labels[data.values.indexOf(Math.max(...data.values))];

    return `
        <h3>Custom Report Summary</h3>
        <p>Metric: ${metric}</p>
        <p>Dimension: ${dimension}</p>
        <p>Timeframe: ${timeframe}</p>
        <p>Average ${metric}: ${averageValue}</p>
        <p>Top performer: ${topPerformer}</p>
        <p>This custom report provides insights based on the selected metric, dimension, and timeframe.</p>
    `;
}

function generateCustomReport() {
    const reportId = document.getElementById('customReportList').value;
    const report = customReports.find(r => r.id === parseInt(reportId));
    if (!report) return;

    const customReportContainer = document.getElementById('customReportContainer');
    const customReportSummary = document.getElementById('customReportSummary');
    const ctx = document.getElementById('customReportChart').getContext('2d');

    // Destroy previous chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Fetch data based on selected metric, dimension, and timeframe
    const data = fetchCustomReportData(report.metric, report.dimension, report.timeframe);

    // Generate the custom report chart
    currentChart = new Chart(ctx, {
        type: 'bar', // or any other appropriate chart type
        data: {
            labels: data.labels,
            datasets: [{
                label: report.metric,
                data: data.values,
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: report.title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Generate the custom report summary
    customReportSummary.innerHTML = generateCustomReportSummary(report.metric, report.dimension, report.timeframe, data);
}

function createReport(event) {
    event.preventDefault();
    const title = document.getElementById('reportTitle').value;
    const type = document.getElementById('reportType').value;
    const metric = type === 'custom' ? document.getElementById('customReportMetric').value : null;
    const dimension = type === 'custom' ? document.getElementById('customReportDimension').value : null;
    const timeframe = type === 'custom' ? document.getElementById('customReportTimeframe').value : null;

    const newReport = { id: customReports.length + 1, title, type, metric, dimension, timeframe };
    customReports.push(newReport);
    populateCustomReportList();
    closeModal('createReportModal');
    showNotification(`Report "${title}" created successfully!`, "success");
    event.target.reset();
}

function populateCustomReportList() {
    const customReportList = document.getElementById('customReportList');
    customReportList.innerHTML = '';

    customReports.forEach(report => {
        const option = document.createElement('option');
        option.value = report.id;
        option.textContent = report.title;
        customReportList.appendChild(option);
    });
}

function generateAdvancedAnalytics() {
    const analyticsType = document.getElementById('advancedAnalyticsType').value;
    const advancedAnalyticsContainer = document.getElementById('advancedAnalyticsContainer');
    const advancedAnalyticsSummary = document.getElementById('advancedAnalyticsSummary');
    const ctx = document.getElementById('advancedAnalyticsChart').getContext('2d');

    // Destroy previous chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Generate new chart based on analytics type
    switch (analyticsType) {
        case 'predictiveAnalysis':
            currentChart = generatePredictiveAnalysisChart(ctx);
            advancedAnalyticsSummary.innerHTML = generatePredictiveAnalysisSummary();
            break;
        case 'correlationAnalysis':
            currentChart = generateCorrelationAnalysisChart(ctx);
            advancedAnalyticsSummary.innerHTML = generateCorrelationAnalysisSummary();
            break;
        case 'trendAnalysis':
            currentChart = generateTrendAnalysisChart(ctx);
            advancedAnalyticsSummary.innerHTML = generateTrendAnalysisSummary();
            break;
    }
}

function generatePredictiveAnalysisChart(ctx) {
    // Sample data for predictive analysis
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Actual Skill Growth',
            data: [10, 12, 15, 18, 20, 23, 25, 28, 30, 32, 35, 38],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            type: 'line',
            fill: true
        }, {
            label: 'Predicted Skill Growth',
            data: [null, null, null, null, null, null, null, null, null, null, null, 38, 40, 43, 45, 48, 50],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            type: 'line',
            fill: true
        }]
    };

    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Predictive Skill Growth Analysis'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Skill Level'
                    },
                    suggestedMin: 0,
                    suggestedMax: 60
                }
            }
        }
    });
}

function generateCorrelationAnalysisChart(ctx) {
    // Sample data for correlation analysis
    const data = {
        datasets: [{
            label: 'Correlation between Course Completion and Performance Improvement',
            data: [
                { x: 2, y: 10 },
                { x: 5, y: 15 },
                { x: 8, y: 25 },
                { x: 12, y: 30 },
                { x: 15, y: 35 },
                { x: 18, y: 40 },
                { x: 22, y: 45 }
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }]
    };

    return new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Course Completion vs Performance Improvement'
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Courses Completed'
                    },
                    suggestedMin: 0,
                    suggestedMax: 25
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Performance Improvement (%)'
                    },
                    suggestedMin: 0,
                    suggestedMax: 50
                }
            }
        }
    });
}

function generateTrendAnalysisChart(ctx) {
    // Sample data for trend analysis
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Employee Engagement',
            data: [65, 70, 68, 72, 75, 80, 82, 85, 88, 90, 92, 95],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true
        }, {
            label: 'Course Completion Rate',
            data: [50, 55, 60, 62, 65, 70, 72, 75, 78, 80, 82, 85],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true
        }]
    };

    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Employee Engagement and Course Completion Trends'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Percentage'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function generatePredictiveAnalysisSummary() {
    return `
        <h3>Predictive Skill Growth Analysis Summary</h3>
        <p>Based on the current skill growth trend, we predict:</p>
        <ul>
            <li>An average skill level increase of 12 points over the next 5 months</li>
            <li>A potential 31% improvement in overall employee performance</li>
            <li>Recommended focus areas: Python programming and data analysis skills</li>
        </ul>
        <p>This predictive analysis helps in planning future training programs and resource allocation.</p>
    `;
}

function generateCorrelationAnalysisSummary() {
    return `
        <h3>Correlation Analysis Summary</h3>
        <p>Key findings from the correlation between course completion and performance improvement:</p>
        <ul>
            <li>Strong positive correlation (r = 0.92) between courses completed and performance improvement</li>
            <li>On average, each completed course corresponds to a 2.5% performance improvement</li>
            <li>Employees who completed 15+ courses showed the highest performance gains (35%+)</li>
        </ul>
        <p>This analysis supports the effectiveness of our training programs in improving employee performance.</p>
    `;
}

function generateTrendAnalysisSummary() {
    return `
        <h3>Trend Analysis Summary</h3>
        <p>Key trends observed in employee engagement and course completion rates:</p>
        <ul>
            <li>Steady increase in both employee engagement and course completion rates throughout the year</li>
            <li>Employee engagement rose from 65% to 95% (46% increase)</li>
            <li>Course completion rate improved from 50% to 85% (70% increase)</li>
            <li>Strongest growth observed in Q3, possibly due to new learning initiatives launched</li>
        </ul>
        <p>This trend analysis shows a positive correlation between employee engagement and course completion rates, suggesting that engaged employees are more likely to complete training courses.</p>
    `;
}

window.onload = function() {
    generateReport();
    document.getElementById('createReportForm').addEventListener('submit', createReport);
    document.getElementById('reportType').addEventListener('change', () => {
        const customReportOptions = document.getElementById('customReportOptions');
        customReportOptions.style.display = document.getElementById('reportType').value === 'custom' ? 'block' : 'none';
    });
};