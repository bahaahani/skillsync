// Global functionality for SkillSync

// Function to toggle a modal
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === "none" || modal.style.display === "") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

// Function to close all modals
function closeAllModals() {
    const modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
        modal.style.display = "none";
    }
}

// Event listener for closing modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
}

// Function to show a notification
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Function to show an alert
function showAlert(message, type = "info") {
    const alert = document.createElement("div");
    alert.className = `alert ${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
}

// Function to hide an alert
function hideAlert() {
    const alerts = document.getElementsByClassName("alert");
    for (let alert of alerts) {
        alert.remove();
    }
}

// Function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Add these functions to the global scope
window.toggleModal = toggleModal;
window.closeAllModals = closeAllModals;
window.showNotification = showNotification;
window.showAlert = showAlert;
window.hideAlert = hideAlert;
window.formatDate = formatDate;