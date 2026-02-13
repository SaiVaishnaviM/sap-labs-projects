// Dark Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    }
});

// Validation functions
function validateName(name) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
        return { valid: false, error: 'Name is required.' };
    }
    if (trimmed.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters long.' };
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
    }
    return { valid: true, error: '' };
}

function validateEmail(email) {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed.length === 0) {
        return { valid: false, error: 'Email is required.' };
    }
    if (!emailRegex.test(trimmed)) {
        return { valid: false, error: 'Please enter a valid email address.' };
    }
    return { valid: true, error: '' };
}

function validateMessage(message) {
    const trimmed = message.trim();
    if (trimmed.length === 0) {
        return { valid: false, error: 'Message is required.' };
    }
    if (trimmed.length < 10) {
        return { valid: false, error: 'Message must be at least 10 characters long.' };
    }
    if (trimmed.length > 500) {
        return { valid: false, error: 'Message cannot exceed 500 characters.' };
    }
    return { valid: true, error: '' };
}

// Display validation errors
function displayError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    if (errorMessage) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
}

// Clear errors when user starts typing
document.getElementById('name').addEventListener('input', function() {
    displayError('name', '');
});

document.getElementById('email').addEventListener('input', function() {
    displayError('email', '');
});

document.getElementById('message').addEventListener('input', function() {
    displayError('message', '');
});

// Form submission with validation
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate all fields
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const messageValidation = validateMessage(message);
    
    // Display errors
    displayError('name', nameValidation.error);
    displayError('email', emailValidation.error);
    displayError('message', messageValidation.error);
    
    // If all valid, submit
    if (nameValidation.valid && emailValidation.valid && messageValidation.valid) {
        alert('Form submitted successfully!');
        document.getElementById('contactForm').reset();
        displayError('name', '');
        displayError('email', '');
        displayError('message', '');
        // Here you can add code to send the form data to a server
    }
});