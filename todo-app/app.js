// Todo App - Main JavaScript

// Storage key for localStorage
const STORAGE_KEY = 'todos';

// In-memory storage for tasks
let tasks = [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            // If JSON parsing fails, start with empty array
            tasks = [];
        }
    }
}

// DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    // Validate: don't add empty tasks
    if (!text) {
        return;
    }

    // Create task object with unique ID
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    // Add to array
    tasks.push(task);

    // Save to localStorage
    saveTasks();

    // Render the task
    renderTask(task);

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;

        // Save to localStorage
        saveTasks();

        // Update DOM
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) {
            li.classList.toggle('completed', task.completed);
        }
    }
}

// Delete a task
function deleteTask(id) {
    // Remove from array
    tasks = tasks.filter(t => t.id !== id);

    // Save to localStorage
    saveTasks();

    // Remove from DOM
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (li) {
        li.remove();
    }
}

// Render a single task to the DOM
function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    // Apply completed class if task is already completed
    if (task.completed) {
        li.classList.add('completed');
    }

    // Task text span
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Click on task text to toggle completion
    taskText.addEventListener('click', function() {
        toggleTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.type = 'button';

    // Click on delete button to remove task
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
    });

    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Initialize the app
function init() {
    // Load tasks from localStorage
    loadTasks();

    // Render all loaded tasks
    tasks.forEach(task => renderTask(task));
}

// Event listeners
addBtn.addEventListener('click', addTask);

// Handle Enter key in input
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize on page load
init();
