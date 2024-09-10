// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("An error occurred:", error);
    showNotification("An error occurred. Please try again.", "error");
    return true;
};

// Function to show notifications
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to validate form inputs
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showNotification(`${input.name || 'Field'} is required`, 'error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Function to debounce API calls
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

// Function to make API calls
async function apiCall(url, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('API call failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showNotification('An error occurred while fetching data. Please try again.', 'error');
        throw error;
    }
}

// Authentication functions
async function login(username, password) {
    try {
        const response = await apiCall('/api/login', 'POST', { username, password });
        localStorage.setItem('token', response.token);
        showNotification('Logged in successfully', 'success');
        return response.user;
    } catch (error) {
        showNotification('Login failed. Please check your credentials.', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    showNotification('Logged out successfully', 'success');
    // Redirect to login page or update UI
}

// Function to check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Function to protect routes
function protectRoute(route) {
    if (!isAuthenticated()) {
        showNotification('Please log in to access this page', 'error');
        window.location.href = '/login.html';
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

    // Add other initialization code here
});

// Optimized function to toggle modal visibility
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }
}

// Function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to sanitize user input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Export functions and variables for use in other modules
export {
    showNotification,
    validateForm,
    debounce,
    apiCall,
    login,
    logout,
    isAuthenticated,
    protectRoute,
    toggleModal,
    formatDate,
    sanitizeInput
};