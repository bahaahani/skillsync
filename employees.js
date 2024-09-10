// Sample employee data
let employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    department: "IT",
    jobRole: "Software Engineer",
    skills: ["JavaScript", "Python", "React"],
    team: "Web Development",
    assessments: [
      {
        id: 1,
        title: "JavaScript Basics",
        score: 85,
        dateCompleted: "2023-05-15"
      },
      {
        id: 3,
        title: "React Components",
        score: 92,
        dateCompleted: "2023-05-20"
      },
    ],
    developmentPlan: {
      goals: [
        { id: 1, description: "Learn GraphQL", status: "In Progress", dueDate: "2023-08-31" },
        { id: 2, description: "Improve Python skills", status: "Not Started", dueDate: "2023-09-30" }
      ],
      recommendedCourses: [2, 5] // IDs of recommended courses
    },
    performance: {
      rating: 4,
      strengths: ["Problem-solving", "Team collaboration"],
      areasForImprovement: ["Time management", "Documentation"],
      lastReviewDate: "2023-04-01"
    },
    socialProfile: {
      connections: [2, 3, 4], // IDs of connected employees
      posts: [
        { id: 1, content: "Just completed the React course!", timestamp: "2023-05-21T10:30:00Z" }
      ],
      badges: ["Quick Learner", "Team Player"]
    }
  },
  // Add more sample employees here...
];

let currentUser = null; // Will store the logged-in user's information

// Function to populate the employee table
function populateEmployeeTable(employeesToShow = employees) {
  const tableBody = document.querySelector("#employeeTable tbody");
  tableBody.innerHTML = "";

  employeesToShow.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="#" onclick="viewEmployeeProfile(${employee.id})">${employee.name}</a></td>
      <td>${employee.email}</td>
      <td>${employee.department}</td>
      <td>${employee.jobRole}</td>
      <td>${employee.team}</td>
      <td>${employee.skills.join(", ")}</td>
      <td>
        <button onclick="editEmployee(${employee.id})" class="btn btn-primary">Edit</button>
        <button onclick="deleteEmployee(${employee.id})" class="btn btn-danger">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to view employee profile
function viewEmployeeProfile(id) {
  const employee = employees.find((e) => e.id === id);
  if (!employee) return;

  const modal = document.getElementById("employeeProfileModal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.innerHTML = `
    <h2>${employee.name}</h2>
    <p><strong>Email:</strong> ${employee.email}</p>
    <p><strong>Department:</strong> ${employee.department}</p>
    <p><strong>Job Role:</strong> ${employee.jobRole}</p>
    <p><strong>Team:</strong> ${employee.team}</p>
    <p><strong>Skills:</strong> ${employee.skills.join(", ")}</p>
    
    <h3>Assessments</h3>
    <ul>
      ${employee.assessments.map(a => `<li>${a.title}: ${a.score}% (Completed: ${a.dateCompleted})</li>`).join("")}
    </ul>
    
    <h3>Development Plan</h3>
    <h4>Goals</h4>
    <ul>
      ${employee.developmentPlan.goals.map(g => `<li>${g.description} - ${g.status} (Due: ${g.dueDate})</li>`).join("")}
    </ul>
    
    <h3>Performance</h3>
    <p><strong>Rating:</strong> ${employee.performance.rating}/5</p>
    <p><strong>Strengths:</strong> ${employee.performance.strengths.join(", ")}</p>
    <p><strong>Areas for Improvement:</strong> ${employee.performance.areasForImprovement.join(", ")}</p>
    <p><strong>Last Review Date:</strong> ${employee.performance.lastReviewDate}</p>
    
    <h3>Social Profile</h3>
    <p><strong>Connections:</strong> ${employee.socialProfile.connections.length}</p>
    <p><strong>Badges:</strong> ${employee.socialProfile.badges.join(", ")}</p>
    
    <button onclick="closeModal('employeeProfileModal')" class="btn btn-secondary">Close</button>
  `;

  modal.style.display = "block";
}

// Function to add a new employee
function addEmployee(event) {
  event.preventDefault();
  const name = document.getElementById("newEmployeeName").value;
  const email = document.getElementById("newEmployeeEmail").value;
  const department = document.getElementById("newEmployeeDepartment").value;
  const jobRole = document.getElementById("newEmployeeJobRole").value;
  const team = document.getElementById("newEmployeeTeam").value;
  const skills = document.getElementById("newEmployeeSkills").value.split(",").map(skill => skill.trim());

  const newEmployee = {
    id: employees.length + 1,
    name,
    email,
    department,
    jobRole,
    team,
    skills,
    assessments: [],
    developmentPlan: {
      goals: [],
      recommendedCourses: []
    },
    performance: {
      rating: 0,
      strengths: [],
      areasForImprovement: [],
      lastReviewDate: null
    },
    socialProfile: {
      connections: [],
      posts: [],
      badges: []
    }
  };

  employees.push(newEmployee);
  populateEmployeeTable();
  closeModal("addEmployeeModal");
  showNotification(`Employee ${name} added successfully!`, "success");
  event.target.reset();
}

// Function to edit an employee
function editEmployee(id) {
  const employee = employees.find((e) => e.id === id);
  if (!employee) return;

  const modal = document.getElementById("editEmployeeModal");
  const form = document.getElementById("editEmployeeForm");

  form.innerHTML = `
    <input type="hidden" id="editEmployeeId" value="${employee.id}">
    <input type="text" id="editEmployeeName" value="${employee.name}" required>
    <input type="email" id="editEmployeeEmail" value="${employee.email}" required>
    <input type="text" id="editEmployeeDepartment" value="${employee.department}" required>
    <input type="text" id="editEmployeeJobRole" value="${employee.jobRole}" required>
    <input type="text" id="editEmployeeTeam" value="${employee.team}" required>
    <input type="text" id="editEmployeeSkills" value="${employee.skills.join(", ")}" required>
    <button type="submit" class="btn btn-primary">Update Employee</button>
  `;

  form.onsubmit = updateEmployee;
  modal.style.display = "block";
}

// Function to update an employee
function updateEmployee(event) {
  event.preventDefault();
  const id = parseInt(document.getElementById("editEmployeeId").value);
  const name = document.getElementById("editEmployeeName").value;
  const email = document.getElementById("editEmployeeEmail").value;
  const department = document.getElementById("editEmployeeDepartment").value;
  const jobRole = document.getElementById("editEmployeeJobRole").value;
  const team = document.getElementById("editEmployeeTeam").value;
  const skills = document.getElementById("editEmployeeSkills").value.split(",").map(skill => skill.trim());

  const employeeIndex = employees.findIndex(e => e.id === id);
  if (employeeIndex === -1) return;

  employees[employeeIndex] = {
    ...employees[employeeIndex],
    name,
    email,
    department,
    jobRole,
    team,
    skills
  };

  populateEmployeeTable();
  closeModal("editEmployeeModal");
  showNotification(`Employee ${name} updated successfully!`, "success");
}

// Function to delete an employee
function deleteEmployee(id) {
  const employee = employees.find((e) => e.id === id);
  if (!employee) return;

  if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
    employees = employees.filter((e) => e.id !== id);
    populateEmployeeTable();
    showNotification(`Employee ${employee.name} deleted successfully!`, "success");
  }
}

// Function to search employees
function searchEmployees() {
  const searchTerm = document.getElementById("employeeSearch").value.toLowerCase();
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm) ||
      employee.jobRole.toLowerCase().includes(searchTerm) ||
      employee.team.toLowerCase().includes(searchTerm) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchTerm))
  );
  populateEmployeeTable(filteredEmployees);
}

// Function to show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

// Event listeners
window.onload = function () {
  populateEmployeeTable();
  document.getElementById("addEmployeeForm").addEventListener("submit", addEmployee);
  document.getElementById("employeeSearch").addEventListener("input", searchEmployees);
};

// Error handling
window.onerror = function(message, source, lineno, colno, error) {
  console.error("An error occurred:", error);
  showNotification("An error occurred. Please try again.", "error");
  return true;
};

// Simulated authentication (replace with actual authentication logic)
function login(username, password) {
  // In a real application, this would validate credentials against a backend
  currentUser = employees.find(e => e.email === username);
  if (currentUser) {
    showNotification(`Welcome, ${currentUser.name}!`, "success");
    // Update UI to show logged-in state
  } else {
    showNotification("Invalid credentials. Please try again.", "error");
  }
}

function logout() {
  currentUser = null;
  showNotification("You have been logged out.", "info");
  // Update UI to show logged-out state
}

// Example of integrating with a backend API (replace with actual API calls)
async function fetchEmployeesFromAPI() {
  try {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const data = await response.json();
    employees = data;
    populateEmployeeTable();
  } catch (error) {
    console.error("Error fetching employees:", error);
    showNotification("Failed to fetch employees. Please try again later.", "error");
  }
}

// Call this function instead of using the sample data when integrating with a backend
// fetchEmployeesFromAPI();
