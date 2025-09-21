/* JavaScript for Contact Page Functionality */
        
// Global variables for form management
let formSubmitted = false;
let faqStates = [false, false, false, false, false, false]; // Track FAQ open/closed states

/* Utility Functions */

// Local storage helper functions
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
}

/* Form Validation Functions */

// Email validation using regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Name validation (letters, spaces, hyphens, apostrophes)
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s\-']{2,100}$/;
    return nameRegex.test(name.trim());
}

// Validate individual field and show/hide error messages
function validateField(fieldId, validationFn, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId.replace('contact', '').toLowerCase() + 'Error');
    const value = field.value.trim();
    
    if (!validationFn(value)) {
        // Show error state
        field.classList.add('error');
        field.classList.remove('success');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = errorMessage;
        }
        return false;
    } else {
        // Show success state
        field.classList.remove('error');
        field.classList.add('success');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        return true;
    }
}

// Comprehensive form validation
function validateContactForm() {
    let isValid = true;
    
    // Validate name
    isValid &= validateField('contactName', isValidName, 'Please enter a valid name (2-100 characters, letters only)');
    
    // Validate email
    isValid &= validateField('contactEmail', isValidEmail, 'Please enter a valid email address');
    
    // Validate message
    const message = document.getElementById('contactMessage').value.trim();
    isValid &= validateField('contactMessage', 
        (msg) => msg.length >= 10 && msg.length <= 1000, 
        'Message must be between 10-1000 characters'
    );
    
    return Boolean(isValid);
}

/* Real-time Form Validation */
function setupRealTimeValidation() {
    const nameField = document.getElementById('contactName');
    const emailField = document.getElementById('contactEmail');
    const messageField = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    
    // Real-time name validation
    nameField.addEventListener('blur', () => {
        validateField('contactName', isValidName, 'Please enter a valid name (2-100 characters, letters only)');
    });
    
    nameField.addEventListener('input', () => {
        // Clear error state while typing
        nameField.classList.remove('error');
        const errorDiv = document.getElementById('nameError');
        if (errorDiv) errorDiv.style.display = 'none';
    });
    
    // Real-time email validation
    emailField.addEventListener('blur', () => {
        validateField('contactEmail', isValidEmail, 'Please enter a valid email address');
    });
    
    emailField.addEventListener('input', () => {
        emailField.classList.remove('error');
        const errorDiv = document.getElementById('emailError');
        if (errorDiv) errorDiv.style.display = 'none';
    });
    
    // Real-time message validation with character counter
    messageField.addEventListener('input', () => {
        const length = messageField.value.length;
        charCount.textContent = length;
        
        // Update character counter color
        if (length < 10) {
            charCount.style.color = 'var(--red)';
        } else if (length > 900) {
            charCount.style.color = 'var(--orange)';
        } else {
            charCount.style.color = 'var(--primary-green)';
        }
        
        // Clear error state while typing
        messageField.classList.remove('error');
        const errorDiv = document.getElementById('messageError');
        if (errorDiv) errorDiv.style.display = 'none';
    });
    
    messageField.addEventListener('blur', () => {
        const message = messageField.value.trim();
        validateField('contactMessage', 
            (msg) => msg.length >= 10 && msg.length <= 1000, 
            'Message must be between 10-1000 characters'
        );
    });
    
    console.log('Real-time validation setup complete');
}

/* Form Submission Handler */
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission
    
    console.log('Form submission attempted');
    
    // Prevent duplicate submissions
    if (formSubmitted) {
        console.log('Form already submitted, ignoring');
        return;
    }
    
    // Validate form before submission
    if (!validateContactForm()) {
        console.log('Form validation failed');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    console.log('Form data collected:', formData);
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formSubmitted = true;
    
    // Simulate form submission delay (in real app, this would be an API call)
    setTimeout(() => {
        // Save feedback to localStorage
        const existingFeedback = getFromStorage('contactFeedback') || [];
        existingFeedback.unshift(formData);
        
        // Keep only last 50 submissions
        if (existingFeedback.length > 50) {
            existingFeedback.splice(50);
        }
        
        setToStorage('contactFeedback', existingFeedback);
        
        // Show success message
        document.getElementById('successMessage').classList.add('show');
        
        // Clear form
        document.getElementById('contactForm').reset();
        document.getElementById('charCount').textContent = '0';
        
        // Clear validation states
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        formSubmitted = false;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            document.getElementById('successMessage').classList.remove('show');
        }, 5000);
        
        console.log('Form submitted successfully');
        
    }, 2000); // 2 second simulated delay
}

/* FAQ Functions */

// Toggle individual FAQ item
function toggleFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const question = faqItems[index].querySelector('.faq-question');
    const answer = faqItems[index].querySelector('.faq-answer');
    const icon = question.querySelector('.faq-icon');
    
    // Toggle state
    faqStates[index] = !faqStates[index];
    
    if (faqStates[index]) {
        // Open FAQ
        question.classList.add('active');
        answer.classList.add('active');
        icon.textContent = '−';
        
        // Close other FAQs (accordion behavior)
        faqStates.forEach((state, i) => {
            if (i !== index && state) {
                toggleFAQ(i);
            }
        });
    } else {
        // Close FAQ
        question.classList.remove('active');
        answer.classList.remove('active');
        icon.textContent = '+';
    }
    
    console.log(`FAQ ${index} ${faqStates[index] ? 'opened' : 'closed'}`);
}


/* Mobile Navigation Functions */
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* Accessibility Enhancements */
function initAccessibility() {
    // Add keyboard navigation for FAQ items
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(index);
                question.setAttribute('aria-expanded', faqStates[index].toString());
            }
        });
    });
    
    // Form field descriptions for screen readers
    document.getElementById('contactName').setAttribute('aria-describedby', 'nameError');
    document.getElementById('contactEmail').setAttribute('aria-describedby', 'emailError');
    document.getElementById('contactMessage').setAttribute('aria-describedby', 'messageError charCount');
    
    console.log('Accessibility enhancements applied');
}

/* Contact History Management */
function displayContactHistory() {
    const history = getFromStorage('contactFeedback') || [];
    console.log(`Contact history: ${history.length} submissions stored`);
    
    // Could display recent submissions for returning users
    // This is just for demonstration - wouldn't be shown in production
    if (history.length > 0) {
        console.log('Most recent submission:', history[0]);
    }
}

// ----------- Newsletter Subscription ------------
function initNewsletterSubscription() {
  const form = document.getElementById("newsletterForm");
  const input = document.getElementById("newsletterEmail");

  if (!form || !input) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = input.value.trim();
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Get existing subscribers or empty array
    const subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

    // Check if email already subscribed
    if (subscribers.includes(email)) {
      alert("This email is already subscribed.");
      return;
    }

    subscribers.push(email);
    localStorage.setItem("subscribers", JSON.stringify(subscribers));

    alert("Thank you for subscribing!");

    form.reset();
  });
}

function validateEmail(email) {
  // Simple regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Initialize Page When DOM Loads */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page loaded successfully');
    
    // Initialize all functionality
    initMobileNavigation();        // Setup mobile menu
    setupRealTimeValidation();    // Setup form validation
    initAccessibility();          // Setup accessibility features
    displayContactHistory();      // Load contact history
    initNewsletterSubscription();
    
    // Setup form submission handler
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmission);
    
    // Setup character counter
    document.getElementById('contactMessage').addEventListener('input', () => {
        const length = document.getElementById('contactMessage').value.length;
        document.getElementById('charCount').textContent = length;
    });
    
    console.log('All contact page functions initialized');
});

/* Global functions for inline event handlers */
window.toggleFAQ = toggleFAQ;

/* Auto-save form data as user types (for better UX) */
function setupAutoSave() {
    const formFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        // Load saved data
        const savedValue = getFromStorage(`contactForm_${fieldId}`);
        if (savedValue && !formSubmitted) {
            field.value = savedValue;
            if (fieldId === 'contactMessage') {
                document.getElementById('charCount').textContent = savedValue.length;
            }
        }
        
        // Save data as user types
        field.addEventListener('input', () => {
            setToStorage(`contactForm_${fieldId}`, field.value);
        });
    });
    
    console.log('Auto-save functionality enabled');
}

// Initialize auto-save after DOM loads
document.addEventListener('DOMContentLoaded', setupAutoSave);
