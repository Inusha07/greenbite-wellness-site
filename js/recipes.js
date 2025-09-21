const recipeData = [
    {
        id: 1,
        title: "Milk Rice",
        category: "breakfast",
        description: "Traditional Sri Lankan breakfast made with coconut milk and rice",
        icon: "./recipes_img/milkrice.jpg",
        ingredients: [
            "2 cups white rice",
            "2 cups thick coconut milk",
            "1 cup water",
            "1 tsp salt"
        ],
        steps: [
            "Wash rice well and place in a pot with water",
            "Cook until water is absorbed",
            "Add coconut milk and salt, stir and cook on low heat",
            "Simmer until rice is soft and creamy",
            "Spread on a tray, flatten, and cut into diamond shapes",
            "Serve warm with lunu miris (spicy sambol)"
        ],
        nutrition: {
            calories: 320,
            protein: "6g",
            carbs: "55g",
            fat: "10g",
            fiber: "2g"
        }
    },
    {
        id: 2,
        title: "Rice and Curry",
        category: "lunch",
        description: "A balanced Sri Lankan lunch with rice, dhal, vegetables, and curry",
        icon: "./recipes_img/rice&curry.png",
        ingredients: [
            "2 cups rice",
            "1 cup dhal curry",
            "1 cup vegetable curry",
            "1 cup chicken/fish curry",
            "1 coconut sambol",
            "Papadam (optional)"
        ],
        steps: [
            "Cook rice until soft and fluffy",
            "Prepare dhal curry with lentils and coconut milk",
            "Make vegetable curry with seasonal vegetables",
            "Cook chicken or fish curry with spices",
            "Serve rice with all curries, sambol, and papadam"
        ],
        nutrition: {
            calories: 600,
            protein: "20g",
            carbs: "95g",
            fat: "18g",
            fiber: "8g"
        }
    },
    {
        id: 3,
        title: "Fish Ambul Thiyal",
        category: "dinner",
        description: "A sour Sri Lankan fish curry with goraka and spices",
        icon: "./recipes_img/fishambul.jpg",
        ingredients: [
            "500g firm fish (tuna or similar)",
            "5-6 goraka pieces (gambooge)",
            "2 tbsp roasted curry powder",
            "1 onion sliced",
            "2 cloves garlic",
            "1 piece ginger",
            "2 green chilies",
            "1 tsp turmeric",
            "Salt to taste"
        ],
        steps: [
            "Cut fish into cubes and wash well",
            "Soak goraka in warm water and make a paste",
            "Marinate fish with goraka, curry powder, turmeric, and salt",
            "Cook with onion, garlic, ginger, and green chilies",
            "Simmer on low heat without stirring until fish is cooked",
            "Serve with rice or string hoppers"
        ],
        nutrition: {
            calories: 350,
            protein: "32g",
            carbs: "8g",
            fat: "20g",
            fiber: "3g"
        }
    },
    {
        id: 4,
        title: "Kokis",
        category: "snack",
        description: "A crispy and crunchy deep-fried Sri Lankan festive snack",
        icon: "./recipes_img/kokis.jpg",
        ingredients: [
            "2 cups rice flour",
            "1 egg",
            "1 1/2 cups thick coconut milk",
            "1/2 tsp turmeric powder",
            "1/2 tsp salt",
            "Oil for deep frying"
        ],
        steps: [
            "Mix rice flour, egg, coconut milk, turmeric, and salt into a smooth batter",
            "Heat oil in a deep pan",
            "Dip kokis mold into oil, then dip into batter without covering the top",
            "Dip mold back into hot oil and shake gently until kokis releases",
            "Fry until golden brown and crispy",
            "Cool and store in airtight container"
        ],
        nutrition: {
            calories: 150,
            protein: "2g",
            carbs: "18g",
            fat: "8g",
            fiber: "1g"
        }
    },
    {
        id: 5,
        title: "Hoppers",
        category: "dinner",
        description: "Sri Lankan bowl-shaped pancakes made with rice flour and coconut milk",
        icon: "./recipes_img/hoppers.jpg",
        ingredients: [
            "2 cups rice flour",
            "1 cup coconut milk",
            "1 tsp sugar",
            "1/2 tsp salt",
            "1/2 tsp yeast",
            "Warm water as needed"
        ],
        steps: [
            "Mix rice flour, coconut milk, sugar, salt, and yeast",
            "Add warm water gradually to make a smooth batter",
            "Leave to ferment for 6-8 hours",
            "Heat a hopper pan and grease lightly",
            "Pour a ladle of batter and swirl pan to form thin edges",
            "Cover and cook until edges are crispy",
            "Serve with lunu miris or curry"
        ],
        nutrition: {
            calories: 180,
            protein: "4g",
            carbs: "30g",
            fat: "5g",
            fiber: "2g"
        }
    },
    {
        id: 6,
        title: "Watalappan",
        category: "dessert",
        description: "A rich Sri Lankan dessert made with jaggery, coconut milk, and spices",
        icon: "./recipes_img/watalappan.jpg",
        ingredients: [
            "250g jaggery (palm sugar)",
            "1 cup thick coconut milk",
            "4 eggs",
            "1/4 tsp cardamom powder",
            "1/4 tsp nutmeg powder",
            "1/4 cup cashew nuts (optional)"
        ],
        steps: [
            "Melt jaggery with a little water and strain",
            "Whisk eggs lightly in a bowl",
            "Mix in coconut milk, melted jaggery, cardamom, and nutmeg",
            "Pour into a baking dish and sprinkle cashews on top",
            "Steam or bake in water bath until set",
            "Cool before serving"
        ],
        nutrition: {
            calories: 280,
            protein: "6g",
            carbs: "32g",
            fat: "14g",
            fiber: "1g"
        }
    }
];

let filteredRecipes = [...recipeData]; // Copy of recipes for filtering
let currentModal = null; // Track current modal state

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

// Create HTML for individual recipe card
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card fade-in" data-recipe-id="${recipe.id}" onclick="openRecipeModal(${recipe.id})">
            <div class="recipe-image">
                <img src="${recipe.icon}" alt="${recipe.title}" class="recipe-img-icon">
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <span class="recipe-category">${recipe.category}</span>
            </div>
        </div>
    `;
}

// Render all recipe cards to the grid
function renderRecipes(recipes) {
    const recipeGrid = document.getElementById('recipeGrid');
    const noResults = document.getElementById('noResults');

    if (recipes.length === 0) {
        recipeGrid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        recipeGrid.innerHTML = recipes.map(createRecipeCard).join('');
    }
}

/* Search and Filter Functions */

// Filter recipes based on search term and category
function filterRecipes() {
    const searchTerm = document.getElementById('recipeSearch').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('categoryFilter').value;

    filteredRecipes = recipeData.filter(recipe => {
        const matchesSearch =
            searchTerm === '' ||
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(searchTerm)
            );

        const matchesCategory =
            selectedCategory === '' || recipe.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    console.log(`Filtered recipes: ${filteredRecipes.length} results`);
    renderRecipes(filteredRecipes);
}

/* Modal Functions */

// Create and display detailed recipe modal
function openRecipeModal(recipeId) {
    const recipe = recipeData.find(r => r.id === recipeId);
    if (!recipe) {
        console.error('Recipe not found:', recipeId);
        return;
    }

    const modalContent = document.getElementById('modalContent');

    const ingredientsList = recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
    const stepsList = recipe.steps.map(step => `<li>${step}</li>`).join('');

    modalContent.innerHTML = `
        <div class="recipe-details">
            <div style="text-align: center; margin-bottom: 1rem;">
                <img src="${recipe.icon}" alt="${recipe.title}" style="width: 150px; height: auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h3>${recipe.title}</h3>
                <p style="color: var(--text-light); margin-top: 0.5rem;">${recipe.description}</p>
            </div>


            <div class="ingredients-section">
                <h4>Ingredients</h4>
                <ul class="ingredients-list">
                    ${ingredientsList}
                </ul>
            </div>

            <div class="steps-section">
                <h4>Instructions</h4>
                <ol class="steps-list">
                    ${stepsList}
                </ol>
            </div>

            <div class="nutrition-section">
                <h4>Nutrition Information</h4>
                <table class="nutrition-table">
                    <thead>
                        <tr><th>Nutrient</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Calories</td><td>${recipe.nutrition.calories}</td></tr>
                        <tr><td>Protein</td><td>${recipe.nutrition.protein}</td></tr>
                        <tr><td>Carbohydrates</td><td>${recipe.nutrition.carbs}</td></tr>
                        <tr><td>Fat</td><td>${recipe.nutrition.fat}</td></tr>
                        <tr><td>Fiber</td><td>${recipe.nutrition.fiber}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const modal = document.getElementById('recipeModal');
    modal.style.display = 'block';
    currentModal = recipeId;
    document.body.style.overflow = 'hidden';

    console.log(`Opened modal for recipe: ${recipe.title}`);
}

// Close recipe modal
function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
    currentModal = null;
    document.body.style.overflow = 'auto';
    console.log('Modal closed');
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
    let searchTimeout;
    document.getElementById('recipeSearch').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterRecipes, 300);
    });

    document.getElementById('categoryFilter').addEventListener('change', filterRecipes);
    document.getElementById('modalClose').addEventListener('click', closeRecipeModal);

    document.getElementById('recipeModal').addEventListener('click', (e) => {
        if (e.target.id === 'recipeModal') {
            closeRecipeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeRecipeModal();
        }
    });

    console.log('All event listeners initialized');
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
document.addEventListener('DOMContentLoaded', function () {
    console.log('Recipe page loaded successfully');
    renderRecipes(recipeData);
    initEventListeners();
    initMobileNavigation();
    initNewsletterSubscription();
    console.log(`Loaded ${recipeData.length} recipes`);
});

// Make functions globally available for onclick handlers
window.openRecipeModal = openRecipeModal;
window.closeRecipeModal = closeRecipeModal;
