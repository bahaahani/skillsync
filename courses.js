// Sample course data
let courses = [
    { title: "Advanced JavaScript", category: "Programming", duration: "4 weeks", enrolled: 25 },
    { title: "Leadership Essentials", category: "Management", duration: "2 weeks", enrolled: 15 },
    { title: "Digital Marketing Fundamentals", category: "Marketing", duration: "3 weeks", enrolled: 30 },
    { title: "Financial Planning and Analysis", category: "Finance", duration: "5 weeks", enrolled: 20 },
    { title: "Machine Learning Basics", category: "Data Science", duration: "6 weeks", enrolled: 18 }
];

// Function to create a course card
function createCourseCard(course) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3>${course.title}</h3>
        <p><strong>Category:</strong> ${course.category}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Enrolled:</strong> ${course.enrolled} employees</p>
        <button onclick="viewCourse('${course.title}')" class="btn">View Details</button>
        <button onclick="editCourse('${course.title}')" class="btn">Edit</button>
        <button onclick="deleteCourse('${course.title}')" class="btn">Delete</button>
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

// Function to add a new course
function addCourse(event) {
    event.preventDefault();
    const title = document.getElementById('newCourseTitle').value;
    const category = document.getElementById('newCourseCategory').value;
    const duration = document.getElementById('newCourseDuration').value;
    const enrolled = parseInt(document.getElementById('newCourseEnrolled').value);

    const newCourse = { title, category, duration, enrolled };
    courses.push(newCourse);
    populateCourseGrid();
    closeAllModals();
    showNotification(`Course "${title}" added successfully!`, "success");
    event.target.reset();
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
function viewCourse(title) {
    showNotification(`Viewing details for ${title}`, "info");
}

// Function to edit course (placeholder)
function editCourse(title) {
    showNotification(`Editing ${title}`, "info");
}

// Function to delete course
function deleteCourse(title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        courses = courses.filter(course => course.title !== title);
        populateCourseGrid();
        showNotification(`Course "${title}" deleted successfully!`, "success");
    }
}

// Event listeners
window.onload = function() {
    populateCourseGrid();
    document.getElementById('addCourseForm').addEventListener('submit', addCourse);
};