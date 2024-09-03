// Sample data for dashboard
const dashboardData = {
    skillMap: {
        labels: ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP'],
        datasets: [{
            label: 'Skill Proficiency',
            data: [80, 65, 70, 55, 40, 50],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    },
    courseStatus: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384']
        }]
    },
    topPerformers: [
        { name: 'John Doe', score: 95 },
        { name: 'Jane Smith', score: 92 },
        { name: 'Mike Johnson', score: 88 },
        { name: 'Emily Brown', score: 85 },
        { name: 'Chris Lee', score: 83 }
    ],
    recentActivities: [
        { action: 'completed', user: 'Sarah', item: '"Advanced JavaScript" course' },
        { action: 'started', user: 'Team A', item: '"Project Management Basics" course' },
        { action: 'added', user: 'Admin', item: 'new course "Data Science Fundamentals"' },
        { action: 'achieved', user: 'Alex', item: '"Expert" level in Python' },
        { action: 'scheduled', user: 'HR', item: 'Quarter 2 Skill Assessment' }
    ],
    quickStats: {
        totalEmployees: 150,
        activeCourses: 25,
        skillsAcquired: 720,
        avgCompletionRate: 78
    }
};

// Function to create charts and populate data
function createDashboard() {
    // Skill Map Chart
    const skillMapCtx = document.getElementById('skillMap').getContext('2d');
    new Chart(skillMapCtx, {
        type: 'radar',
        data: dashboardData.skillMap,
        options: {
            elements: {
                line: {
                    borderWidth: 3
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

    // Course Status Chart
    const courseStatusCtx = document.getElementById('courseStatus').getContext('2d');
    new Chart(courseStatusCtx, {
        type: 'doughnut',
        data: dashboardData.courseStatus,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Populate top performers
    const topPerformers = document.getElementById('topPerformers');
    dashboardData.topPerformers.forEach(performer => {
        const li = document.createElement('li');
        li.textContent = `${performer.name} - ${performer.score}`;
        topPerformers.appendChild(li);
    });

    // Populate recent activities
    const recentActivities = document.getElementById('recentActivities');
    dashboardData.recentActivities.forEach(activity => {
        const li = document.createElement('li');
        li.textContent = `${activity.user} ${activity.action} ${activity.item}`;
        recentActivities.appendChild(li);
    });

    // Populate quick stats
    document.getElementById('totalEmployees').textContent = dashboardData.quickStats.totalEmployees;
    document.getElementById('activeCourses').textContent = dashboardData.quickStats.activeCourses;
    document.getElementById('skillsAcquired').textContent = dashboardData.quickStats.skillsAcquired;
    document.getElementById('avgCompletionRate').textContent = `${dashboardData.quickStats.avgCompletionRate}%`;
}

// Event listeners
window.onload = createDashboard;