document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY NAV BACKGROUND ---
  const headerWrapper = document.getElementById('header-wrapper');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      headerWrapper.classList.add('scrolled');
    } else {
      headerWrapper.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // --- MOBILE HAMBURGER MENU ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenuMobile = document.getElementById('nav-menu-mobile');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = () => {
    hamburgerBtn.classList.toggle('active');
    navMenuMobile.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    
    // Prevent background scrolling when menu is open
    if (navMenuMobile.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small timeout to allow anchor scroll trigger to fire before closing
      setTimeout(toggleMobileMenu, 250);
    });
  });

  // --- INTERACTION FOR WHO IT'S FOR TABS ---
  const tabButtons = document.querySelectorAll('#tabs-nav .tab-btn');
  const tabPanels = document.querySelectorAll('#tabs-content .tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active state from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active state to clicked button
      button.classList.add('active');
      
      const targetPanelId = button.getAttribute('data-tab');
      
      // Hide all panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      // Show target panel with fade-in animation
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- FAQ ACCORDION ANIMATION ---
  const faqItems = document.querySelectorAll('#faqs-accordion .faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Optional: Close all other FAQ items (Accordion mode)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });
      
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        // Set max-height to the exact scrollHeight of content for smooth CSS transition
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- STATS COUNT-UP INTERSECTION OBSERVER ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1500; // Animation duration in milliseconds
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      // Formatting values nicely (e.g. adding commas for larger numbers like 8700)
      if (target >= 1000) {
        element.textContent = currentValue.toLocaleString() + suffix;
      } else {
        element.textContent = currentValue + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (target >= 1000) {
          element.textContent = target.toLocaleString() + suffix;
        } else {
          element.textContent = target + suffix;
        }
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const observerOptions = {
    root: null, // viewport
    threshold: 0.15 // trigger when 15% of element is visible
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });

  // --- ACTIVE NAV LINK HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-menu-desktop .nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150; // offset for nav header heights
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

});
