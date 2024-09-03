// Sample employee data
let employees = [
    { id: 1, name: "John Doe", department: "IT", jobRole: "Software Engineer", skills: ["JavaScript", "Python", "React"], assessments: [
        { id: 1, title: "JavaScript Basics", score: 85 },
        { id: 3, title: "React Components", score: 92 }
    ], developmentPlan: "John needs to improve his Python skills and learn more about cloud technologies." },
    { id: 2, name: "Jane Smith", department: "HR", jobRole: "HR Specialist", skills: ["Leadership", "Communication", "Conflict Resolution"], assessments: [
        { id: 2, title: "Python Data Structures", score: 78 }
    ], developmentPlan: "Jane should attend a communication skills workshop and get certified in HR management." },
    { id: 3, name: "Mike Johnson", department: "Marketing", jobRole: "Digital Marketing Specialist", skills: ["SEO", "Content Writing", "Social Media Management"], assessments: [], developmentPlan: "Mike needs to expand his knowledge of data analytics and improve his content strategy." },
    { id: 4, name: "Emily Brown", department: "Finance", jobRole: "Financial Analyst", skills: ["Financial Analysis", "Budgeting", "Excel"], assessments: [
        { id: 1, title: "JavaScript Basics", score: 90 },
        { id: 2, title: "Python Data Structures", score: 85 }
    ], developmentPlan: "Emily should take a course on advanced financial modeling and get certified in financial planning." },
    { id: 5, name: "Chris Lee", department: "IT", jobRole: "DevOps Engineer", skills: ["Java", "SQL", "Machine Learning"], assessments: [
        { id: 1, title: "JavaScript Basics", score: 80 },
        { id: 2, title: "Python Data Structures", score: 92 },
        { id: 3, title: "React Components", score: 88 }
    ], developmentPlan: "Chris should focus on improving his cloud infrastructure skills and get hands-on experience with Kubernetes." }
];

// Function to populate the employee table
function populateEmployeeTable(employeesToShow = employees) {
    const tableBody = document.querySelector("#employeeTable tbody");
    tableBody.innerHTML = '';
    
    employeesToShow.forEach(employee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="#" onclick="viewEmployeeProfile(${employee.id})">${employee.name}</a></td>
            <td>${employee.department}</td>
            <td>${employee.jobRole}</td>
            <td>${employee.skills.join(", ")}</td>
            <td>
                ${employee.assessments.map(assessment => `
                    <div>
                        <strong>${assessment.title}</strong>: ${assessment.score}
                    </div>
                `).join('')}
            </td>
            <td>${employee.developmentPlan}</td>
            <td>
                <button onclick="editEmployee(${employee.id})" class="btn">Edit</button>
                <button onclick="deleteEmployee(${employee.id})" class="btn">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add a new employee
function addEmployee(event) {
    event.preventDefault();
    const name = document.getElementById('newEmployeeName').value;
    const department = document.getElementById('newEmployeeDepartment').value;
    const jobRole = document.getElementById('newEmployeeJobRole').value;
    const skills = document.getElementById('newEmployeeSkills').value.split(',').map(skill => skill.trim());
    const developmentPlan = document.getElementById('newEmployeeDevelopmentPlan').value;

    const newEmployee = { id: employees.length + 1, name, department, jobRole, skills, assessments: [], developmentPlan };
    employees.push(newEmployee);
    populateEmployeeTable();
    closeAllModals();
    showNotification(`Employee ${name} added successfully!`, "success");
    event.target.reset();
}

// Function to view employee profile
function viewEmployeeProfile(id) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    const profileNameElement = document.getElementById('employeeProfileName');
    const profileDepartmentElement = document.getElementById('employeeProfileDepartment');
    const profileJobRoleElement = document.getElementById('employeeProfileJobRole');
    const profileSkillsElement = document.getElementById('employeeProfileSkills');
    const profileAssessmentsElement = document.getElementById('employeeProfileAssessments');
    const profileDevelopmentPlanElement = document.getElementById('employeeProfileDevelopmentPlan');

    profileNameElement.textContent = employee.name;
    profileDepartmentElement.textContent = employee.department;
    profileJobRoleElement.textContent = employee.jobRole;

    profileSkillsElement.innerHTML = '';
    employee.skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        profileSkillsElement.appendChild(li);
    });

    profileAssessmentsElement.innerHTML = '';
    employee.assessments.forEach(assessment => {
        const div = document.createElement('div');
        div.textContent = `${assessment.title}: ${assessment.score}`;
        profileAssessmentsElement.appendChild(div);
    });

    profileDevelopmentPlanElement.textContent = employee.developmentPlan;

    const modal = document.getElementById('employeeProfileModal');
    modal.style.display = 'block';
}

// Function to edit employee (placeholder)
function editEmployee(id) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;
    showNotification(`Editing ${employee.name}`, "info");
    // TODO: Implement employee editing functionality
}

// Function to delete employee
function deleteEmployee(id) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
        employees = employees.filter(e => e.id !== id);
        populateEmployeeTable();
        showNotification(`Employee ${employee.name} deleted successfully!`, "success");
    }
}

// Function to search employees
function searchEmployees() {
    const searchTerm = document.getElementById('employeeSearch').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm) ||
        employee.jobRole.toLowerCase().includes(searchTerm) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
    populateEmployeeTable(filteredEmployees);
}

// Event listeners
window.onload = function() {
    populateEmployeeTable();
    document.getElementById('addEmployeeForm').addEventListener('submit', addEmployee);
};