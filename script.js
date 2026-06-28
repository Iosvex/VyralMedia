document.addEventListener('DOMContentLoaded', () => {

  // --- LENIS SMOOTH SCROLL ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // Run Lenis in requestAnimationFrame loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- STICKY NAV BACKGROUND ---
  const headerWrapper = document.getElementById('header-wrapper');
  
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 40) {
      headerWrapper.classList.add('scrolled');
    } else {
      headerWrapper.classList.remove('scrolled');
    }
  };
  
  // Use Lenis's scroll event if available, else fallback to window scroll
  lenis.on('scroll', handleScroll);
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- MOBILE HAMBURGER MENU ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenuMobile = document.getElementById('nav-menu-mobile');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = () => {
    hamburgerBtn.classList.toggle('active');
    navMenuMobile.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenuMobile.classList.contains('active') ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(toggleMobileMenu, 250);
    });
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('#faqs-accordion .faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
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
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- STATS COUNT-UP ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
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

  const observerOptions = { root: null, threshold: 0.15 };
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => statsObserver.observe(num));

  // --- ACTIVE NAV LINK ---
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-menu-desktop .nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
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

  // Use Lenis scroll event for smoother highlighting
  lenis.on('scroll', highlightNav);
  window.addEventListener('scroll', highlightNav);

  // --- INTERSECTION OBSERVER FOR CARD ANIMATIONS ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: once visible, stop observing to save performance
        // animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => animationObserver.observe(el));
});