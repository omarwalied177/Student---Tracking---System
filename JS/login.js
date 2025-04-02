document.addEventListener('DOMContentLoaded', function() {
  // Initialize particles.js
  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#5c7aea"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#5c7aea",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.5
          }
        },
        "push": {
          "particles_nb": 4
        }
      }
    },
    "retina_detect": true
  });
});
document.addEventListener('DOMContentLoaded', function() {
  // Role selection
  document.querySelectorAll(".role-option-label input").forEach((input) => {
    input.addEventListener("change", function() {
      document.querySelectorAll(".role-option-content").forEach((content) => {
        content.style.transform = '';
      });
      if (this.checked) {
        this.nextElementSibling.style.transform = 'translateY(-5px)';
      }
    });
  });

  // Password toggle
  document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector('i');
    
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    }
    
    // Add animation
    this.style.transform = 'scale(1.1)';
    setTimeout(() => {
      this.style.transform = '';
    }, 200);
  });

  // Password strength indicator
  document.getElementById("password").addEventListener("input", function(e) {
    const password = e.target.value;
    const progress = document.querySelector(".progress-bar");
    const text = document.querySelector(".strength-text");
    
    // Calculate strength
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length > 5) strength += 20;
    if (password.length > 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Cap at 100%
    strength = Math.min(strength, 100);
    progress.style.width = strength + '%';
    
    // Update appearance based on strength
    if (strength < 40) {
      progress.className = 'progress-bar bg-danger';
      text.textContent = 'Weak';
    } else if (strength < 70) {
      progress.className = 'progress-bar bg-warning';
      text.textContent = 'Medium';
    } else {
      progress.className = 'progress-bar bg-success';
      text.textContent = 'Strong';
    }
  });

  // Form validation and submission
  document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const btn = this.querySelector('button[type="submit"]');
    const form = this;
    
    // Hide any previous errors
    hideError();
    
    // Validate inputs
    if (!username || !password) {
      showError('Please fill in all fields');
      return false;
    }
    
    // Show loading state
    btn.innerHTML = `
      <span class="btn-text">Authenticating</span>
      <span class="btn-icon">
        <i class="bi bi-arrow-repeat"></i>
      </span>
    `;
    btn.classList.add('loading');
    btn.disabled = true;
    form.classList.add('authenticating');
    
    // Simulate API call (replace with actual login logic)
    setTimeout(() => {
      // Reset button state
      btn.innerHTML = `
        <span class="btn-text">Login</span>
        <span class="btn-icon">
          <i class="bi bi-arrow-right"></i>
        </span>
      `;
      btn.classList.remove('loading');
      btn.disabled = false;
      form.classList.remove('authenticating');
      
      // Here you would typically handle the login response
      const role = document.querySelector('input[name="role"]:checked').value;
      
      // For demo purposes, show success with animation
      showSuccess(`Welcome ${username}! Redirecting...`);
      
      // Add success animation to form
      form.classList.add('success-animation');
      setTimeout(() => {
        form.classList.remove('success-animation');
        // window.location.href = `dashboard.html?role=${role.toLowerCase()}`;
      }, 1500);
    }, 2000);
  });
  
  function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.remove('d-none');
    errorEl.classList.add('animate__animated', 'animate__headShake');
    setTimeout(() => {
      errorEl.classList.remove('animate__headShake');
    }, 1000);
  }
  
  function hideError() {
    document.getElementById('error-message').classList.add('d-none');
  }
  
  function showSuccess(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.remove('alert-danger', 'd-none');
    errorEl.classList.add('alert-success', 'animate__animated', 'animate__fadeIn');
  }
});