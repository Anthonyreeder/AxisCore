// Mobile Navigation Menu Improvements
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = mainNav.querySelectorAll('a');
  const firstNavLink = navLinks[0];
  const lastNavLink = navLinks[navLinks.length - 1];
  
  // Toggle menu open/close
  menuToggle.addEventListener('click', function() {
    mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open');
    
    // When menu is opened, focus on the first link
    if (mainNav.classList.contains('open')) {
      firstNavLink.focus();
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = ''; // Restore scrolling when menu is closed
    }
  });
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = ''; // Restore scrolling
    });
  });
  
  // Trap focus in the mobile menu when it's open
  mainNav.addEventListener('keydown', function(e) {
    if (!mainNav.classList.contains('open')) return;
    
    // If Tab key is pressed
    if (e.key === 'Tab') {
      // If Shift+Tab on first link, move to last link
      if (e.shiftKey && document.activeElement === firstNavLink) {
        e.preventDefault();
        lastNavLink.focus();
      } 
      // If Tab on last link, move to first link
      else if (!e.shiftKey && document.activeElement === lastNavLink) {
        e.preventDefault();
        firstNavLink.focus();
      }
    }
    
    // Close menu on Escape key
    if (e.key === 'Escape') {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.focus(); // Return focus to the toggle button
      document.body.style.overflow = '';
    }
  });
}); 