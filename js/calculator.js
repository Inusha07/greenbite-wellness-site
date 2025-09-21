// GreenBite Calculator - Assignment Requirements Only
// Simple implementation for beginners

// --- Configuration Data (No external JSON needed) ---
const CALC_CONFIG = {
    // Form validation ranges
    age: { min: 1, max: 120 },
    height: { min: 100, max: 250 },
    weight: { min: 20, max: 300 },
    
    // Macro percentages as per assignment
    macros: {
        carbs: 0.50,    // 50%
        protein: 0.20,  // 20%
        fat: 0.30       // 30%
    },
    
    // Activity factors as per assignment (matching HTML values)
    activityFactors: {
        '1.2': 1.2,
        '1.375': 1.375,
        '1.55': 1.55,
        '1.725': 1.725,
        '1.9': 1.9
    }
};

// --- Form Validation (Assignment Requirement) ---
function validateField(fieldId, value, min, max, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    if (!value || value < min || value > max) {
        field.classList.add('error');
        errorDiv.style.display = 'block';
        errorDiv.textContent = errorMessage;
        return false;
    } else {
        field.classList.remove('error');
        errorDiv.style.display = 'none';
        return true;
    }
}

function validateForm() {
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const gender = document.getElementById('gender').value;
    const activity = document.getElementById('activity').value;

    let isValid = true;

    // Validate each field using config
    isValid &= validateField('age', age, CALC_CONFIG.age.min, CALC_CONFIG.age.max, 'Please enter age between 1-120');
    isValid &= validateField('height', height, CALC_CONFIG.height.min, CALC_CONFIG.height.max, 'Please enter height between 100-250 cm');
    isValid &= validateField('weight', weight, CALC_CONFIG.weight.min, CALC_CONFIG.weight.max, 'Please enter weight between 20-300 kg');
    
    // Validate select fields
    if (!gender) {
        document.getElementById('gender').classList.add('error');
        document.getElementById('genderError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('gender').classList.remove('error');
        document.getElementById('genderError').style.display = 'none';
    }
    
    if (!activity) {
        document.getElementById('activity').classList.add('error');
        document.getElementById('activityError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('activity').classList.remove('error');
        document.getElementById('activityError').style.display = 'none';
    }

    return Boolean(isValid);
}

// --- BMR Calculation (Assignment Formula) ---
function calculateBMR(weight, height, age, gender) {
    let bmr;
    if (gender === 'male') {
        // Male formula from assignment
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        // Female formula from assignment
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return Math.round(bmr);
}

// --- TDEE Calculation (Assignment Formula) ---
function calculateTDEE(bmr, activityLevel) {
    const factor = CALC_CONFIG.activityFactors[activityLevel];
    return Math.round(bmr * factor);
}

// --- Macronutrient Calculation (Assignment Formula) ---
function calculateMacros(tdee) {
    return {
        // Carbs: 50%, 4 kcal per gram
        carbs: Math.round((tdee * CALC_CONFIG.macros.carbs) / 4),
        carbsCalories: Math.round(tdee * CALC_CONFIG.macros.carbs),
        
        // Protein: 20%, 4 kcal per gram
        protein: Math.round((tdee * CALC_CONFIG.macros.protein) / 4),
        proteinCalories: Math.round(tdee * CALC_CONFIG.macros.protein),
        
        // Fat: 30%, 9 kcal per gram
        fat: Math.round((tdee * CALC_CONFIG.macros.fat) / 9),
        fatCalories: Math.round(tdee * CALC_CONFIG.macros.fat)
    };
}

// --- Display Results (Assignment Requirement: Progress bars or animated counters) ---
function animateNumber(element, targetValue, suffix = '') {
    let current = 0;
    const increment = targetValue / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 20);
}

function displayResults(bmr, tdee, macros) {
    const resultsSection = document.getElementById('calculatorResults');
    resultsSection.classList.add('show');

    // Animate BMR and TDEE (Assignment: animated counters)
    animateNumber(document.getElementById('bmrResult'), bmr, ' calories/day');
    animateNumber(document.getElementById('tdeeResult'), tdee, ' calories/day');

    // Animate macros with delay
    setTimeout(() => {
        animateNumber(document.getElementById('carbsGrams'), macros.carbs, 'g');
        animateNumber(document.getElementById('proteinGrams'), macros.protein, 'g');
        animateNumber(document.getElementById('fatGrams'), macros.fat, 'g');

        // Update calorie displays
        document.getElementById('carbsCalories').textContent = macros.carbsCalories + ' calories';
        document.getElementById('proteinCalories').textContent = macros.proteinCalories + ' calories';
        document.getElementById('fatCalories').textContent = macros.fatCalories + ' calories';
    }, 500);

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Main Form Handler (Assignment Requirement) ---
function handleFormSubmission(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Get form data
    const formData = {
        age: parseInt(document.getElementById('age').value),
        height: parseInt(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        gender: document.getElementById('gender').value,
        activityLevel: document.getElementById('activity').value
    };

    console.log('Form data:', formData); // Debug log

    // Show loading state
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.textContent = 'Calculating...';
    calculateBtn.disabled = true;

    // Calculate with small delay for better UX
    setTimeout(() => {
        // Perform calculations using assignment formulas
        const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.gender);
        const tdee = calculateTDEE(bmr, formData.activityLevel);
        const macros = calculateMacros(tdee);

        console.log('Results:', { bmr, tdee, macros }); // Debug log

        // Display results
        displayResults(bmr, tdee, macros);

        // Reset button
        calculateBtn.textContent = 'Calculate My Nutrition Needs';
        calculateBtn.disabled = false;

    }, 1000);
}

// --- Mobile Navigation (Assignment: animated hamburger menu) ---
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// --- Real-time Validation (Assignment: Form validation) ---
function setupRealTimeValidation() {
    const fields = ['age', 'height', 'weight', 'gender', 'activity'];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Clear error on input
            field.addEventListener('input', () => {
                field.classList.remove('error');
                const errorDiv = document.getElementById(fieldId + 'Error');
                if (errorDiv) errorDiv.style.display = 'none';
            });
        }
    });
}

// --- Clear Form Function ---
function clearForm() {
    document.getElementById('calculatorForm').reset();
    document.getElementById('calculatorResults').classList.remove('show');

    // Clear validation states
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.classList.remove('error', 'success');
    });

    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
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

// --- Initialize Calculator (Assignment: DOM manipulation) ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('GreenBite calculator loaded');

    // Initialize components
    initMobileNavigation();
    setupRealTimeValidation();
    initNewsletterSubscription();

    // Setup form submission
    const form = document.getElementById('calculatorForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }

    console.log('Calculator initialized successfully');
});

// --- Global Functions ---
window.clearCalculatorForm = clearForm;