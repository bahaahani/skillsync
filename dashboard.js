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

    // Populate assessment history
    const assessmentHistory = document.getElementById('assessmentHistory');
    assessmentHistory.innerHTML = '';

    // Fetch the user's assessment data from the employees.js file
    const user = employees.find(e => e.name === 'John Doe'); // Assuming 'John Doe' is the current user
    user.assessments.forEach(assessment => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${assessment.title}</strong>: ${assessment.score}%
        `;
        assessmentHistory.appendChild(div);
    });

    // Populate course recommendations
    const courseRecommendations = document.getElementById('courseRecommendations');
    courseRecommendations.innerHTML = '';

    // Fetch the user's data and recommend courses
    const userSkills = user.skills;
    const userJobRole = user.jobRole;
    const recommendedCourses = getCourseRecommendations(userSkills, userJobRole);

    recommendedCourses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-recommendation';
        div.innerHTML = `
            <h3>${course.title}</h3>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <button onclick="enrollInCourse(${course.id})">Enroll</button>
        `;
        courseRecommendations.appendChild(div);
    });
}

// Function to get course recommendations based on user skills and job role
function getCourseRecommendations(userSkills, userJobRole) {
    // Implement your course recommendation logic here
    // For now, we'll return a sample set of courses
    return [
        { id: 1, title: "Advanced JavaScript", category: "Programming", duration: "4 weeks" },
        { id: 2, title: "Leadership Essentials", category: "Management", duration: "2 weeks" },
        { id: 4, title: "Financial Planning and Analysis", category: "Finance", duration: "5 weeks" }
    ];
}

// Event listeners
window.onload = createDashboard;