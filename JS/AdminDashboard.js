document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin Dashboard initialized");
  
    /* ======================
        THEME MANAGEMENT
    ====================== */
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
  
    // Theme configuration
    const themes = {
      light: {
        icon: 'bi-moon',
        particleColor: 'rgba(92, 122, 234, 0.15)'
      },
      dark: {
        icon: 'bi-sun',
        particleColor: 'rgba(236, 240, 241, 0.15)'
      }
    };
  
    // Apply theme changes
    function setTheme(theme) {
      // Update DOM
      body.classList.toggle('dark-theme', theme === 'dark');
      themeToggle.innerHTML = `<i class="bi ${themes[theme].icon}"></i>`;
      
      // Update particles
      document.querySelectorAll('.particle').forEach(particle => {
        particle.style.backgroundColor = themes[theme].particleColor;
      });
      
      // Save preference
      localStorage.setItem('theme', theme);
      console.log(`Theme set to ${theme}`);
    }
  
    // Initialize theme
    function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setTheme(theme);
    }
  
    // Toggle theme
    themeToggle.addEventListener('click', () => {
      const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
      setTheme(newTheme);
    });
  
    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  
    /* ======================
        PARTICLES BACKGROUND
    ====================== */
    
    function initParticles() {
      const container = document.getElementById('particles-js');
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      
      // Clear existing particles
      container.innerHTML = '';
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Apply styles
        particle.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: float ${duration}s linear ${delay}s infinite;
          opacity: ${opacity};
        `;
        
        container.appendChild(particle);
      }
      
      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  
    /* ======================
        ANIMATED COUNTERS
    ====================== */
    
    function initCounters() {
      const counters = [
        { id: 'students-count', target: 1245 },
        { id: 'teachers-count', target: 42 },
        { id: 'classes-count', target: 18 },
        { id: 'attendance-rate', target: 94 },
        { id: 'quick-students', target: 1245 },
        { id: 'quick-teachers', target: 42 },
        { id: 'quick-classes', target: 18 }
      ];
  
      const speed = 2000; // Animation duration in ms
      
      function animateCounter(element, target, isPercentage = false) {
        let current = 0;
        const increment = target / (speed / 16);
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            current = target;
          }
          
          if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
          } else {
            element.textContent = Math.floor(current).toLocaleString();
          }
        }, 16);
      }
      
      // Start counters when stats section is in view
      const statsSection = document.querySelector('.stats-overview');
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
              animateCounter(
                element, 
                counter.target, 
                counter.id.includes('rate') || counter.id.includes('percent')
              );
            }
          });
          observer.unobserve(statsSection);
        }
      }, { threshold: 0.5 });
      
      observer.observe(statsSection);
    }
  
    /* ======================
        UI INTERACTIONS
    ====================== */
    
    function setupUI() {
      // Back to top button
      const backToTopBtn = document.getElementById('back-to-top');
      
      window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
      });
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  
      // Card interactions
      document.querySelectorAll('.feature-card').forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
        
        // Click ripple effect
        card.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          ripple.className = 'ripple-effect';
          
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          
          ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size/2}px;
            top: ${e.clientY - rect.top - size/2}px;
          `;
          
          this.appendChild(ripple);
          
          setTimeout(() => ripple.remove(), 600);
          
          // Handle navigation if data-link exists
          const link = this.getAttribute('data-link');
          if (link) {
            setTimeout(() => {
              window.location.href = link;
            }, 300);
          }
        });
      });
      
      // Add ripple effect styles
      const rippleStyle = document.createElement('style');
      rippleStyle.textContent = `
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(rippleStyle);
    }
  
    /* ======================
        INITIALIZATION
    ====================== */
    
    function init() {
      initTheme();
      initParticles();
      initCounters();
      setupUI();
      
      // Handle resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initParticles, 250);
      });
    }
  
    init();
  });