// Sample data for assessments
let assessments = [
    { id: 1, title: "JavaScript Basics", skill: "JavaScript", questions: 10, dueDate: "2023-06-30", status: "Open" },
    { id: 2, title: "Python Data Structures", skill: "Python", questions: 15, dueDate: "2023-07-15", status: "Open" },
    { id: 3, title: "React Components", skill: "React", questions: 12, dueDate: "2023-07-05", status: "Open" }
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
        { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "def"], correctAnswer: 2 }
    ],
    Python: [
        { question: "What is a list comprehension in Python?", options: ["A way to create lists using a for loop", "A built-in function to compress lists", "A method to sort lists", "A type of data structure"], correctAnswer: 0 },
        { question: "Which of the following is not a valid data type in Python?", options: ["int", "float", "complex", "char"], correctAnswer: 3 }
    ],
    React: [
        { question: "What is JSX in React?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A database for React", "A styling framework"], correctAnswer: 1 },
        { question: "Which lifecycle method is called after a component is rendered for the first time?", options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "render"], correctAnswer: 0 }
    ]
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
            <button onclick="startAssessment(${assessment.id})" class="btn">Take Assessment</button>
        `;
        assessmentList.appendChild(card);
    });
}

// Function to create a new assessment
function createAssessment(event) {
    event.preventDefault();
    const title = document.getElementById('assessmentTitle').value;
    const skill = document.getElementById('assessmentSkill').value;
    const questions = parseInt(document.getElementById('assessmentQuestions').value);
    const dueDate = document.getElementById('assessmentDueDate').value;

    const newAssessment = {
        id: assessments.length + 1,
        title,
        skill,
        questions,
        dueDate,
        status: "Open"
    };

    assessments.push(newAssessment);
    populateAssessmentList();
    closeAllModals();
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
    const modal = document.getElementById('takeAssessmentModal');
    const activeAssessmentTitle = document.getElementById('activeAssessmentTitle').textContent;
    const assessment = assessments.find(a => a.title === activeAssessmentTitle);

    // Calculate the score and update the assessment data
    const correctAnswers = assessment.questions.map(q => q.correctAnswer);
    const numCorrect = userAnswers.reduce((correct, userAnswer, index) => {
        return userAnswer === correctAnswers[index] ? correct + 1 : correct;
    }, 0);
    const score = Math.round((numCorrect / assessment.questions.length) * 100);

    // Check if the user has earned a certification
    const certification = certifications.find(c => c.requirements.includes(`Pass the '${assessment.title}' assessment with a score of ${assessment.passingGrade}% or higher.`));
    if (certification && score >= assessment.passingGrade) {
        showNotification(`Congratulations! You have earned the "${certification.title}" certification.`, "success");
    }

    closeAllModals();
    hideAlert();
    showNotification("Assessment submitted successfully!", "success");
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
    requirementsElement.textContent = certification.requirements;

    modal.style.display = 'block';
}

// Function to apply for a certification
function applyCertification() {
    // TODO: Implement logic to apply for a certification
    showNotification("Your certification application has been submitted.", "success");
    closeAllModals();
}

// Event listeners
window.onload = function() {
    populateAssessmentList();
    populateCertificationGrid();
    document.getElementById('createAssessmentForm').addEventListener('submit', createAssessment);
};