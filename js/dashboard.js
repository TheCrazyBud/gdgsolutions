// Dashboard JavaScript

// DOM Elements
const completedTasksCountEl = document.getElementById('completedTasksCount');
const pendingTasksCountEl = document.getElementById('pendingTasksCount');
const memoryAidsCountEl = document.getElementById('memoryAidsCount');
const routinesCountEl = document.getElementById('routinesCount');
const activityTimelineEl = document.getElementById('activityTimeline');
const highPriorityCountEl = document.getElementById('highPriorityCount');
const mediumPriorityCountEl = document.getElementById('mediumPriorityCount');
const lowPriorityCountEl = document.getElementById('lowPriorityCount');
const dashboardScheduleEl = document.getElementById('dashboardSchedule');
const darkModeToggleEl = document.getElementById('darkModeToggle');
const notificationsToggleEl = document.getElementById('notificationsToggle');
const clearDataBtnEl = document.getElementById('clearDataBtn');

// Sample Activity Data (would be replaced with real activity tracking)
const activities = [
    { type: 'task_completed', text: 'Completed "Take Medication" task', time: '2 hours ago' },
    { type: 'task_added', text: 'Added "Doctor Appointment" task', time: '1 day ago' },
    { type: 'routine_updated', text: 'Updated morning routine', time: '2 days ago' },
    { type: 'memory_added', text: 'Added "Blood Pressure Reading" memory', time: '3 days ago' }
];

// Initialize Dashboard
function initializeDashboard() {
    loadDashboardData();
    setupDashboardEvents();
}

// Setup Dashboard Event Listeners
function setupDashboardEvents() {
    // Dark Mode Toggle
    darkModeToggleEl.addEventListener('change', function() {
        toggleDarkMode();
        darkModeToggleEl.checked = document.body.classList.contains('dark-mode');
    });
    
    // Check if dark mode is already enabled
    darkModeToggleEl.checked = document.body.classList.contains('dark-mode');
    
    // Notifications Toggle
    notificationsToggleEl.addEventListener('change', function() {
        localStorage.setItem('notifications_enabled', this.checked);
    });
    
    // Load notification preference
    const notificationsEnabled = localStorage.getItem('notifications_enabled');
    if (notificationsEnabled !== null) {
        notificationsToggleEl.checked = notificationsEnabled === 'true';
    }
    
    // Clear Data Button
    clearDataBtnEl.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
            clearAllData();
            location.reload();
        }
    });
}

// Load Dashboard Data
function loadDashboardData() {
    loadFromStorage();
    
    // Update task statistics
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    
    completedTasksCountEl.textContent = completedTasks.length;
    pendingTasksCountEl.textContent = pendingTasks.length;
    
    // Update memory aids count
    memoryAidsCountEl.textContent = memoryAids.length;
    
    // Update routines count
    const totalRoutines = routines.morning.length + routines.afternoon.length + routines.evening.length;
    routinesCountEl.textContent = totalRoutines;
    
    // Update task priority counts
    const highPriorityTasks = tasks.filter(task => task.priority === 'High' && !task.completed);
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'Medium' && !task.completed);
    const lowPriorityTasks = tasks.filter(task => task.priority === 'Low' && !task.completed);
    
    highPriorityCountEl.textContent = highPriorityTasks.length;
    mediumPriorityCountEl.textContent = mediumPriorityTasks.length;
    lowPriorityCountEl.textContent = lowPriorityTasks.length;
    
    // Load activity timeline
    loadActivityTimeline();
    
    // Load today's schedule
    loadDashboardSchedule();
}

// Load Activity Timeline
function loadActivityTimeline() {
    activityTimelineEl.innerHTML = '';
    
    if (activities.length === 0) {
        activityTimelineEl.innerHTML = '<p class="text-center p-3">No recent activities.</p>';
        return;
    }
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'list-group-item';
        
        // Set icon based on activity type
        let iconClass = '';
        switch (activity.type) {
            case 'task_completed':
                iconClass = 'bi-check-circle text-success';
                break;
            case 'task_added':
                iconClass = 'bi-plus-circle text-primary';
                break;
            case 'routine_updated':
                iconClass = 'bi-arrow-repeat text-warning';
                break;
            case 'memory_added':
                iconClass = 'bi-brain text-info';
                break;
            default:
                iconClass = 'bi-activity text-secondary';
        }
        
        activityItem.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${iconClass} me-3" style="font-size: 1.5rem;"></i>
                <div>
                    <p class="mb-0">${activity.text}</p>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `;
        
        activityTimelineEl.appendChild(activityItem);
    });
}

// Load Dashboard Schedule
function loadDashboardSchedule() {
    dashboardScheduleEl.innerHTML = '';
    
    if (timetable.length === 0) {
        dashboardScheduleEl.innerHTML = '<p class="text-center p-3">No activities scheduled for today.</p>';
        return;
    }
    
    // Sort timetable by time
    const sortedTimetable = [...timetable].sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
    });
    
    sortedTimetable.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'list-group-item';
        scheduleItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.time}</strong> - ${item.activity}
                </div>
            </div>
        `;
        dashboardScheduleEl.appendChild(scheduleItem);
    });
}

// Utility function to convert 12-hour time to 24-hour for sorting
function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
}

// Clear All Data
function clearAllData() {
    localStorage.removeItem('health_app_tasks');
    localStorage.removeItem('health_app_routines');
    localStorage.removeItem('health_app_memory_aids');
    
    // Keep user preferences
    const darkMode = localStorage.getItem('dark_mode');
    const notifications = localStorage.getItem('notifications_enabled');
    
    localStorage.clear();
    
    if (darkMode) {
        localStorage.setItem('dark_mode', darkMode);
    }
    
    if (notifications) {
        localStorage.setItem('notifications_enabled', notifications);
    }
}

// Initialize Dashboard when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard); 