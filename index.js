// Sample data for recent course activity
const recentCourseActivity = [
    { id: 1, title: "Advanced JavaScript", category: "Programming", duration: "4 weeks", enrolled: 25 },
    { id: 2, title: "Leadership Essentials", category: "Management", duration: "2 weeks", enrolled: 15 },
    { id: 4, title: "Financial Planning and Analysis", category: "Finance", duration: "5 weeks", enrolled: 20 }
];

// Sample data for news and announcements
const newsAndAnnouncements = [
    { id: 1, title: "New Course: Data Science Fundamentals", content: "We are excited to announce the launch of our new Data Science Fundamentals course. Enroll now to upskill your team!" },
    { id: 2, title: "Quarterly Performance Review", content: "The Q2 performance review will be held on June 15th. Please ensure your employees have completed all required assessments." },
    { id: 3, title: "Employee of the Month: John Doe", content: "Congratulations to John Doe for being named Employee of the Month! John has demonstrated exceptional dedication to his work and continuous skill development." }
];

// Function to populate the recent course activity grid
function populateRecentCourseGrid() {
    const recentCourseGrid = document.getElementById('recentCourseGrid');
    recentCourseGrid.innerHTML = '';

    recentCourseActivity.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${course.title}</h3>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Enrolled:</strong> ${course.enrolled} employees</p>
            <a href="courses.html" class="btn">View Course</a>
        `;
        recentCourseGrid.appendChild(card);
    });
}

// Function to populate the news and announcements grid
function populateAnnouncementGrid() {
    const announcementGrid = document.getElementById('announcementGrid');
    announcementGrid.innerHTML = '';

    newsAndAnnouncements.forEach(announcement => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
        `;
        announcementGrid.appendChild(card);
    });
}

// Event listeners
window.onload = function() {
    populateRecentCourseGrid();
    populateAnnouncementGrid();
};