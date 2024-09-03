document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll("img");
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };


    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, options);

    images.forEach(image => {
        observer.observe(image);
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll("section");
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Hide loading spinner once the page is fully loaded
    const loadingSpinner = document.getElementById('loadingSpinner');
    window.addEventListener('load', () => {
        loadingSpinner.style.display = 'none';
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.removeItem('darkMode');
        }
    });

    // Back-to-top button
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Search functionality
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        const filter = searchBar.value.toLowerCase();
        const cards = document.querySelectorAll('.card, .stat-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Modal functionality
    const modal = document.getElementById('myModal');
    const span = document.getElementsByClassName('close')[0];

    // Open the modal (for demonstration, you can trigger this with a button click)
    // modal.style.display = 'block';

    // Close the modal
    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Notification functionality
    const notificationBell = document.querySelector('.notification-bell');
    const notificationDropdown = document.querySelector('.notification-dropdown');

    notificationBell.addEventListener('click', () => {
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close the dropdown when clicking outside
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.notification-bell')) {
            notificationDropdown.style.display = 'none';
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'd':
                    event.preventDefault();
                    window.location.href = 'index.html';
                    break;
                case 'e':
                    event.preventDefault();
                    window.location.href = 'employees.html';
                    break;
                case 'c':
                    event.preventDefault();
                    window.location.href = 'courses.html';
                    break;
                case 'a':
                    event.preventDefault();
                    window.location.href = 'assessments.html';
                    break;
                case 'r':
                    event.preventDefault();
                    window.location.href = 'reports.html';
                    break;
            }
        }
    });

    // Data Visualization
    const skillDistribution = document.getElementById('skillDistribution');
    const completionTrends = document.getElementById('completionTrends');

    if (skillDistribution) {
        new Chart(skillDistribution, {
            type: 'pie',
            data: {
                labels: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (completionTrends) {
        new Chart(completionTrends, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Course Completion Rate',
                    data: [65, 70, 75, 80, 85, 90],
                    borderColor: '#36A2EB',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Progress Bar
    function updateProgressBar(percentage) {
        const progressBar = document.getElementById('overallProgress');
        const progressPercentage = document.getElementById('progressPercentage');
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '% Complete';
    }

    // Skill Radar Chart
    function createSkillRadarChart() {
        const ctx = document.getElementById('skillRadar').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'],
                datasets: [{
                    label: 'Your Skills',
                    data: [70, 65, 60, 80, 75],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Recent Achievements
    function addAchievement(achievement) {
        const achievementsList = document.getElementById('achievementsList');
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementsList.prepend(li);
    }

    // Learning Streak
    function updateStreak(days) {
        const streakCount = document.getElementById('streakCount');
        streakCount.textContent = days;
    }

    // Personalized Recommendations
    function addRecommendation(recommendation) {
        const recommendationsList = document.getElementById('recommendationsList');
        const li = document.createElement('li');
        li.textContent = recommendation;
        recommendationsList.appendChild(li);
    }

    // Initialize student progress features
    updateProgressBar(75); // Example: 75% complete
    createSkillRadarChart();
    addAchievement('Completed JavaScript Basics course');
    addAchievement('Earned Python Intermediate badge');
    updateStreak(5); // Example: 5-day streak
    addRecommendation('Take the Advanced JavaScript course');
    addRecommendation('Practice more Python coding challenges');

    // Skill Proficiency Levels
    function createSkillProficiencyChart() {
        const ctx = document.getElementById('skillProficiencyChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'],
                datasets: [{
                    label: 'Proficiency Level',
                    data: [80, 65, 70, 55, 60],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Study Time Tracker
    function createStudyTimeChart() {
        const ctx = document.getElementById('studyTimeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [2, 3, 1.5, 4, 2.5, 3.5, 2],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Goals
    function initializeGoals() {
        const goalsList = document.getElementById('goalsList');
        const addGoalBtn = document.getElementById('addGoalBtn');
        
        const goals = [
            { text: 'Complete JavaScript course', progress: 75 },
            { text: 'Build a portfolio project', progress: 30 }
        ];
        
        function renderGoals() {
            goalsList.innerHTML = '';
            goals.forEach((goal, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${goal.text}</span>
                    <progress value="${goal.progress}" max="100"></progress>
                    <button onclick="removeGoal(${index})">Remove</button>
                `;
                goalsList.appendChild(li);
            });
        }
        
        addGoalBtn.addEventListener('click', () => {
            const newGoal = prompt('Enter a new goal:');
            if (newGoal) {
                goals.push({ text: newGoal, progress: 0 });
                renderGoals();
            }
        });
        
        window.removeGoal = function(index) {
            goals.splice(index, 1);
            renderGoals();
        };
        
        renderGoals();
    }

    // Peer Comparison
    function createPeerComparisonChart() {
        const ctx = document.getElementById('peerComparisonChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Problem Solving', 'Coding Speed', 'Code Quality', 'Teamwork', 'Communication'],
                datasets: [{
                    label: 'You',
                    data: [80, 70, 75, 85, 80],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: 'Average Peer',
                    data: [70, 75, 70, 75, 75],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            }
        });
    }

    // Initialize peer comparison chart
    createPeerComparisonChart();
});