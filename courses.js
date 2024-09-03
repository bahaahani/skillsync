// Sample course data
let courses = [
    { id: 1, title: "Advanced JavaScript", category: "Programming", duration: "4 weeks", enrolled: 25, assessments: [
        { id: 1, title: "JavaScript Basics", avgScore: 85 },
        { id: 3, title: "React Components", avgScore: 92 }
    ] },
    { id: 2, title: "Leadership Essentials", category: "Management", duration: "2 weeks", enrolled: 15, assessments: [
        { id: 4, title: "Leadership Assessment", avgScore: 78 }
    ] },
    { id: 3, title: "Digital Marketing Fundamentals", category: "Marketing", duration: "3 weeks", enrolled: 30, assessments: [] },
    { id: 4, title: "Financial Planning and Analysis", category: "Finance", duration: "5 weeks", enrolled: 20, assessments: [
        { id: 2, title: "Python Data Structures", avgScore: 85 }
    ] },
    { id: 5, title: "Machine Learning Basics", category: "Data Science", duration: "6 weeks", enrolled: 18, assessments: [
        { id: 5, title: "Machine Learning Fundamentals", avgScore: 90 }
    ] }
];

let enrolledCourses = [];

// Function to create a course card
function createCourseCard(course) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3>${course.title}</h3>
        <p><strong>Category:</strong> ${course.category}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Enrolled:</strong> ${course.enrolled} employees</p>
        ${course.assessments.map(assessment => `
            <div>
                <strong>${assessment.title}</strong>: ${assessment.avgScore}
            </div>
        `).join('')}
        <button onclick="viewCourse(${course.id})" class="btn">View Details</button>
        <button onclick="enrollInCourse(${course.id})" class="btn">Enroll</button>
    `;
    return card;
}

// Function to populate the course grid
function populateCourseGrid(coursesToShow = courses) {
    const courseGrid = document.getElementById("courseGrid");
    courseGrid.innerHTML = '';
    
    coursesToShow.forEach(course => {
        const card = createCourseCard(course);
        courseGrid.appendChild(card);
    });
}

// Function to populate the enrolled course grid
function populateEnrolledCourseGrid() {
    const enrolledCourseGrid = document.getElementById("enrolledCourseGrid");
    enrolledCourseGrid.innerHTML = '';
    
    enrolledCourses.forEach(course => {
        const card = createCourseCard(course);
        enrolledCourseGrid.appendChild(card);
    });
}

// Function to add a new course
function addCourse(event) {
    event.preventDefault();
    const title = document.getElementById('newCourseTitle').value;
    const category = document.getElementById('newCourseCategory').value;
    const duration = document.getElementById('newCourseDuration').value;
    const enrolled = parseInt(document.getElementById('newCourseEnrolled').value);

    const newCourse = { id: courses.length + 1, title, category, duration, enrolled, assessments: [] };
    courses.push(newCourse);
    populateCourseGrid();
    updateCourseOptions();
    closeAllModals();
    showNotification(`Course "${title}" added successfully!`, "success");
    event.target.reset();
}

// Function to enroll in a course
function enrollInCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    enrolledCourses.push(course);
    populateEnrolledCourseGrid();
    updateCourseOptions();
    showNotification(`You have enrolled in the "${course.title}" course.`, "success");
}

// Function to search courses
function searchCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
    );
    populateCourseGrid(filteredCourses);
}

// Function to view course details (placeholder)
function viewCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    showNotification(`Viewing details for ${course.title}`, "info");
}

// Function to update course options for enrollment
function updateCourseOptions() {
    const courseSelect = document.getElementById('courseToEnroll');
    courseSelect.innerHTML = '<option value="">Select Course</option>';

    courses.filter(c => !enrolledCourses.some(ec => ec.id === c.id)).forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.title;
        courseSelect.appendChild(option);
    });
}

// Function to handle course enrollment
function enrollCourse(event) {
    event.preventDefault();
    const courseId = document.getElementById('courseToEnroll').value;
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) return;
    
    enrollInCourse(course.id);
    closeAllModals();
    event.target.reset();
}

// Event listeners
window.onload = function() {
    populateCourseGrid();
    populateEnrolledCourseGrid();
    document.getElementById('addCourseForm').addEventListener('submit', addCourse);
    document.getElementById('enrollCourseForm').addEventListener('submit', enrollCourse);
};