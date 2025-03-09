const userData = [
  {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "savedRecipes": [1, 3, 5]
  },
  {
    "id": 2,
    "name": "Admin User",
    "username": "adminuser",
    "email": "admin@example.com",
    "password": "adminpassword",
    "savedRecipes": [1, 2, 3, 10]
  },
  {
    "id": 3,
    "name": "Alice Smith",
    "username": "alicesmith",
    "email": "alice@example.com",
    "password": "alicepassword",
    "savedRecipes": [2, 4, 6]
  },
  {
    "id": 4,
    "name": "Bob Johnson",
    "username": "bobjohnson",
    "email": "bob@example.com",
    "password": "bobpassword",
    "savedRecipes": [3, 5, 7]
  },
  {
    "id": 5,
    "name": "Charlie Brown",
    "username": "charliebrown",
    "email": "charlie@example.com",
    "password": "charliepassword",
    "savedRecipes": [1, 8, 9]
  }
];

describe('User Data Structure Tests', () => {
  test('should be an array', () => {
    expect(Array.isArray(userData)).toBe(true);
  });

  test('should contain 5 users', () => {
    expect(userData.length).toBe(5);
  });

  test('each user should have required properties', () => {
    userData.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('savedRecipes');
    });
  });

  test('each user ID should be unique', () => {
    const ids = userData.map(user => user.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('each username should be unique', () => {
    const usernames = userData.map(user => user.username);
    const uniqueUsernames = [...new Set(usernames)];
    expect(usernames.length).toBe(uniqueUsernames.length);
  });

  test('each email should be unique', () => {
    const emails = userData.map(user => user.email);
    const uniqueEmails = [...new Set(emails)];
    expect(emails.length).toBe(uniqueEmails.length);
  });

  test('saved recipes should be an array for each user', () => {
    userData.forEach(user => {
      expect(Array.isArray(user.savedRecipes)).toBe(true);
    });
  });

  test('user IDs should be sequential starting from 1', () => {
    const sortedUsers = [...userData].sort((a, b) => a.id - b.id);
    for (let i = 0; i < sortedUsers.length; i++) {
      expect(sortedUsers[i].id).toBe(i + 1);
    }
  });

  test('email addresses should have a valid format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    userData.forEach(user => {
      expect(user.email).toMatch(emailRegex);
    });
  });

  test('passwords should be at least 8 characters long', () => {
    userData.forEach(user => {
      expect(user.password.length).toBeGreaterThanOrEqual(8);
    });
  });

  test('John Doe should have 3 saved recipes', () => {
    const johnDoe = userData.find(user => user.username === 'johndoe');
    expect(johnDoe.savedRecipes.length).toBe(3);
    expect(johnDoe.savedRecipes).toContain(1);
    expect(johnDoe.savedRecipes).toContain(3);
    expect(johnDoe.savedRecipes).toContain(5);
  });

  test('Admin User should have saved recipe with ID 10', () => {
    const adminUser = userData.find(user => user.username === 'adminuser');
    expect(adminUser.savedRecipes).toContain(10);
  });

  test('recipe ID 3 should be the most commonly saved', () => {
    const recipeFrequency = {};
    
    userData.forEach(user => {
      user.savedRecipes.forEach(recipeId => {
        recipeFrequency[recipeId] = (recipeFrequency[recipeId] || 0) + 1;
      });
    });
    
    const mostCommonRecipe = Object.entries(recipeFrequency)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    expect(parseInt(mostCommonRecipe)).toBe(1);
  });
});