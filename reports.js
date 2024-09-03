// Sample data for reports
const skillDistributionData = {
    labels: ['Programming', 'Leadership', 'Marketing', 'Finance', 'Data Science'],
    datasets: [{
        data: [30, 15, 20, 18, 17],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
};

const completionTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Courses Completed',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#36A2EB',
        tension: 0.1
    }]
};

const topSkills = ['JavaScript', 'Leadership', 'Digital Marketing', 'Financial Analysis', 'Machine Learning'];

const departmentPerformanceData = {
    labels: ['IT', 'HR', 'Marketing', 'Finance', 'Sales'],
    datasets: [{
        label: 'Average Skill Score',
        data: [85, 75, 80, 90, 70],
        backgroundColor: '#36A2EB'
    }]
};

// Function to create charts and populate data
function createReports() {
    // Skill Distribution Chart
    const skillDistributionCtx = document.getElementById('skillDistribution').getContext('2d');
    new Chart(skillDistributionCtx, {
        type: 'pie',
        data: skillDistributionData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Course Completion Trends Chart
    const completionTrendsCtx = document.getElementById('completionTrends').getContext('2d');
    new Chart(completionTrendsCtx, {
        type: 'line',
        data: completionTrendsData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Top Skills List
    const topSkillsList = document.getElementById('topSkills');
    topSkills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        topSkillsList.appendChild(li);
    });

    // Department Performance Chart
    const departmentPerformanceCtx = document.getElementById('departmentPerformance').getContext('2d');
    new Chart(departmentPerformanceCtx, {
        type: 'bar',
        data: departmentPerformanceData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function to create reports when the page loads
window.onload = createReports;