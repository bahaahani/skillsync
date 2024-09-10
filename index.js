import { showNotification, validateForm, debounce, apiCall, isAuthenticated, protectRoute, toggleModal, formatDate, sanitizeInput } from './script.js';

// Check if user is authenticated
protectRoute('/index.html');

let currentUser = null;
let socialFeed = [];
let leaderboard = [];
let forumTopics = [];
let userGoals = [];

// Function to initialize the dashboard
async function initializeDashboard() {
    try {
        await fetchUserData();
        await Promise.all([
            fetchSocialFeed(),
            fetchLeaderboard(),
            fetchForumTopics(),
            fetchUserGoals()
        ]);
        updateUserProfile();
        populateSocialFeed();
        updateLeaderboard();
        populateForumTopics();
        displayUserGoals();
    } catch (error) {
        console.error("Error initializing dashboard:", error);
        showNotification("Failed to load dashboard data. Please try again later.", "error");
    }
}

// Function to fetch user data
async function fetchUserData() {
    try {
        currentUser = await apiCall('/api/user');
        updateUserProfile();
    } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification("Failed to fetch user data. Please try again later.", "error");
    }
}

// Function to update user profile
function updateUserProfile() {
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("completedCourses").textContent = currentUser.completedCourses;
    document.getElementById("skillLevel").textContent = currentUser.skillLevel;
    document.getElementById("goalsAchieved").textContent = currentUser.goalsAchieved;
}

// Function to fetch social feed
async function fetchSocialFeed() {
    try {
        socialFeed = await apiCall('/api/social-feed');
        populateSocialFeed();
    } catch (error) {
        console.error("Error fetching social feed:", error);
        showNotification("Failed to fetch social feed. Please try again later.", "error");
    }
}

// Function to populate social feed
function populateSocialFeed() {
    const feedContent = document.getElementById("feedContent");
    feedContent.innerHTML = "";

    socialFeed.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <p><strong>${sanitizeInput(post.userName)}</strong></p>
            <p>${sanitizeInput(post.content)}</p>
            <small>${formatDate(post.timestamp)}</small>
        `;
        feedContent.appendChild(postElement);
    });
}

// Function to create a new post
async function createPost() {
    const content = document.getElementById("postContent").value;
    if (content.trim() === "") return;

    try {
        const newPost = await apiCall('/api/social-feed/post', 'POST', { content: sanitizeInput(content) });
        socialFeed.unshift(newPost);
        populateSocialFeed();
        document.getElementById("postContent").value = "";
        showNotification("Post created successfully!", "success");
    } catch (error) {
        console.error("Error creating post:", error);
        showNotification("Failed to create post. Please try again.", "error");
    }
}

// Function to fetch leaderboard
async function fetchLeaderboard() {
    try {
        leaderboard = await apiCall('/api/leaderboard');
        updateLeaderboard();
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        showNotification("Failed to fetch leaderboard. Please try again later.", "error");
    }
}

// Function to update leaderboard
function updateLeaderboard() {
    const leaderboardBody = document.querySelector("#leaderboardTable tbody");
    leaderboardBody.innerHTML = "";

    leaderboard.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${sanitizeInput(entry.name)}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Function to fetch forum topics
async function fetchForumTopics() {
    try {
        forumTopics = await apiCall('/api/forum-topics');
        populateForumTopics();
    } catch (error) {
        console.error("Error fetching forum topics:", error);
        showNotification("Failed to fetch forum topics. Please try again later.", "error");
    }
}

// Function to populate forum topics
function populateForumTopics() {
    const forumTopicsContainer = document.getElementById("forumTopics");
    forumTopicsContainer.innerHTML = "";

    forumTopics.forEach(topic => {
        const topicElement = document.createElement("div");
        topicElement.className = "forum-topic";
        topicElement.innerHTML = `
            <h3>${sanitizeInput(topic.title)}</h3>
            <p>${sanitizeInput(topic.description)}</p>
            <small>Posted by ${sanitizeInput(topic.author)} on ${formatDate(topic.timestamp)}</small>
        `;
        forumTopicsContainer.appendChild(topicElement);
    });
}

// Function to create a new forum topic
async function createForumTopic(event) {
    event.preventDefault();
    if (!validateForm('createTopicForm')) return;

    const title = document.getElementById("topicTitle").value;
    const description = document.getElementById("topicDescription").value;

    try {
        const newTopic = await apiCall('/api/forum-topics', 'POST', {
            title: sanitizeInput(title),
            description: sanitizeInput(description)
        });
        forumTopics.unshift(newTopic);
        populateForumTopics();
        toggleModal('createTopicModal');
        showNotification("Forum topic created successfully!", "success");
    } catch (error) {
        console.error("Error creating forum topic:", error);
        showNotification("Failed to create forum topic. Please try again.", "error");
    }
}

// Function to fetch user goals
async function fetchUserGoals() {
    try {
        userGoals = await apiCall('/api/user-goals');
        displayUserGoals();
    } catch (error) {
        console.error("Error fetching user goals:", error);
        showNotification("Failed to fetch user goals. Please try again later.", "error");
    }
}

// Function to display user goals
function displayUserGoals() {
    const goalsList = document.getElementById("goalsList");
    goalsList.innerHTML = "";

    userGoals.forEach(goal => {
        const goalElement = document.createElement("div");
        goalElement.className = "goal";
        goalElement.innerHTML = `
            <h3>${sanitizeInput(goal.title)}</h3>
            <p>Due Date: ${formatDate(goal.dueDate)}</p>
            <p>Status: ${goal.status}</p>
        `;
        goalsList.appendChild(goalElement);
    });
}

// Function to add a new goal
async function addGoal(event) {
    event.preventDefault();
    if (!validateForm('addGoalForm')) return;

    const title = document.getElementById("goalTitle").value;
    const dueDate = document.getElementById("goalDueDate").value;

    try {
        const newGoal = await apiCall('/api/user-goals', 'POST', {
            title: sanitizeInput(title),
            dueDate: dueDate
        });
        userGoals.push(newGoal);
        displayUserGoals();
        toggleModal('addGoalModal');
        showNotification("Goal added successfully!", "success");
    } catch (error) {
        console.error("Error adding goal:", error);
        showNotification("Failed to add goal. Please try again.", "error");
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    initializeDashboard();
    document.getElementById("createTopicForm").addEventListener("submit", createForumTopic);
    document.getElementById("addGoalForm").addEventListener("submit", addGoal);
    document.getElementById("postContent").addEventListener("input", debounce(() => {
        // Add any real-time validation or character count here
    }, 300));
});

// Expose necessary functions to the global scope for use in HTML
window.createPost = createPost;
window.toggleModal = toggleModal;