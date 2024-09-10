document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach((image) => observer.observe(image));

  // Animate sections on scroll
  const sections = document.querySelectorAll("section");
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach((section) => sectionObserver.observe(section));

  // Hide loading spinner once the page is fully loaded
  const loadingSpinner = document.getElementById("loadingSpinner");
  window.addEventListener("load", () => {
    loadingSpinner.style.display = "none";
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  // Back-to-top button
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Search functionality
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", () => {
    const filter = searchBar.value.toLowerCase();
    document.querySelectorAll(".card, .stat-card").forEach((card) => {
      card.style.display = card.textContent.toLowerCase().includes(filter)
        ? ""
        : "none";
    });
  });

  // Modal functionality
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];

  span.onclick = () => (modal.style.display = "none");

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Notification functionality
  const notificationBell = document.querySelector(".notification-bell");
  const notificationDropdown = document.querySelector(".notification-dropdown");

  notificationBell.addEventListener("click", () => {
    notificationDropdown.style.display =
      notificationDropdown.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", (event) => {
    if (
      !event.target.matches(".notification-bell") &&
      notificationDropdown.style.display === "block"
    ) {
      notificationDropdown.style.display = "none";
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "d":
          event.preventDefault();
          window.location.href = "index.html";
          break;
        case "e":
          event.preventDefault();
          window.location.href = "employees.html";
          break;
        case "c":
          event.preventDefault();
          window.location.href = "courses.html";
          break;
        case "a":
          event.preventDefault();
          window.location.href = "assessments.html";
          break;
        case "r":
          event.preventDefault();
          window.location.href = "reports.html";
          break;
      }
    }
  });

  // Data Visualization - Pie chart
  const skillDistribution = document.getElementById("skillDistribution");
  if (skillDistribution) {
    new Chart(skillDistribution, {
      type: "pie",
      data: {
        labels: ["JavaScript", "Python", "Java", "C++", "Ruby"],
        datasets: [
          {
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // Data Visualization - Line chart
  const completionTrends = document.getElementById("completionTrends");
  if (completionTrends) {
    new Chart(completionTrends, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Course Completion Rate",
            data: [65, 70, 75, 80, 85, 90],
            borderColor: "#36A2EB",
            tension: 0.1,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // Progress bar
  function updateProgressBar(percentage) {
    const progressBar = document.getElementById("overallProgress");
    const progressPercentage = document.getElementById("progressPercentage");
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}% Complete`;
  }

  // Skill Radar Chart
  function createSkillRadarChart() {
    const ctx = document.getElementById("skillRadar").getContext("2d");
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["JavaScript", "Python", "Java", "C++", "Ruby"],
        datasets: [
          {
            label: "Your Skills",
            data: [70, 65, 60, 80, 75],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
          },
        ],
      },
      options: {
        elements: { line: { borderWidth: 3 } },
        scale: {
          ticks: { beginAtZero: true, max: 100 },
        },
      },
    });
  }

  // Initialize additional features
  updateProgressBar(75);
  createSkillRadarChart();

  // Login functionality
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  // Tab switching
  loginTab.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  });

  signupTab.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
  });

  // Login functionality
  if (loginForm) {
    const loginErrorMessage = document.getElementById("loginErrorMessage");
    const rememberMe = document.getElementById("rememberMe");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      try {
        // For demonstration purposes, we'll use a mock login
        if (username === "demo" && password === "password") {
          const token = "mock_token";
          if (rememberMe.checked) {
            localStorage.setItem("token", token);
          } else {
            sessionStorage.setItem("token", token);
          }
          window.location.href = "index.html"; // Redirect to the main page
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        loginErrorMessage.textContent = error.message;
        loginErrorMessage.style.display = "block";
      }
    });
  }

  // Signup functionality
  if (signupForm) {
    const signupErrorMessage = document.getElementById("signupErrorMessage");

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      try {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // For demonstration purposes, we'll use a mock signup
        console.log("User signed up:", { username, email });
        alert("Sign up successful! Please log in.");
        loginTab.click(); // Switch to login tab
      } catch (error) {
        signupErrorMessage.textContent = error.message;
        signupErrorMessage.style.display = "block";
      }
    });
  }

  // Password strength meter
  function setupPasswordStrengthMeter(inputId, strengthId) {
    const passwordInput = document.getElementById(inputId);
    const passwordStrength = document.getElementById(strengthId);

    if (passwordInput && passwordStrength) {
      passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let strength = 0;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[$@#&!]+/)) strength += 1;

        switch (strength) {
          case 0:
            passwordStrength.className = '';
            break;
          case 1:
            passwordStrength.className = 'weak';
            break;
          case 2:
            passwordStrength.className = 'medium';
            break;
          default:
            passwordStrength.className = 'strong';
        }
      });
    }
  }

  setupPasswordStrengthMeter('loginPassword', 'loginPasswordStrength');
  setupPasswordStrengthMeter('signupPassword', 'signupPasswordStrength');

  // Logout functionality
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  // Check authentication status
  function checkAuth() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const protectedPages = ["employees.html", "courses.html", "assessments.html", "reports.html"];
    const currentPage = window.location.pathname.split("/").pop();
    const loginButton = document.querySelector(".login-button");
    const logoutButton = document.getElementById("logoutButton");

    if (token) {
      if (loginButton) loginButton.style.display = "none";
      if (logoutButton) logoutButton.style.display = "block";
    } else {
      if (loginButton) loginButton.style.display = "block";
      if (logoutButton) logoutButton.style.display = "none";
      if (protectedPages.includes(currentPage)) {
        window.location.href = "login.html";
      }
    }
  }

  // Call checkAuth when the page loads
  checkAuth();

  // Session timeout
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let sessionTimer;

  function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      localStorage.removeItem('token');
      alert('Your session has expired. Please log in again.');
      window.location.href = 'login.html';
    }, SESSION_TIMEOUT);
  }

  // Reset timer on user activity
  ['click', 'touchstart', 'mousemove', 'keypress'].forEach(event => {
    document.addEventListener(event, resetSessionTimer, false);
  });

  // Initialize session timer
  resetSessionTimer();

  // Login button functionality
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
