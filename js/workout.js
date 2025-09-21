/* JavaScript for Workout Generator */
        
// Simplified workout exercise database - FIXED VERSION
        const workoutDatabase = {
            arms: {
                none: [
                    { name: "Push-ups", duration: [30, 45, 60], description: "Classic push-ups for chest, shoulders, and triceps", calories: 8 },
                    { name: "Tricep Dips", duration: [30, 45, 60], description: "Using chair or bench for tricep strength", calories: 6 },
                    { name: "Arm Circles", duration: [30, 45, 60], description: "Small and large forward/backward circles", calories: 4 },
                    { name: "Plank to Push-up", duration: [30, 45, 60], description: "Transition from plank to push-up position", calories: 7 }
                ],
                dumbbells: [
                    { name: "Bicep Curls", duration: [30, 45, 60], description: "Controlled bicep curls with proper form", calories: 5 },
                    { name: "Overhead Press", duration: [30, 45, 60], description: "Press weights overhead for shoulder strength", calories: 6 },
                    { name: "Hammer Curls", duration: [30, 45, 60], description: "Neutral grip curls for bicep and forearm", calories: 5 }
                ],
                bodyweight: [
                    { name: "Diamond Push-ups", duration: [30, 45, 60], description: "Close-grip push-ups for triceps", calories: 9 },
                    { name: "Pike Push-ups", duration: [30, 45, 60], description: "Downward dog push-ups for shoulders", calories: 7 }
                ]
            },
            legs: {
                none: [
                    { name: "Squats", duration: [30, 45, 60], description: "Bodyweight squats with proper depth", calories: 8 },
                    { name: "Lunges", duration: [30, 45, 60], description: "Alternating forward lunges", calories: 7 },
                    { name: "Calf Raises", duration: [30, 45, 60], description: "Rise up on toes, lower slowly", calories: 4 },
                    { name: "Wall Sit", duration: [30, 45, 60], description: "Hold sitting position against wall", calories: 6 }
                ],
                dumbbells: [
                    { name: "Goblet Squats", duration: [30, 45, 60], description: "Hold weight at chest while squatting", calories: 9 },
                    { name: "Romanian Deadlifts", duration: [30, 45, 60], description: "Hip hinge movement with weights", calories: 8 }
                ],
                bodyweight: [
                    { name: "Jump Squats", duration: [30, 45, 60], description: "Explosive jumping squats", calories: 10 },
                    { name: "Single Leg Glute Bridges", duration: [30, 45, 60], description: "One leg hip bridges", calories: 6 }
                ]
            },
            chest: {
                none: [
                    { name: "Push-ups", duration: [30, 45, 60], description: "Standard chest-focused push-ups", calories: 8 },
                    { name: "Wide Push-ups", duration: [30, 45, 60], description: "Push-ups with wider hand position", calories: 8 },
                    { name: "Incline Push-ups", duration: [30, 45, 60], description: "Hands elevated on chair or bench", calories: 6 }
                ],
                dumbbells: [
                    { name: "Chest Press", duration: [30, 45, 60], description: "Lying chest press with dumbbells", calories: 7 },
                    { name: "Chest Flys", duration: [30, 45, 60], description: "Lying chest flys with controlled motion", calories: 6 }
                ],
                bodyweight: [
                    { name: "Decline Push-ups", duration: [30, 45, 60], description: "Feet elevated push-ups", calories: 10 }
                ]
            },
            fullbody: {
                none: [
                    { name: "Burpees", duration: [30, 45, 60], description: "Full body explosive movement", calories: 12 },
                    { name: "Mountain Climbers", duration: [30, 45, 60], description: "Running motion in plank position", calories: 9 },
                    { name: "Jumping Jacks", duration: [30, 45, 60], description: "Classic full-body cardio exercise", calories: 8 },
                    { name: "High Knees", duration: [30, 45, 60], description: "Running in place with high knees", calories: 8 }
                ],
                dumbbells: [
                    { name: "Thrusters", duration: [30, 45, 60], description: "Squat to overhead press with weights", calories: 11 },
                    { name: "Man Makers", duration: [30, 45, 60], description: "Complex full-body exercise with weights", calories: 13 }
                ],
                bodyweight: [
                    { name: "Squat to Press", duration: [30, 45, 60], description: "Squat with overhead arm movement", calories: 9 },
                    { name: "Bear Crawls", duration: [30, 45, 60], description: "Crawling on hands and feet", calories: 8 }
                ]
            }
        };

        // Global variables for workout state management
        let currentWorkoutExercises = [];
        let currentExerciseIndex = 0;
        let workoutTimer = null;
        let timeRemaining = 0;
        let isPaused = false;
        let totalWorkoutTime = 0;
        let completedExercises = 0;

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

        // Time formatting utility
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Audio feedback for timer
        function playTimerSound(type = 'tick') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                switch(type) {
                    case 'start':
                        oscillator.frequency.value = 800;
                        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                        break;
                    case 'finish':
                        oscillator.frequency.value = 1000;
                        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                        break;
                    case 'warning':
                        oscillator.frequency.value = 600;
                        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                        break;
                    default:
                        oscillator.frequency.value = 400;
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                }
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                console.log('Audio context not available:', e);
            }
        }

        /* UI Interaction Functions - FIXED */

        // Toggle checkbox and visual state
        function toggleCheckbox(checkboxId) {
            const checkbox = document.getElementById(checkboxId);
            const checkboxItem = checkbox.closest('.checkbox-item');
            
            // Toggle checkbox state
            checkbox.checked = !checkbox.checked;
            
            // Toggle visual class
            if (checkbox.checked) {
                checkboxItem.classList.add('selected');
            } else {
                checkboxItem.classList.remove('selected');
            }
            
            console.log(`Toggled ${checkboxId}: ${checkbox.checked}`);
        }

        // Select intensity (radio button)
        function selectIntensity(intensity) {
            // Clear all intensity selections
            document.querySelectorAll('input[name="intensity"]').forEach(radio => {
                radio.checked = false;
                radio.closest('.checkbox-item').classList.remove('selected');
            });
            
            // Select the clicked intensity
            const selectedRadio = document.getElementById(intensity);
            const selectedItem = selectedRadio.closest('.checkbox-item');
            
            selectedRadio.checked = true;
            selectedItem.classList.add('selected');
            
            console.log(`Selected intensity: ${intensity}`);
        }

        /* Workout Generation Functions - FIXED */

        // Generate workout based on user selections
        function generateWorkout() {
            console.log('Starting workout generation...');
            
            // Get selected body parts
            const selectedBodyParts = [];
            document.querySelectorAll('input[name="bodypart"]:checked').forEach(input => {
                selectedBodyParts.push(input.value);
            });
            
            // Get selected equipment
            const selectedEquipment = [];
            document.querySelectorAll('input[name="equipment"]:checked').forEach(input => {
                selectedEquipment.push(input.value);
            });
            
            // Get intensity level
            const intensityElement = document.querySelector('input[name="intensity"]:checked');
            const intensity = intensityElement ? intensityElement.value : 'beginner';
            
            console.log('User selections:', {
                bodyParts: selectedBodyParts,
                equipment: selectedEquipment,
                intensity: intensity
            });

            // Validate selections
            if (selectedBodyParts.length === 0) {
                alert('Please select at least one body part to target!');
                return null;
            }

            if (selectedEquipment.length === 0) {
                alert('Please select at least one equipment option!');
                return null;
            }

            let allExercises = [];

            // Generate exercises for each selected body part
            selectedBodyParts.forEach(bodyPart => {
                console.log(`Processing body part: ${bodyPart}`);
                
                const bodyPartExercises = [];
                
                // Get exercises for each available equipment type
                selectedEquipment.forEach(equipType => {
                    if (workoutDatabase[bodyPart] && workoutDatabase[bodyPart][equipType]) {
                        const exercises = workoutDatabase[bodyPart][equipType];
                        bodyPartExercises.push(...exercises);
                        console.log(`Found ${exercises.length} exercises for ${bodyPart} with ${equipType}`);
                    }
                });

                // Randomly select 2 exercises per body part (or all available if less than 2)
                const exerciseCount = Math.min(2, bodyPartExercises.length);
                const shuffled = [...bodyPartExercises].sort(() => 0.5 - Math.random());
                allExercises.push(...shuffled.slice(0, exerciseCount));
            });

            // Remove duplicates by name
            const uniqueExercises = allExercises.filter((exercise, index, self) => 
                index === self.findIndex(e => e.name === exercise.name)
            );
            
            // Final shuffle
            const finalExercises = uniqueExercises.sort(() => 0.5 - Math.random());

            // Set duration based on intensity
            const durationIndex = intensity === 'beginner' ? 0 : intensity === 'intermediate' ? 1 : 2;
            
            finalExercises.forEach(exercise => {
                exercise.currentDuration = exercise.duration[durationIndex];
            });

            console.log(`Generated workout with ${finalExercises.length} exercises:`, finalExercises);
            
            if (finalExercises.length === 0) {
                alert('No exercises found for your selections. Try different options!');
                return null;
            }

            return finalExercises;
        }

        // Display generated workout exercises
        function displayWorkout(exercises) {
            const exerciseList = document.getElementById('exerciseList');
            const workoutTitle = document.getElementById('workoutTitle');
            
            workoutTitle.textContent = `Your Custom Workout Plan (${exercises.length} exercises)`;
            
            exerciseList.innerHTML = exercises.map((exercise, index) => `
                <div class="exercise-item" data-exercise-index="${index}">
                    <div class="exercise-info">
                        <h4>${exercise.name}</h4>
                        <p>${exercise.description}</p>
                    </div>
                    <div class="exercise-duration">${exercise.currentDuration}s</div>
                </div>
            `).join('');

            const workoutPlan = document.getElementById('workoutPlan');
            workoutPlan.classList.add('show');
            workoutPlan.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            currentWorkoutExercises = exercises;
            currentExerciseIndex = 0;
            completedExercises = 0;
            
            if (exercises.length > 0) {
                timeRemaining = exercises[0].currentDuration;
                updateTimerDisplay();
            }
            
            updateCurrentExerciseDisplay();
            
            console.log('Workout displayed successfully');
        }

        /* Timer Functions - FIXED */

        function startWorkout() {
            if (currentWorkoutExercises.length === 0) {
                alert('Please generate a workout first!');
                return;
            }

            if (currentExerciseIndex < currentWorkoutExercises.length) {
                const currentExercise = currentWorkoutExercises[currentExerciseIndex];
                timeRemaining = currentExercise.currentDuration;
                
                updateCurrentExerciseDisplay();
                updateTimerDisplay();
                
                workoutTimer = setInterval(updateTimer, 1000);
                updateTimerButtons(true);
                
                document.querySelector('.timer-section').classList.add('timer-active');
                playTimerSound('start');
                
                console.log(`Started exercise: ${currentExercise.name} for ${timeRemaining} seconds`);
            }
        }

        function updateTimer() {
            if (isPaused) return;

            timeRemaining--;
            totalWorkoutTime++;
            updateTimerDisplay();

            if (timeRemaining === 5) {
                playTimerSound('warning');
            }

            if (timeRemaining <= 0) {
                completeCurrentExercise();
            }
        }

        function completeCurrentExercise() {
            playTimerSound('finish');
            completedExercises++;
            
            // Mark current exercise as completed
            const exerciseItems = document.querySelectorAll('.exercise-item');
            if (exerciseItems[currentExerciseIndex]) {
                exerciseItems[currentExerciseIndex].classList.add('completed');
                exerciseItems[currentExerciseIndex].classList.remove('current');
            }

            currentExerciseIndex++;

            if (currentExerciseIndex < currentWorkoutExercises.length) {
                const nextExercise = currentWorkoutExercises[currentExerciseIndex];
                timeRemaining = nextExercise.currentDuration;
                updateCurrentExerciseDisplay();
                console.log(`Moving to next exercise: ${nextExercise.name}`);
            } else {
                completeWorkout();
            }
        }

        function completeWorkout() {
            clearInterval(workoutTimer);
            workoutTimer = null;
            
            updateTimerButtons(false);
            document.querySelector('.timer-section').classList.remove('timer-active');
            document.getElementById('currentExercise').textContent = 'Workout Complete!';
            
            const completionMessage = document.getElementById('completionMessage');
            completionMessage.classList.add('show');
            
            updateWorkoutStatistics();
            document.getElementById('workoutStats').classList.remove('hidden');
            
            saveWorkoutToHistory();
            completionMessage.scrollIntoView({ behavior: 'smooth' });
            
            console.log('Workout completed!');
        }

        function pauseWorkout() {
            isPaused = !isPaused;
            const pauseBtn = document.getElementById('pauseTimer');
            
            if (isPaused) {
                pauseBtn.textContent = 'Resume';
                document.querySelector('.timer-section').classList.remove('timer-active');
            } else {
                pauseBtn.textContent = 'Pause';
                document.querySelector('.timer-section').classList.add('timer-active');
            }
        }

        function resetWorkout() {
            clearInterval(workoutTimer);
            workoutTimer = null;
            isPaused = false;
            currentExerciseIndex = 0;
            completedExercises = 0;
            totalWorkoutTime = 0;
            
            if (currentWorkoutExercises.length > 0) {
                timeRemaining = currentWorkoutExercises[0].currentDuration;
                updateTimerDisplay();
            }
            
            updateCurrentExerciseDisplay();
            updateTimerButtons(false);
            
            // Reset exercise highlighting
            document.querySelectorAll('.exercise-item').forEach(item => {
                item.classList.remove('completed', 'current');
            });
            
            document.getElementById('completionMessage').classList.remove('show');
            document.getElementById('workoutStats').classList.add('hidden');
            document.querySelector('.timer-section').classList.remove('timer-active');
        }

        function skipExercise() {
            if (currentExerciseIndex < currentWorkoutExercises.length - 1) {
                completeCurrentExercise();
            } else {
                completeWorkout();
            }
        }

        /* Display Update Functions */

        function updateTimerDisplay() {
            document.getElementById('workoutTimer').textContent = formatTime(timeRemaining);
        }

        function updateCurrentExerciseDisplay() {
            const currentExerciseDiv = document.getElementById('currentExercise');
            
            // Clear previous highlighting
            document.querySelectorAll('.exercise-item').forEach(item => {
                item.classList.remove('current');
            });
            
            if (currentExerciseIndex < currentWorkoutExercises.length) {
                const exercise = currentWorkoutExercises[currentExerciseIndex];
                currentExerciseDiv.innerHTML = `
                    <strong>Current: ${exercise.name}</strong><br>
                    <small>${exercise.description}</small>
                `;
                
                // Highlight current exercise
                const exerciseItems = document.querySelectorAll('.exercise-item');
                if (exerciseItems[currentExerciseIndex]) {
                    exerciseItems[currentExerciseIndex].classList.add('current');
                }
            } else {
                currentExerciseDiv.textContent = 'Click Start to begin your workout';
            }
        }

        function updateTimerButtons(isActive) {
            document.getElementById('startTimer').disabled = isActive;
            document.getElementById('pauseTimer').disabled = !isActive;
            document.getElementById('resetTimer').disabled = false;
            document.getElementById('skipTimer').disabled = !isActive;
            
            if (!isActive) {
                document.getElementById('pauseTimer').textContent = 'Pause';
                isPaused = false;
            }
        }

        function updateWorkoutStatistics() {
            const totalTimeElement = document.getElementById('totalTime');
            const exercisesElement = document.getElementById('exercisesCompleted');
            const caloriesElement = document.getElementById('caloriesBurned');
            
            const totalCalories = currentWorkoutExercises
                .slice(0, completedExercises)
                .reduce((total, exercise) => total + (exercise.calories || 5), 0);
            
            totalTimeElement.textContent = formatTime(totalWorkoutTime);
            exercisesElement.textContent = completedExercises;
            caloriesElement.textContent = totalCalories;
        }

        function saveWorkoutToHistory() {
            const workoutHistory = getFromStorage('workoutHistory') || [];
            
            const workoutRecord = {
                date: new Date().toISOString(),
                exercises: currentWorkoutExercises.slice(0, completedExercises).map(ex => ({
                    name: ex.name,
                    duration: ex.currentDuration,
                    calories: ex.calories
                })),
                totalTime: totalWorkoutTime,
                exercisesCompleted: completedExercises,
                totalCalories: currentWorkoutExercises
                    .slice(0, completedExercises)
                    .reduce((total, exercise) => total + (exercise.calories || 5), 0)
            };
            
            workoutHistory.unshift(workoutRecord);
            if (workoutHistory.length > 20) {
                workoutHistory.splice(20);
            }
            
            setToStorage('workoutHistory', workoutHistory);
            console.log('Workout saved to history');
        }

        /* Form Event Handler */

        function handleWorkoutGeneration(event) {
            event.preventDefault();
            
            const generateBtn = document.getElementById('generateBtn');
            const originalText = generateBtn.textContent;
            
            generateBtn.innerHTML = '<span class="loading"></span> Generating...';
            generateBtn.disabled = true;
            
            if (workoutTimer) {
                resetWorkout();
            }
            
            setTimeout(() => {
                const exercises = generateWorkout();
                
                if (exercises && exercises.length > 0) {
                    displayWorkout(exercises);
                } else {
                    console.log('No exercises generated');
                }
                
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
            }, 1000);
        }

        /* Mobile Navigation */
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

        /* Global Functions */
        window.toggleCheckbox = toggleCheckbox;
        window.selectIntensity = selectIntensity;
        window.generateNewWorkout = function() {
            document.getElementById('completionMessage').classList.remove('show');
            document.getElementById('workoutStats').classList.add('hidden');
            resetWorkout();
            document.querySelector('.workout-form').scrollIntoView({ behavior: 'smooth' });
        };

        /* Initialize Page */
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Workout page loaded successfully');
            
            initMobileNavigation();
            initNewsletterSubscription();
            
            // Set up form submission
            document.getElementById('workoutForm').addEventListener('submit', handleWorkoutGeneration);
            
            // Set up timer controls
            document.getElementById('startTimer').addEventListener('click', startWorkout);
            document.getElementById('pauseTimer').addEventListener('click', pauseWorkout);
            document.getElementById('resetTimer').addEventListener('click', resetWorkout);
            document.getElementById('skipTimer').addEventListener('click', skipExercise);
            
            // Initialize UI state
            updateTimerDisplay();
            updateCurrentExerciseDisplay();
            
            console.log('All workout functions initialized');
        });