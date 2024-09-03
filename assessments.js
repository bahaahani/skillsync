// Sample data for assessments
let assessments = [
    { id: 1, title: "JavaScript Basics", skill: "JavaScript", questions: 10, dueDate: "2023-06-30", status: "Open" },
    { id: 2, title: "Python Data Structures", skill: "Python", questions: 15, dueDate: "2023-07-15", status: "Open" },
    { id: 3, title: "React Components", skill: "React", questions: 12, dueDate: "2023-07-05", status: "Open" }
];

// Sample questions for assessments
const sampleQuestions = {
    JavaScript: [
        { question: "What is a closure in JavaScript?", options: ["A function with no parameters", "A function that returns another function", "A function that closes the program", "A function with multiple return statements"], correctAnswer: 1 },
        { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "def"], correctAnswer: 2 },
        // Add more JavaScript questions here
    ],
    Python: [
        { question: "What is a list comprehension in Python?", options: ["A way to create lists using a for loop", "A built-in function to compress lists", "A method to sort lists", "A type of data structure"], correctAnswer: 0 },
        { question: "Which of the following is not a valid data type in Python?", options: ["int", "float", "complex", "char"], correctAnswer: 3 },
        // Add more Python questions here
    ],
    React: [
        { question: "What is JSX in React?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A database for React", "A styling framework"], correctAnswer: 1 },
        { question: "Which lifecycle method is called after a component is rendered for the first time?", options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "render"], correctAnswer: 0 },
        // Add more React questions here
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
    // Here you would typically calculate the score and save the results
    // For this demo, we'll just show a success message
    closeAllModals();
    showNotification("Assessment submitted successfully!", "success");
}

// Event listeners
window.onload = function() {
    populateAssessmentList();
    document.getElementById('createAssessmentForm').addEventListener('submit', createAssessment);

    // Populate skill options
    const skillSelect = document.getElementById('assessmentSkill');
    Object.keys(sampleQuestions).forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        skillSelect.appendChild(option);
    });
};