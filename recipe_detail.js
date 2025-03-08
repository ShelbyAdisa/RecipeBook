document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (!recipeId) {
    displayError("No recipe ID found in URL");
    return;
  }
  
  fetch('recipes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load recipe data');
      }
      return response.json();
    })
    .then(recipes => {
      const recipe = recipes.find(r => r.id == recipeId);
      
      if (!recipe) {
        throw new Error(`Recipe with ID ${recipeId} not found`);
      }
      
      displayRecipeDetails(recipe);
    })
    .catch(error => {
      displayError(error.message);
    });
});

function displayRecipeDetails(recipe) {
  document.title = `${recipe.title} - Bakery Recipes`;
  
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-image').src = recipe.image;
  document.getElementById('recipe-image').alt = recipe.title;
  document.getElementById('recipe-description').textContent = recipe.description;
  
  document.getElementById('prep-time').textContent = recipe.prepTime;
  document.getElementById('cook-time').textContent = recipe.cookTime;
  document.getElementById('servings').textContent = recipe.servings;
  
  const ingredientsList = document.getElementById('ingredients-list');
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    ingredientsList.appendChild(li);
  });
  
  const instructionsList = document.getElementById('instructions-list');
  recipe.instructions.forEach((instruction, index) => {
    const li = document.createElement('li');
    li.textContent = instruction;
    instructionsList.appendChild(li);
  });
  
  document.getElementById('recipe-content').style.display = 'block';
  document.getElementById('error-message').style.display = 'none';
}

function displayError(message) {
  document.getElementById('recipe-content').style.display = 'none';
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = `Error: ${message}`;
  errorElement.style.display = 'block';
}
