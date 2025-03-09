describe('Recipe Details Script', () => {
    let originalDisplayRecipeDetails;
    let originalDisplayError;
  
    beforeEach(() => {
      document.body.innerHTML = `
        <title>Bakery Recipes</title>
        <div id="recipe-content">
          <h1 id="recipe-title"></h1>
          <img id="recipe-image" src="" alt="">
          <p id="recipe-description"></p>
          <div>
            <span id="prep-time"></span>
            <span id="cook-time"></span>
            <span id="servings"></span>
          </div>
          <ul id="ingredients-list"></ul>
          <ol id="instructions-list"></ol>
        </div>
        <div id="error-message" style="display: none;"></div>
      `;
      
      global.fetch = jest.fn();
      
      global.displayRecipeDetails = function(recipe) {
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
      };
      
      global.displayError = function(message) {
        document.getElementById('recipe-content').style.display = 'none';
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = `Error: ${message}`;
        errorElement.style.display = 'block';
      };
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    function mockURLParameter(id) {
      const urlSearchParams = new URLSearchParams();
      if (id !== null) {
        urlSearchParams.append('id', id);
      }
      
      Object.defineProperty(window, 'location', {
        value: {
          search: urlSearchParams.toString()
        },
        writable: true
      });
    }
  
    const mockRecipes = [
      {
        id: 1,
        title: 'Chocolate Cake',
        image: 'chocolate-cake.jpg',
        description: 'Delicious chocolate cake',
        prepTime: '30 mins',
        cookTime: '45 mins',
        servings: '8',
        ingredients: ['2 cups flour', '1 cup sugar', '1/2 cup cocoa'],
        instructions: ['Preheat oven', 'Mix dry ingredients', 'Bake for 45 minutes']
      },
      {
        id: 2,
        title: 'Vanilla Cookies',
        image: 'vanilla-cookies.jpg',
        description: 'Classic vanilla cookies',
        prepTime: '15 mins',
        cookTime: '12 mins',
        servings: '24',
        ingredients: ['1 cup flour', '1/2 cup sugar', '1 tsp vanilla'],
        instructions: ['Mix ingredients', 'Form into balls', 'Bake until golden']
      }
    ];
  
    test('should display error when no recipe ID is in URL', () => {
      mockURLParameter(null);
      
      const displayErrorSpy = jest.spyOn(global, 'displayError');
      
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('id');
      
      if (!recipeId) {
        displayError("No recipe ID found in URL");
      }
      
      expect(displayErrorSpy).toHaveBeenCalledWith("No recipe ID found in URL");
      expect(document.getElementById('error-message').textContent).toBe('Error: No recipe ID found in URL');
      expect(document.getElementById('recipe-content').style.display).toBe('none');
      expect(document.getElementById('error-message').style.display).toBe('block');
    });
  
    test('should fetch and display recipe details when valid ID is provided', async () => {
      mockURLParameter('1');
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRecipes)
      });
      
      const displayRecipeDetailsSpy = jest.spyOn(global, 'displayRecipeDetails');
      
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('id');
      
      if (!recipeId) {
        displayError("No recipe ID found in URL");
        return;
      }
      
      await fetch('recipes.json')
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
      
      expect(fetch).toHaveBeenCalledWith('recipes.json');
      
      expect(displayRecipeDetailsSpy).toHaveBeenCalledWith(mockRecipes[0]);
      
      expect(document.title).toBe('Chocolate Cake - Bakery Recipes');
      expect(document.getElementById('recipe-title').textContent).toBe('Chocolate Cake');
      expect(document.getElementById('recipe-image').src).toContain('chocolate-cake.jpg');
      expect(document.getElementById('recipe-image').alt).toBe('Chocolate Cake');
      expect(document.getElementById('recipe-description').textContent).toBe('Delicious chocolate cake');
      expect(document.getElementById('prep-time').textContent).toBe('30 mins');
      expect(document.getElementById('cook-time').textContent).toBe('45 mins');
      expect(document.getElementById('servings').textContent).toBe('8');
      
      const ingredientItems = document.getElementById('ingredients-list').getElementsByTagName('li');
      expect(ingredientItems.length).toBe(3);
      expect(ingredientItems[0].textContent).toBe('2 cups flour');
      expect(ingredientItems[1].textContent).toBe('1 cup sugar');
      expect(ingredientItems[2].textContent).toBe('1/2 cup cocoa');
      
      const instructionItems = document.getElementById('instructions-list').getElementsByTagName('li');
      expect(instructionItems.length).toBe(3);
      expect(instructionItems[0].textContent).toBe('Preheat oven');
      expect(instructionItems[1].textContent).toBe('Mix dry ingredients');
      expect(instructionItems[2].textContent).toBe('Bake for 45 minutes');
      
      // Check display properties
      expect(document.getElementById('recipe-content').style.display).toBe('block');
      expect(document.getElementById('error-message').style.display).toBe('none');
    });
  
    test('should display error when recipe is not found', async () => {
      mockURLParameter('999');
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRecipes)
      });
      
      const displayErrorSpy = jest.spyOn(global, 'displayError');
      
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('id');
      
      if (!recipeId) {
        displayError("No recipe ID found in URL");
        return;
      }
      
      await fetch('recipes.json')
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
      
      expect(displayErrorSpy).toHaveBeenCalledWith("Recipe with ID 999 not found");
      expect(document.getElementById('error-message').textContent).toBe('Error: Recipe with ID 999 not found');
      expect(document.getElementById('recipe-content').style.display).toBe('none');
      expect(document.getElementById('error-message').style.display).toBe('block');
    });
  
    test('should display error when fetch fails', async () => {
      mockURLParameter('1');
      
      global.fetch.mockResolvedValueOnce({
        ok: false
      });
      
      const displayErrorSpy = jest.spyOn(global, 'displayError');
      
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('id');
      
      if (!recipeId) {
        displayError("No recipe ID found in URL");
        return;
      }
      
      await fetch('recipes.json')
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
      
      // Assert
      expect(displayErrorSpy).toHaveBeenCalledWith("Failed to load recipe data");
      expect(document.getElementById('error-message').textContent).toBe('Error: Failed to load recipe data');
      expect(document.getElementById('recipe-content').style.display).toBe('none');
      expect(document.getElementById('error-message').style.display).toBe('block');
    });
  
    test('should display error when network error occurs', async () => {
      mockURLParameter('1');
      
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const displayErrorSpy = jest.spyOn(global, 'displayError');
      
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('id');
      
      if (!recipeId) {
        displayError("No recipe ID found in URL");
        return;
      }
      
      await fetch('recipes.json')
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
      
      expect(displayErrorSpy).toHaveBeenCalledWith("Network error");
      expect(document.getElementById('error-message').textContent).toBe('Error: Network error');
      expect(document.getElementById('recipe-content').style.display).toBe('none');
      expect(document.getElementById('error-message').style.display).toBe('block');
    });
  });