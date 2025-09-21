/* JavaScript for Mindfulness Page Functionality */

// Global variables for session management
let breathingInterval = null;
let breathingActive = false;
let breathingCycle = 'prepare'; // prepare, inhale, hold, exhale
let breathingStep = 0;

let meditationInterval = null;
let meditationActive = false;
let meditationTimeLeft = 300; // 5 minutes default
let meditationTotalTime = 300;
let meditationPaused = false;

let ambientAudio = null;

/* Utility Functions */

// Local storage helper functions for session tracking
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

// Format time display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get today's date as string for session tracking
function getTodayString() {
    return new Date().toDateString();
}

// Update daily session counts
function updateSessionCount(sessionType) {
    const today = getTodayString();
    const sessionData = getFromStorage('mindfulnessSessions') || {};

    if (!sessionData[today]) {
        sessionData[today] = { breathing: 0, meditation: 0 };
    }

    sessionData[today][sessionType]++;
    setToStorage('mindfulnessSessions', sessionData);

    // Update display
    const countElement = document.getElementById(`${sessionType}SessionCount`);
    countElement.textContent = sessionData[today][sessionType];
}

// Load today's session counts
function loadSessionCounts() {
    const today = getTodayString();
    const sessionData = getFromStorage('mindfulnessSessions') || {};
    const todayData = sessionData[today] || { breathing: 0, meditation: 0 };

    document.getElementById('breathingSessionCount').textContent = todayData.breathing;
    document.getElementById('meditationSessionCount').textContent = todayData.meditation;
}

/* Breathing Exercise Functions */

const breathingPattern = {
    prepare: { duration: 2, text: 'Get Ready', instruction: 'Prepare to breathe deeply' },
    inhale: { duration: 4, text: 'Inhale', instruction: 'Breathe in slowly through your nose' },
    hold: { duration: 7, text: 'Hold', instruction: 'Hold your breath gently' },
    exhale: { duration: 8, text: 'Exhale', instruction: 'Breathe out slowly through your mouth' }
};

function startBreathingExercise() {
    if (breathingActive) return;

    breathingActive = true;
    breathingCycle = 'prepare';
    breathingStep = 0;

    const circle = document.getElementById('breathingCircle');
    circle.classList.add('active');

    document.getElementById('startBreathing').disabled = true;
    document.getElementById('stopBreathing').disabled = false;

    breathingInterval = setInterval(updateBreathingCycle, 1000);
    updateBreathingCycle();
}

function updateBreathingCycle() {
    const currentPhase = breathingPattern[breathingCycle];
    const circle = document.getElementById('breathingCircle');
    const textElement = document.getElementById('breathingText');
    const instructionElement = document.getElementById('breathingInstruction');

    textElement.textContent = currentPhase.text;
    instructionElement.textContent = currentPhase.instruction;

    if (breathingCycle === 'inhale') {
        circle.classList.add('inhale');
        circle.classList.remove('exhale');
    } else if (breathingCycle === 'exhale') {
        circle.classList.add('exhale');
        circle.classList.remove('inhale');
    } else {
        circle.classList.remove('inhale', 'exhale');
    }

    breathingStep++;

    if (breathingStep >= currentPhase.duration) {
        breathingStep = 0;
        switch (breathingCycle) {
            case 'prepare': breathingCycle = 'inhale'; break;
            case 'inhale': breathingCycle = 'hold'; break;
            case 'hold': breathingCycle = 'exhale'; break;
            case 'exhale': breathingCycle = 'inhale'; break;
        }
    }
}

function stopBreathingExercise() {
    if (!breathingActive) return;

    clearInterval(breathingInterval);
    breathingActive = false;

    const circle = document.getElementById('breathingCircle');
    circle.classList.remove('active', 'inhale', 'exhale');

    document.getElementById('breathingText').textContent = 'Click to Start';
    document.getElementById('breathingInstruction').textContent = 'Great job! You completed a breathing session.';
    document.getElementById('startBreathing').disabled = false;
    document.getElementById('stopBreathing').disabled = true;

    document.getElementById('breathingComplete').classList.add('show');
    setTimeout(() => {
        document.getElementById('breathingComplete').classList.remove('show');
    }, 3000);

    updateSessionCount('breathing');
}

/* Meditation Timer Functions */

function setMeditationTime(event, minutes = 5) {
    if (meditationActive) return;

    meditationTimeLeft = minutes * 60;
    meditationTotalTime = minutes * 60;

    document.getElementById('meditationTimer').textContent = formatTime(meditationTimeLeft);
    document.getElementById('progressText').textContent = 'Ready';
    updateMeditationProgress();

    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function startMeditationTimer() {
    if (meditationActive && !meditationPaused) return;

    if (meditationPaused) meditationPaused = false;
    else meditationActive = true;

    if (meditationTimeLeft === 0) meditationTimeLeft = meditationTotalTime;

    document.getElementById('startMeditation').disabled = true;
    document.getElementById('pauseMeditation').disabled = false;
    document.getElementById('resetMeditation').disabled = false;
    document.getElementById('progressText').textContent = 'Meditating';

    meditationInterval = setInterval(updateMeditationTimer, 1000);
    playMeditationChime('start');
}

function updateMeditationTimer() {
    if (meditationPaused) return;
    meditationTimeLeft--;
    document.getElementById('meditationTimer').textContent = formatTime(meditationTimeLeft);
    updateMeditationProgress();

    if (meditationTimeLeft <= 0) completeMeditation();
}

function pauseMeditationTimer() {
    if (!meditationActive) return;

    meditationPaused = !meditationPaused;
    const pauseBtn = document.getElementById('pauseMeditation');

    if (meditationPaused) {
        pauseBtn.textContent = 'Resume';
        document.getElementById('progressText').textContent = 'Paused';
    } else {
        pauseBtn.textContent = 'Pause';
        document.getElementById('progressText').textContent = 'Meditating';
    }
}

function resetMeditationTimer() {
    clearInterval(meditationInterval);
    meditationActive = false;
    meditationPaused = false;
    meditationTimeLeft = meditationTotalTime;

    document.getElementById('meditationTimer').textContent = formatTime(meditationTimeLeft);
    document.getElementById('startMeditation').disabled = false;
    document.getElementById('pauseMeditation').disabled = true;
    document.getElementById('pauseMeditation').textContent = 'Pause';
    document.getElementById('resetMeditation').disabled = true;
    document.getElementById('progressText').textContent = 'Ready';

    updateMeditationProgress();
}

function completeMeditation() {
    clearInterval(meditationInterval);
    meditationActive = false;
    meditationTimeLeft = 0;

    document.getElementById('meditationTimer').textContent = '00:00';
    document.getElementById('startMeditation').disabled = false;
    document.getElementById('pauseMeditation').disabled = true;
    document.getElementById('progressText').textContent = 'Complete';

    updateMeditationProgress();
    playMeditationChime('complete');

    document.getElementById('meditationComplete').classList.add('show');
    setTimeout(() => {
        document.getElementById('meditationComplete').classList.remove('show');
    }, 4000);

    updateSessionCount('meditation');

    setTimeout(() => {
        meditationTimeLeft = meditationTotalTime;
        document.getElementById('meditationTimer').textContent = formatTime(meditationTimeLeft);
        document.getElementById('progressText').textContent = 'Ready';
        updateMeditationProgress();
    }, 5000);
}

function updateMeditationProgress() {
    const progressCircle = document.getElementById('meditationProgress');
    const progress = ((meditationTotalTime - meditationTimeLeft) / meditationTotalTime) * 360;
    progressCircle.style.background = `conic-gradient(var(--primary-green) ${progress}deg, #e5e7eb ${progress}deg)`;
}

function playMeditationChime(type = 'start') {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'start':
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
                break;
            case 'complete':
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                break;
        }

        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('Audio context not available:', e);
    }
}

/* Ambient Sound Functions */

function toggleAmbientSound(soundType) {
    const soundBtns = document.querySelectorAll('.sound-btn');

    if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
    }

    if (soundType === 'silence') {
        ambientAudio = null;
    } else {
        let file = '';
        if (soundType === 'rain') file = 'sounds/rain.mp3';
        if (soundType === 'forest') file = 'sounds/forest.mp3';
        ambientAudio = new Audio(file);
        ambientAudio.loop = true;
        ambientAudio.play().catch(err => console.log("Autoplay blocked:", err));
    }

    soundBtns.forEach(btn => btn.classList.remove('active'));
    if (soundType !== 'silence') {
        document.querySelector(`.sound-btn[data-sound="${soundType}"]`).classList.add('active');
    }
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

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* Event Listeners Setup */
function initEventListeners() {
    document.getElementById('startBreathing').addEventListener('click', startBreathingExercise);
    document.getElementById('stopBreathing').addEventListener('click', stopBreathingExercise);
    document.getElementById('startMeditation').addEventListener('click', startMeditationTimer);
    document.getElementById('pauseMeditation').addEventListener('click', pauseMeditationTimer);
    document.getElementById('resetMeditation').addEventListener('click', resetMeditationTimer);

    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleAmbientSound(btn.dataset.sound));
    });

    document.getElementById('breathingCircle').addEventListener('click', () => {
        if (!breathingActive) startBreathingExercise();
    });
}

function cleanup() {
    if (breathingActive) stopBreathingExercise();
    if (meditationActive) resetMeditationTimer();
    if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
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

/* Initialize Page */
window.addEventListener('DOMContentLoaded', () => {
    loadSessionCounts();
    initEventListeners();
    initMobileNavigation();
    initNewsletterSubscription();
});
