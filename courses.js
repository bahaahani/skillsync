// Sample course data
let courses = [
    { 
        id: 1, 
        title: "Advanced JavaScript", 
        category: "Programming", 
        duration: "4 weeks", 
        enrolled: 25, 
        requiredSkills: ["JavaScript", "HTML", "CSS"],
        learningPath: [
            "JavaScript ES6+ Features",
            "Asynchronous Programming",
            "JavaScript Design Patterns",
            "Advanced DOM Manipulation"
        ],
        assessments: [
            { id: 1, title: "JavaScript Basics", avgScore: 85, questions: [
                { question: "What is a closure in JavaScript?", options: ["A function with no parameters", "A function that returns another function", "A function that closes the program", "A function with multiple return statements"], correctAnswer: 1 },
                { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "def"], correctAnswer: 2 }
            ], userScore: null, userAnswers: [] },
            { id: 3, title: "React Components", avgScore: 92, questions: [
                { question: "What is JSX in React?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A database for React", "A styling framework"], correctAnswer: 1 },
                { question: "Which lifecycle method is called after a component is rendered for the first time?", options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "render"], correctAnswer: 0 }
            ], userScore: null, userAnswers: [] }
        ],
        progress: 0
    },
    { 
        id: 2, 
        title: "Leadership Essentials", 
        category: "Management", 
        duration: "2 weeks", 
        enrolled: 15, 
        requiredSkills: ["Communication", "Team Management"],
        learningPath: [
            "Leadership Styles",
            "Effective Communication",
            "Team Building",
            "Conflict Resolution"
        ],
        assessments: [
            { id: 4, title: "Leadership Assessment", avgScore: 78, questions: [
                { question: "What is the primary role of a leader?", options: ["Micromanage their team", "Make all the decisions", "Empower and motivate their team", "Maintain strict control"], correctAnswer: 2 },
                { question: "Which of the following is not a key leadership skill?", options: ["Communication", "Delegation", "Technical expertise", "Emotional intelligence"], correctAnswer: 3 }
            ], userScore: null, userAnswers: [] }
        ],
        progress: 0
    },
    { 
        id: 3, 
        title: "Digital Marketing Fundamentals", 
        category: "Marketing", 
        duration: "3 weeks", 
        enrolled: 30, 
        requiredSkills: ["Marketing", "Social Media"],
        learningPath: [
            "Introduction to Digital Marketing",
            "Search Engine Optimization",
            "Social Media Marketing",
            "Email Marketing"
        ],
        assessments: [],
        progress: 0
    },
    { 
        id: 4, 
        title: "Financial Planning and Analysis", 
        category: "Finance", 
        duration: "5 weeks", 
        enrolled: 20, 
        requiredSkills: ["Financial Analysis", "Excel"],
        learningPath: [
            "Financial Statement Analysis",
            "Budgeting and Forecasting",
            "Financial Modeling",
            "Risk Analysis"
        ],
        assessments: [
            { id: 2, title: "Python Data Structures", avgScore: 85, questions: [
                { question: "What is a list comprehension in Python?", options: ["A way to create lists using a for loop", "A built-in function to compress lists", "A method to sort lists", "A type of data structure"], correctAnswer: 0 },
                { question: "Which of the following is not a valid data type in Python?", options: ["int", "float", "complex", "char"], correctAnswer: 3 }
            ], userScore: null, userAnswers: [] }
        ],
        progress: 0
    },
    { 
        id: 5, 
        title: "Machine Learning Basics", 
        category: "Data Science", 
        duration: "6 weeks", 
        enrolled: 18, 
        requiredSkills: ["Python", "Statistics", "Linear Algebra"],
        learningPath: [
            "Introduction to Machine Learning",
            "Supervised Learning",
            "Unsupervised Learning",
            "Model Evaluation and Validation"
        ],
        assessments: [
            { id: 5, title: "Machine Learning Fundamentals", avgScore: 90, questions: [
                { question: "What is the purpose of a neural network in machine learning?", options: ["To provide a visual representation of data", "To optimize hyperparameters", "To extract features from data", "To learn patterns and make predictions"], correctAnswer: 3 },
                { question: "Which of the following is not a common machine learning algorithm?", options: ["Linear Regression", "Decision Trees", "Support Vector Machines", "Bubble Sort"], correctAnswer: 3 }
            ], userScore: null, userAnswers: [] }
        ],
        progress: 0
    }
];

let enrolledCourses = [];

// Sample user data (replace this with actual user data from your authentication system)
const currentUser = {
    id: 1,
    name: "John Doe",
    jobRole: "Software Engineer",
    skills: ["JavaScript", "Python", "React"]
};

// Function to create a course card
function createCourseCard(course, isEnrolled = false) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3>${course.title}</h3>
        <p><strong>Category:</strong> ${course.category}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Enrolled:</strong> ${course.enrolled} employees</p>
        ${isEnrolled ? `<p><strong>Progress:</strong> ${course.progress}%</p>` : ''}
        <button onclick="viewCourse(${course.id})" class="btn">View Details</button>
        ${isEnrolled ? 
            `<button onclick="updateProgress(${course.id})" class="btn">Update Progress</button>` : 
            `<button onclick="enrollInCourse(${course.id})" class="btn">Enroll</button>`
        }
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
        const card = createCourseCard(course, true);
        enrolledCourseGrid.appendChild(card);
    });
}

// Function to populate the recommended course grid
function populateRecommendedCourseGrid() {
    const recommendedCourseGrid = document.getElementById("recommendedCourseGrid");
    recommendedCourseGrid.innerHTML = '';
    
    const recommendedCourses = getRecommendedCourses();
    recommendedCourses.forEach(course => {
        const card = createCourseCard(course);
        recommendedCourseGrid.appendChild(card);
    });
}

// Function to add a new course
function addCourse(event) {
    event.preventDefault();
    const title = document.getElementById('newCourseTitle').value;
    const category = document.getElementById('newCourseCategory').value;
    const duration = document.getElementById('newCourseDuration').value;
    const enrolled = parseInt(document.getElementById('newCourseEnrolled').value);
    const requiredSkills = document.getElementById('newCourseSkills').value.split(',').map(skill => skill.trim());

    const newCourse = { 
        id: courses.length + 1, 
        title, 
        category, 
        duration, 
        enrolled, 
        requiredSkills,
        learningPath: [],
        assessments: [],
        progress: 0
    };
    courses.push(newCourse);
    populateCourseGrid();
    updateCourseOptions();
    closeModal('addCourseModal');
    showNotification(`Course "${title}" added successfully!`, "success");
    event.target.reset();
}

// Function to enroll in a course
function enrollInCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    if (enrolledCourses.some(c => c.id === id)) {
        showNotification(`You are already enrolled in "${course.title}"`, "info");
        return;
    }
    
    enrolledCourses.push({...course, progress: 0});
    populateEnrolledCourseGrid();
    updateCourseOptions();
    showNotification(`You have enrolled in the "${course.title}" course.`, "success");
}

// Function to view assessment details
function viewAssessment(courseId, assessmentId) {
    const course = courses.find(c => c.id === courseId);
    const assessment = course.assessments.find(a => a.id === assessmentId);
    if (!course || !assessment) return;

    const modal = document.getElementById('assessmentModal');
    const titleElement = document.getElementById('assessmentTitle');
    const questionContainer = document.getElementById('assessmentQuestions');
    const scoreElement = document.getElementById('assessmentScore');

    titleElement.textContent = assessment.title;
    questionContainer.innerHTML = '';

    assessment.questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            ${q.options.map((option, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${i}" ${assessment.userAnswers[index] === i ? 'checked' : ''}>
                    ${option}
                </label>
            `).join('')}
        `;
        questionContainer.appendChild(questionElement);
    });

    scoreElement.textContent = assessment.userScore !== null ? `Your score: ${assessment.userScore}` : 'Assessment not taken yet';

    modal.style.display = 'block';
}

// Function to search courses
function searchCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm) ||
        course.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
    populateCourseGrid(filteredCourses);
}

// Function to view course details
function viewCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    const modal = document.getElementById('courseDetailsModal');
    document.getElementById('courseDetailsTitle').textContent = course.title;
    document.getElementById('courseDetailsCategory').textContent = `Category: ${course.category}`;
    document.getElementById('courseDetailsDuration').textContent = `Duration: ${course.duration}`;
    document.getElementById('courseDetailsEnrolled').textContent = `Enrolled: ${course.enrolled} employees`;

    const skillsList = document.getElementById('courseDetailsSkills');
    skillsList.innerHTML = '';
    course.requiredSkills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });

    const learningPathList = document.getElementById('courseDetailsLearningPath');
    learningPathList.innerHTML = '';
    course.learningPath.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        learningPathList.appendChild(li);
    });

    const assessmentsContainer = document.getElementById('courseDetailsAssessments');
    assessmentsContainer.innerHTML = '';
    course.assessments.forEach(assessment => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${assessment.title}</strong>: Average Score ${assessment.avgScore}
            <button onclick="viewAssessment(${course.id}, ${assessment.id})" class="btn">Take Assessment</button>
        `;
        assessmentsContainer.appendChild(div);
    });

    modal.style.display = 'block';
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
    closeModal('enrollCourseModal');
    event.target.reset();
}

// Function to get recommended courses based on user skills and job role
function getRecommendedCourses() {
    return courses.filter(course => {
        // Check if the course requires any of the user's skills
        const hasRequiredSkill = course.requiredSkills.some(skill => currentUser.skills.includes(skill));
        
        // Check if the course category matches the user's job role
        const matchesJobRole = course.category.toLowerCase() === currentUser.jobRole.toLowerCase();
        
        return hasRequiredSkill || matchesJobRole;
    }).slice(0, 3); // Limit to top 3 recommendations
}

// Function to update course progress
function updateProgress(courseId) {
    const enrolledCourse = enrolledCourses.find(c => c.id === courseId);
    if (!enrolledCourse) return;

    // Simulate progress update (replace this with actual progress tracking logic)
    enrolledCourse.progress = Math.min(enrolledCourse.progress + 25, 100);
    
    populateEnrolledCourseGrid();
    showNotification(`Progress updated for "${enrolledCourse.title}"`, "success");
}

// Event listeners
window.onload = function() {
    populateCourseGrid();
    populateEnrolledCourseGrid();
    populateRecommendedCourseGrid();
    document.getElementById('addCourseForm').addEventListener('submit', addCourse);
    document.getElementById('enrollCourseForm').addEventListener('submit', enrollCourse);
};