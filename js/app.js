// Health App JavaScript

// DOM Elements
const taskListEl = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
const updateRoutineBtn = document.getElementById('updateRoutineBtn');
const updateRoutineModal = new bootstrap.Modal(document.getElementById('updateRoutineModal'));
const saveRoutineBtn = document.getElementById('saveRoutineBtn');
const addMemoryBtn = document.getElementById('addMemoryBtn');
const addMemoryModal = new bootstrap.Modal(document.getElementById('addMemoryModal'));
const saveMemoryBtn = document.getElementById('saveMemoryBtn');
const viewDoctorsBtn = document.getElementById('viewDoctorsBtn');
const calendarBtn = document.getElementById('calendarBtn');
const timetableListEl = document.getElementById('timetableList');
const morningRoutineEl = document.getElementById('morningRoutine');
const afternoonRoutineEl = document.getElementById('afternoonRoutine');
const eveningRoutineEl = document.getElementById('eveningRoutine');
const memoryListEl = document.getElementById('memoryList');

// Sample Data (would be replaced with localStorage or API data)
let tasks = [
    { id: 1, name: 'Take Medication', description: 'Morning pills with breakfast', dueDate: '2023-05-15', priority: 'High', completed: false },
    { id: 2, name: 'Doctor Appointment', description: 'Annual checkup with Dr. Smith', dueDate: '2023-05-20', priority: 'Medium', completed: false },
    { id: 3, name: 'Exercise', description: '30 minutes of walking', dueDate: '2023-05-15', priority: 'Low', completed: true }
];

let routines = {
    morning: [
        { activity: 'Take medication', time: '07:30' },
        { activity: 'Breakfast', time: '08:00' },
        { activity: 'Morning walk', time: '08:30' }
    ],
    afternoon: [
        { activity: 'Lunch', time: '13:00' },
        { activity: 'Rest', time: '14:00' }
    ],
    evening: [
        { activity: 'Dinner', time: '19:00' },
        { activity: 'Take medication', time: '20:00' },
        { activity: 'Reading', time: '21:00' }
    ]
};

let memoryAids = [
    { id: 1, title: 'Blood Pressure Reading', description: '130/85 - slightly elevated', reminderTime: '2023-05-16T09:00' },
    { id: 2, title: 'Medication Side Effects', description: 'Slight dizziness after morning pill', reminderTime: '2023-05-17T10:00' }
];

let timetable = [
    { id: 1, time: '07:30 AM', activity: 'Morning Medication' },
    { id: 2, time: '09:00 AM', activity: 'Exercise' },
    { id: 3, time: '11:00 AM', activity: 'Doctor Appointment' },
    { id: 4, time: '01:00 PM', activity: 'Lunch' },
    { id: 5, time: '04:00 PM', activity: 'Therapy Session' },
    { id: 6, time: '07:00 PM', activity: 'Dinner' },
    { id: 7, time: '09:00 PM', activity: 'Evening Medication' }
];

// Initialize the app
function initializeApp() {
    loadTasks();
    loadRoutines();
    loadMemoryAids();
    loadTimetable();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Task Management
    addTaskBtn.addEventListener('click', () => {
        document.getElementById('taskForm').reset();
        addTaskModal.show();
    });
    
    saveTaskBtn.addEventListener('click', saveTask);
    
    // Routine Management
    updateRoutineBtn.addEventListener('click', () => {
        // Load current routines into the form
        populateRoutineForm();
        updateRoutineModal.show();
    });
    
    saveRoutineBtn.addEventListener('click', saveRoutine);
    
    // Add event listeners for routine buttons
    document.querySelector('.add-morning-btn').addEventListener('click', () => addRoutineInput('morning'));
    document.querySelector('.add-afternoon-btn').addEventListener('click', () => addRoutineInput('afternoon'));
    document.querySelector('.add-evening-btn').addEventListener('click', () => addRoutineInput('evening'));
    
    // Add event listeners for remove routine buttons
    document.querySelectorAll('.remove-routine-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.row').remove();
        });
    });
    
    // Memory Aid Management
    addMemoryBtn.addEventListener('click', () => {
        document.getElementById('memoryForm').reset();
        addMemoryModal.show();
    });
    
    saveMemoryBtn.addEventListener('click', saveMemoryAid);
    
    // Doctor View
    viewDoctorsBtn.addEventListener('click', () => {
        window.location.href = 'doctors.html';
    });
    
    // Calendar for Timetable
    calendarBtn.addEventListener('click', () => {
        // In a real app, show a date picker
        alert('Calendar functionality would be implemented here.');
    });
}

// Task Management Functions
function loadTasks() {
    taskListEl.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListEl.innerHTML = '<p class="text-center p-3">No tasks available. Add your first task!</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `list-group-item task-item ${task.completed ? 'task-completed' : ''}`;
        taskEl.innerHTML = `
            <input type="checkbox" class="form-check-input" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <div class="task-info ms-2">
                <h6 class="mb-0">${task.name}</h6>
                <small>${task.description}</small>
                <div class="d-flex justify-content-between align-items-center mt-1">
                    <small>Due: ${formatDate(task.dueDate)}</small>
                    <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-2 delete-task" data-id="${task.id}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        taskListEl.appendChild(taskEl);
        
        // Add event listener for task completion
        const checkbox = taskEl.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id);
        });
        
        // Add event listener for task deletion
        const deleteBtn = taskEl.querySelector('.delete-task');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
    });
}

function saveTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskPriority = document.getElementById('taskPriority').value;
    
    if (!taskName || !taskDueDate) {
        alert('Please fill in the required fields');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasksToStorage();
    loadTasks();
    addTaskModal.hide();
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        loadTasks();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        loadTasks();
    }
}

// Routine Management Functions
function loadRoutines() {
    // Load Morning Routine
    morningRoutineEl.innerHTML = '';
    routines.morning.forEach(item => {
        const routineItem = document.createElement('div');
        routineItem.className = 'routine-item';
        routineItem.innerHTML = `
            <span>${item.activity}</span>
            <span class="routine-time">${item.time}</span>
        `;
        morningRoutineEl.appendChild(routineItem);
    });
    
    // Load Afternoon Routine
    afternoonRoutineEl.innerHTML = '';
    routines.afternoon.forEach(item => {
        const routineItem = document.createElement('div');
        routineItem.className = 'routine-item';
        routineItem.innerHTML = `
            <span>${item.activity}</span>
            <span class="routine-time">${item.time}</span>
        `;
        afternoonRoutineEl.appendChild(routineItem);
    });
    
    // Load Evening Routine
    eveningRoutineEl.innerHTML = '';
    routines.evening.forEach(item => {
        const routineItem = document.createElement('div');
        routineItem.className = 'routine-item';
        routineItem.innerHTML = `
            <span>${item.activity}</span>
            <span class="routine-time">${item.time}</span>
        `;
        eveningRoutineEl.appendChild(routineItem);
    });
}

function populateRoutineForm() {
    const morningInputs = document.getElementById('morningRoutineInputs');
    const afternoonInputs = document.getElementById('afternoonRoutineInputs');
    const eveningInputs = document.getElementById('eveningRoutineInputs');
    
    morningInputs.innerHTML = '';
    afternoonInputs.innerHTML = '';
    eveningInputs.innerHTML = '';
    
    // Populate morning routine inputs
    routines.morning.forEach(item => {
        const row = createRoutineInput(item.activity, item.time);
        morningInputs.appendChild(row);
    });
    
    // Populate afternoon routine inputs
    routines.afternoon.forEach(item => {
        const row = createRoutineInput(item.activity, item.time);
        afternoonInputs.appendChild(row);
    });
    
    // Populate evening routine inputs
    routines.evening.forEach(item => {
        const row = createRoutineInput(item.activity, item.time);
        eveningInputs.appendChild(row);
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-routine-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.row').remove();
        });
    });
}

function createRoutineInput(activity = '', time = '') {
    const row = document.createElement('div');
    row.className = 'row mb-2';
    row.innerHTML = `
        <div class="col-6">
            <input type="text" class="form-control" placeholder="Activity" value="${activity}">
        </div>
        <div class="col-4">
            <input type="time" class="form-control" value="${time}">
        </div>
        <div class="col-2">
            <button type="button" class="btn btn-sm btn-outline-danger remove-routine-btn">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    return row;
}

function addRoutineInput(type) {
    const container = document.getElementById(`${type}RoutineInputs`);
    const row = createRoutineInput();
    container.appendChild(row);
    
    // Add event listener for the new remove button
    const removeBtn = row.querySelector('.remove-routine-btn');
    removeBtn.addEventListener('click', function() {
        this.closest('.row').remove();
    });
}

function saveRoutine() {
    // Get all morning routine inputs
    const morningInputs = document.getElementById('morningRoutineInputs').querySelectorAll('.row');
    const afternoonInputs = document.getElementById('afternoonRoutineInputs').querySelectorAll('.row');
    const eveningInputs = document.getElementById('eveningRoutineInputs').querySelectorAll('.row');
    
    // Clear current routines
    routines.morning = [];
    routines.afternoon = [];
    routines.evening = [];
    
    // Save morning routines
    morningInputs.forEach(row => {
        const activity = row.querySelector('input[type="text"]').value;
        const time = row.querySelector('input[type="time"]').value;
        
        if (activity && time) {
            routines.morning.push({ activity, time });
        }
    });
    
    // Save afternoon routines
    afternoonInputs.forEach(row => {
        const activity = row.querySelector('input[type="text"]').value;
        const time = row.querySelector('input[type="time"]').value;
        
        if (activity && time) {
            routines.afternoon.push({ activity, time });
        }
    });
    
    // Save evening routines
    eveningInputs.forEach(row => {
        const activity = row.querySelector('input[type="text"]').value;
        const time = row.querySelector('input[type="time"]').value;
        
        if (activity && time) {
            routines.evening.push({ activity, time });
        }
    });
    
    saveRoutinesToStorage();
    loadRoutines();
    updateRoutineModal.hide();
}

// Memory Aid Functions
function loadMemoryAids() {
    memoryListEl.innerHTML = '';
    
    if (memoryAids.length === 0) {
        memoryListEl.innerHTML = '<p class="text-center p-3">No memory aids available. Add your first memory aid!</p>';
        return;
    }
    
    memoryAids.forEach(aid => {
        const memoryItem = document.createElement('div');
        memoryItem.className = 'card memory-item mb-2';
        memoryItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <h6 class="mb-1">${aid.title}</h6>
                <button class="btn btn-sm btn-outline-danger delete-memory" data-id="${aid.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <p class="mb-1">${aid.description}</p>
            <small class="memory-time">Reminder: ${formatDateTime(aid.reminderTime)}</small>
        `;
        memoryListEl.appendChild(memoryItem);
        
        // Add event listener for memory aid deletion
        const deleteBtn = memoryItem.querySelector('.delete-memory');
        deleteBtn.addEventListener('click', () => {
            deleteMemoryAid(aid.id);
        });
    });
}

function saveMemoryAid() {
    const memoryTitle = document.getElementById('memoryTitle').value;
    const memoryDescription = document.getElementById('memoryDescription').value;
    const memoryReminderTime = document.getElementById('memoryReminderTime').value;
    
    if (!memoryTitle) {
        alert('Please enter a title for the memory aid');
        return;
    }
    
    const newMemoryAid = {
        id: Date.now(),
        title: memoryTitle,
        description: memoryDescription,
        reminderTime: memoryReminderTime
    };
    
    memoryAids.push(newMemoryAid);
    saveMemoryAidsToStorage();
    loadMemoryAids();
    addMemoryModal.hide();
}

function deleteMemoryAid(aidId) {
    if (confirm('Are you sure you want to delete this memory aid?')) {
        memoryAids = memoryAids.filter(aid => aid.id !== aidId);
        saveMemoryAidsToStorage();
        loadMemoryAids();
    }
}

// Timetable Functions
function loadTimetable() {
    timetableListEl.innerHTML = '';
    
    if (timetable.length === 0) {
        timetableListEl.innerHTML = '<p class="text-center p-3">No activities scheduled for today.</p>';
        return;
    }
    
    timetable.forEach(item => {
        const timetableItem = document.createElement('div');
        timetableItem.className = 'list-group-item';
        timetableItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.time}</strong> - ${item.activity}
                </div>
            </div>
        `;
        timetableListEl.appendChild(timetableItem);
    });
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Not set';
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
}

// Local Storage Functions
function saveTasksToStorage() {
    localStorage.setItem('health_app_tasks', JSON.stringify(tasks));
}

function saveRoutinesToStorage() {
    localStorage.setItem('health_app_routines', JSON.stringify(routines));
}

function saveMemoryAidsToStorage() {
    localStorage.setItem('health_app_memory_aids', JSON.stringify(memoryAids));
}

function loadFromStorage() {
    const storedTasks = localStorage.getItem('health_app_tasks');
    const storedRoutines = localStorage.getItem('health_app_routines');
    const storedMemoryAids = localStorage.getItem('health_app_memory_aids');
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    
    if (storedRoutines) {
        routines = JSON.parse(storedRoutines);
    }
    
    if (storedMemoryAids) {
        memoryAids = JSON.parse(storedMemoryAids);
    }
}

// Dark Mode Toggle Function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark_mode', isDarkMode);
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    const darkModePref = localStorage.getItem('dark_mode');
    if (darkModePref === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    checkDarkModePreference();
    initializeApp();
}); 