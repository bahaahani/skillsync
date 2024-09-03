// Sample employee data
let employees = [
    { name: "John Doe", department: "IT", skills: ["JavaScript", "Python", "React"], coursesCompleted: 5 },
    { name: "Jane Smith", department: "HR", skills: ["Leadership", "Communication", "Conflict Resolution"], coursesCompleted: 3 },
    { name: "Mike Johnson", department: "Marketing", skills: ["SEO", "Content Writing", "Social Media Management"], coursesCompleted: 4 },
    { name: "Emily Brown", department: "Finance", skills: ["Financial Analysis", "Budgeting", "Excel"], coursesCompleted: 6 },
    { name: "Chris Lee", department: "IT", skills: ["Java", "SQL", "Machine Learning"], coursesCompleted: 7 }
];

// Function to populate the employee table
function populateEmployeeTable(employeesToShow = employees) {
    const tableBody = document.querySelector("#employeeTable tbody");
    tableBody.innerHTML = '';
    
    employeesToShow.forEach(employee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.skills.join(", ")}</td>
            <td>${employee.coursesCompleted}</td>
            <td>
                <button onclick="viewEmployee('${employee.name}')" class="btn">View</button>
                <button onclick="editEmployee('${employee.name}')" class="btn">Edit</button>
                <button onclick="deleteEmployee('${employee.name}')" class="btn">Delete</button>
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
    const skills = document.getElementById('newEmployeeSkills').value.split(',').map(skill => skill.trim());
    const coursesCompleted = parseInt(document.getElementById('newEmployeeCoursesCompleted').value);

    const newEmployee = { name, department, skills, coursesCompleted };
    employees.push(newEmployee);
    populateEmployeeTable();
    closeAllModals();
    showNotification(`Employee ${name} added successfully!`, "success");
    event.target.reset();
}

// Function to search employees
function searchEmployees() {
    const searchTerm = document.getElementById('employeeSearch').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
    populateEmployeeTable(filteredEmployees);
}

// Function to view employee details (placeholder)
function viewEmployee(name) {
    showNotification(`Viewing details for ${name}`, "info");
}

// Function to edit employee (placeholder)
function editEmployee(name) {
    showNotification(`Editing ${name}`, "info");
}

// Function to delete employee
function deleteEmployee(name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        employees = employees.filter(employee => employee.name !== name);
        populateEmployeeTable();
        showNotification(`Employee ${name} deleted successfully!`, "success");
    }
}

// Event listeners
window.onload = function() {
    populateEmployeeTable();
    document.getElementById('addEmployeeForm').addEventListener('submit', addEmployee);
};