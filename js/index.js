// ----------- Health Tip of the Day ------------
const healthTips = [
  "Drink at least 8 glasses of water daily.",
  "Eat a variety of fruits and vegetables.",
  "Avoid excessive sugar and salt intake.",
  "Practice mindfulness and reduce stress.",
  "Take regular breaks during work to move around."
];

// Function to display today's health tip based on the day of the year
function showDailyHealthTip() {
  const tipElement = document.getElementById("dailyHealthTip");
  if (!tipElement) return;

  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Use dayOfYear modulo healthTips length to cycle through tips
  const tipIndex = dayOfYear % healthTips.length;
  tipElement.textContent = healthTips[tipIndex];
}

// ----------- Auto-Rotating Health Slogans ------------
const slogans = [
  "Eat well, live well.",
  "Health is wealth.",
  "Move more, sit less.",
  "Stay hydrated, stay healthy.",
  "Your body deserves the best."
];

let sloganIndex = 0;

function rotateSlogans() {
  const sloganElement = document.getElementById("heroSlogan");
  if (!sloganElement) return;

  sloganElement.textContent = slogans[sloganIndex];
  sloganIndex = (sloganIndex + 1) % slogans.length;
}

// Rotate slogans every 4 seconds
function startSloganRotation() {
  rotateSlogans();
  setInterval(rotateSlogans, 4000);
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

document.addEventListener("DOMContentLoaded", () => {
  showDailyHealthTip();
  startSloganRotation();
  initNewsletterSubscription();

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
});
