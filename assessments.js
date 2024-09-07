// Sample data for assessments
let assessments = [
    { id: 1, title: "JavaScript Basics", skill: "JavaScript", questions: 10, dueDate: "2023-06-30", status: "Open", passingGrade: 70 },
    { id: 2, title: "Python Data Structures", skill: "Python", questions: 15, dueDate: "2023-07-15", status: "Open", passingGrade: 75 },
    { id: 3, title: "React Components", skill: "React", questions: 12, dueDate: "2023-07-05", status: "Open", passingGrade: 80 }
];

// Sample data for certifications
let certifications = [
    { id: 1, title: "JavaScript Fundamentals", description: "Demonstrates a solid understanding of JavaScript syntax, data types, and control flow.", requirements: "Pass the 'JavaScript Basics' assessment with a score of 80% or higher." },
    { id: 2, title: "Python Proficiency", description: "Certifies expertise in Python programming, data structures, and problem-solving.", requirements: "Pass the 'Python Data Structures' assessment with a score of 85% or higher." },
    { id: 3, title: "React Specialist", description: "Recognizes advanced knowledge of React components, state management, and lifecycle methods.", requirements: "Pass the 'React Components' assessment with a score of 90% or higher." }
];

// Sample questions for assessments
const sampleQuestions = {
    JavaScript: [
        { question: "What is a closure in JavaScript?", options: ["A function with no parameters", "A function that returns another function", "A function that closes the program", "A function with multiple return statements"], correctAnswer: 1 },
        { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "def"], correctAnswer: 2 },
        { question: "What does the 'typeof' operator return for an array?", options: ["array", "object", "list", "collection"], correctAnswer: 1 },
        { question: "What is the purpose of the 'use strict' directive in JavaScript?", options: ["To enable strict mode", "To import external libraries", "To declare global variables", "To optimize code performance"], correctAnswer: 0 },
        { question: "Which method is used to add an element to the end of an array?", options: ["push()", "append()", "addToEnd()", "insert()"], correctAnswer: 0 }
    ],
    Python: [
        { question: "What is a list comprehension in Python?", options: ["A way to create lists using a for loop", "A built-in function to compress lists", "A method to sort lists", "A type of data structure"], correctAnswer: 0 },
        { question: "Which of the following is not a valid data type in Python?", options: ["int", "float", "complex", "char"], correctAnswer: 3 },
        { question: "What is the purpose of the 'self' parameter in Python class methods?", options: ["To refer to the current instance of the class", "To define a static method", "To import external modules", "To create a new object"], correctAnswer: 0 },
        { question: "Which of the following is used to handle exceptions in Python?", options: ["try-except", "if-else", "for-in", "while-do"], correctAnswer: 0 },
        { question: "What is the output of 'print(2**3)'?", options: ["6", "8", "9", "16"], correctAnswer: 1 }
    ],
    React: [
        { question: "What is JSX in React?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A database for React", "A styling framework"], correctAnswer: 1 },
        { question: "Which lifecycle method is called after a component is rendered for the first time?", options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "render"], correctAnswer: 0 },
        { question: "What is the purpose of state in React?", options: ["To store component data that may change over time", "To define the structure of the component", "To handle HTTP requests", "To optimize rendering performance"], correctAnswer: 0 },
        { question: "Which hook is used to perform side effects in a function component?", options: ["useEffect", "useState", "useContext", "useReducer"], correctAnswer: 0 },
        { question: "What is the correct way to render a list of items in React?", options: ["Using a for loop", "Using the map() function", "Using a while loop", "Using the forEach() method"], correctAnswer: 1 }
    ]
};

// Sample user data (replace this with actual user data from your authentication system)
const currentUser = {
    id: 1,
    name: "John Doe",
    jobRole: "Software Engineer",
    skills: ["JavaScript", "Python", "React"],
    completedAssessments: []
};

// Function to populate the assessment list
function populateAssessmentList() {
    const assessmentList = document.getElementById('assessmentList');
    assessmentList.innerHTML = '';
    
    assessments.forEach(assessment => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${assessment.title}</h3>
            <p><strong>Skill:</strong> ${assessment.skill}</p>
            <p><strong>Questions:</strong> ${assessment.questions}</p>
            <p><strong>Due Date:</strong> ${assessment.dueDate}</p>
            <p><strong>Status:</strong> ${assessment.status}</p>
            <p><strong>Passing Grade:</strong> ${assessment.passingGrade}%</p>
            <button onclick="startAssessment(${assessment.id})" class="btn">Take Assessment</button>
        `;
        assessmentList.appendChild(card);
    });
}

// Function to populate personalized assessment recommendations
function populatePersonalizedAssessments() {
    const personalizedList = document.getElementById('personalizedAssessmentList');
    personalizedList.innerHTML = '';

    const recommendedAssessments = getRecommendedAssessments();
    recommendedAssessments.forEach(assessment => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${assessment.title}</h3>
            <p><strong>Skill:</strong> ${assessment.skill}</p>
            <p><strong>Questions:</strong> ${assessment.questions}</p>
            <p><strong>Due Date:</strong> ${assessment.dueDate}</p>
            <p><strong>Status:</strong> ${assessment.status}</p>
            <p><strong>Passing Grade:</strong> ${assessment.passingGrade}%</p>
            <button onclick="startAssessment(${assessment.id})" class="btn">Take Assessment</button>
        `;
        personalizedList.appendChild(card);
    });
}

// Function to get recommended assessments based on user skills and job role
function getRecommendedAssessments() {
    return assessments.filter(assessment => {
        return currentUser.skills.includes(assessment.skill) &&
               !currentUser.completedAssessments.some(ca => ca.id === assessment.id);
    }).slice(0, 3); // Limit to top 3 recommendations
}

// Function to populate assessment history
function populateAssessmentHistory() {
    const historyList = document.getElementById('assessmentHistoryList');
    historyList.innerHTML = '';

    currentUser.completedAssessments.forEach(assessment => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <h3>${assessment.title}</h3>
            <p><strong>Skill:</strong> ${assessment.skill}</p>
            <p><strong>Score:</strong> ${assessment.score}%</p>
            <p><strong>Date Completed:</strong> ${assessment.dateCompleted}</p>
        `;
        historyList.appendChild(historyItem);
    });
}

// Function to create a new assessment
function createAssessment(event) {
    event.preventDefault();
    const title = document.getElementById('assessmentTitle').value;
    const skill = document.getElementById('assessmentSkill').value;
    const questions = parseInt(document.getElementById('assessmentQuestions').value);
    const dueDate = document.getElementById('assessmentDueDate').value;
    const passingGrade = parseInt(document.getElementById('assessmentPassingGrade').value);

    const newAssessment = {
        id: assessments.length + 1,
        title,
        skill,
        questions,
        dueDate,
        status: "Open",
        passingGrade
    };

    assessments.push(newAssessment);
    populateAssessmentList();
    populatePersonalizedAssessments();
    closeModal('createAssessmentModal');
    showNotification(`Assessment "${title}" created successfully!`, "success");
    event.target.reset();
}

// Function to start an assessment
function startAssessment(id) {
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) return;

    const modal = document.getElementById('takeAssessmentModal');
    const titleElement = document.getElementById('activeAssessmentTitle');
    const questionContainer = document.getElementById('questionContainer');

    titleElement.textContent = assessment.title;
    questionContainer.innerHTML = '';

    // Get random questions for the assessment
    const questions = getRandomQuestions(assessment.skill, assessment.questions);

    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            ${q.options.map((option, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${i}">
                    ${option}
                </label>
            `).join('')}
        `;
        questionContainer.appendChild(questionElement);
    });

    modal.style.display = 'block';
}

// Function to get random questions for an assessment
function getRandomQuestions(skill, count) {
    const allQuestions = sampleQuestions[skill];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to submit an assessment
function submitAssessment() {
    // Get the user's answers
    const userAnswers = [];
    const questions = document.querySelectorAll('#questionContainer .question');
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector(`input[name="question${index}"]:checked`);
        userAnswers.push(selectedOption ? parseInt(selectedOption.value) : null);
    });

    // Find the current assessment being taken
    const activeAssessmentTitle = document.getElementById('activeAssessmentTitle').textContent;
    const assessment = assessments.find(a => a.title === activeAssessmentTitle);

    // Calculate the score
    const correctAnswers = getRandomQuestions(assessment.skill, assessment.questions).map(q => q.correctAnswer);
    const numCorrect = userAnswers.reduce((correct, userAnswer, index) => {
        return userAnswer === correctAnswers[index] ? correct + 1 : correct;
    }, 0);
    const score = Math.round((numCorrect / assessment.questions.length) * 100);

    // Update user's completed assessments
    currentUser.completedAssessments.push({
        id: assessment.id,
        title: assessment.title,
        skill: assessment.skill,
        score: score,
        dateCompleted: new Date().toISOString().split('T')[0]
    });

    // Update user's skill profile
    updateSkillProfile(assessment.skill, score);

    // Check if the user has earned a certification
    const certification = certifications.find(c => c.requirements.includes(`Pass the '${assessment.title}' assessment with a score of ${assessment.passingGrade}% or higher.`));
    if (certification && score >= assessment.passingGrade) {
        showNotification(`Congratulations! You have earned the "${certification.title}" certification.`, "success");
    }

    // Show assessment result
    showAssessmentResult(score, assessment);

    closeModal('takeAssessmentModal');
    populateAssessmentHistory();
    populatePersonalizedAssessments();
}

// Function to show assessment result
function showAssessmentResult(score, assessment) {
    const resultModal = document.getElementById('assessmentResultModal');
    const scoreElement = document.getElementById('assessmentResultScore');
    const feedbackElement = document.getElementById('assessmentResultFeedback');

    scoreElement.textContent = `Your score: ${score}%`;

    let feedback = '';
    if (score >= assessment.passingGrade) {
        feedback = `Congratulations! You have passed the ${assessment.title} assessment.`;
    } else {
        feedback = `You did not pass the ${assessment.title} assessment. Keep practicing and try again!`;
    }
    
    feedbackElement.textContent = feedback;
    resultModal.style.display = 'block';
}

// Function to update user's skill profile
function updateSkillProfile(skill, score) {
    // This is a placeholder function. In a real application, you would update the user's skill profile in your database.
    console.log(`Updating skill profile for ${skill} with score ${score}`);
}

// Function to populate the certification grid
function populateCertificationGrid() {
    const certificationGrid = document.getElementById('certificationGrid');
    certificationGrid.innerHTML = '';

    certifications.forEach(certification => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${certification.title}</h3>
            <p>${certification.description}</p>
            <p><strong>Requirements:</strong> ${certification.requirements}</p>
            <button onclick="viewCertification(${certification.id})" class="btn">View Details</button>
        `;
        certificationGrid.appendChild(card);
    });
}

// Function to view certification details
function viewCertification(id) {
    const certification = certifications.find(c => c.id === id);
    if (!certification) return;

    const modal = document.getElementById('certificationModal');
    const titleElement = document.getElementById('certificationTitle');
    const descriptionElement = document.getElementById('certificationDescription');
    const requirementsElement = document.getElementById('certificationRequirements');

    titleElement.textContent = certification.title;
    descriptionElement.textContent = certification.description;
    requirementsElement.textContent = `Requirements: ${certification.requirements}`;

    modal.style.display = 'block';
}

// Function to apply for a certification
function applyCertification() {
    // This is a placeholder function. In a real application, you would implement the logic to apply for a certification.
    showNotification("Your certification application has been submitted.", "success");
    closeModal('certificationModal');
}

// Event listeners
window.onload = function() {
    populateAssessmentList();
    populatePersonalizedAssessments();
    populateAssessmentHistory();
    populateCertificationGrid();
    document.getElementById('createAssessmentForm').addEventListener('submit', createAssessment);
};