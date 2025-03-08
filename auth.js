let currentUser  = null;

function login(email, password) {
  if (email && password) {
    currentUser  = {
      email: email,
      name: email.split('@')[0] 
    };
    updateAuthUI();
    closeAuthModal();
    return true;
  }
  return false;
}

function register(name, email, password, confirm) {
  if (name && email && password && password === confirm) {
    currentUser  = {
      email: email,
      name: name
    };
    updateAuthUI();
    closeAuthModal();
    return true;
  }
  return false;
}

function logout() {
  currentUser  = null;
  updateAuthUI();
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const recipeBookBtn = document.getElementById('recipe-book-btn');

  if (currentUser ) {
    loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
    loginBtn.removeEventListener('click', openAuthModal);
    loginBtn.addEventListener('click', logout);
    
    recipeBookBtn.style.display = 'inline-block';
    
    displayRecipes();
  } else {
    loginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
    loginBtn.removeEventListener('click', logout);
    loginBtn.addEventListener('click', openAuthModal);
    
    recipeBookBtn.style.display = 'none';
    
    showMainContent();
    
    displayRecipes();
  }
}

function openAuthModal() {
  document.getElementById('auth-modal').style.display = 'block';
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

document.getElementById('login-tab').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('register-tab').classList.remove('active');
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
});

document.getElementById('register-tab').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('login-tab').classList.remove('active');
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('login-form').style.display = 'none';
});

document.getElementById('login-submit').addEventListener('click', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (login(email, password)) {
  } else {
    alert('Please fill in all fields correctly');
  }
});

document.getElementById('register-submit').addEventListener('click', function(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  
  if (register(name, email, password, confirm)) {
  } else {
    alert('Please fill in all fields correctly and ensure passwords match');
  }
});

window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('auth-modal')) {
    closeAuthModal();
  }
});