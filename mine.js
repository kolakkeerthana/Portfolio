/* ====================================================
   newone.js
   - Navbar visibility & offset handling
   - Reveal animations for timeline / cards
   - Comments explain behavior
   ==================================================== */

/* -------------------------
   NAVBAR: ensure it stays above content and offset anchors
   ------------------------- */
   (function () {
    // Grab navbar and projects anchor
    const navbar = document.getElementById('navbar');
    const projects = document.getElementById('projects');
    if (!navbar) return;
  
    // Add high z-index in CSS; here we maintain anchor-offset behavior:
    // When user clicks navigation anchors, browsers will jump; we ensure
    // sections aren't hidden beneath the fixed header by using scroll-margin-top in CSS.
    // If you want the navbar to hide/show depending on scroll, we can add that later.
  })();
  
  /* -------------------------
     REVEAL: IntersectionObserver to animate timeline rows / cards
     ------------------------- */
  (function () {
    // Elements we want to reveal
    const revealables = document.querySelectorAll('.timeline-row, .project-card, .lead-card, .interest');
  
    if (!revealables.length) return;
  
    // Fallback: reveal everything after a short delay if IntersectionObserver is unsupported
    let fallback = setTimeout(() => revealables.forEach(el => el.classList.add('revealed')), 700);
  
    // If IntersectionObserver not supported -> reveal and exit
    if (!('IntersectionObserver' in window)) {
      revealables.forEach(el => el.classList.add('revealed'));
      clearTimeout(fallback);
      return;
    }
  
    // Observer options: trigger slightly before the element fully enters view
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // animate only once
        }
      });
    }, { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
  
    // Observe all revealable elements
    revealables.forEach(el => observer.observe(el));
  
    // Cancel fallback if observer ran
    clearTimeout(fallback);
  })();
  
  /* -------------------------
     Helpful: make sure anchor jumps don't hide content under the fixed nav
     (Use scroll-margin-top on sections; this is handled in CSS by reducing top padding.)
     But we also add a small behavior: when a link with a hash is clicked, perform a smooth
     scroll offset fix on older browsers.
     ------------------------- */
  (function () {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        // Let browser handle native navigation; then apply small offset correction after jump
        setTimeout(() => {
          const target = document.querySelector(a.getAttribute('href'));
          if (!target) return;
          // Scroll so the target appears comfortably below the fixed header (120px)
          const headerOffset = 100; // same as CSS top padding used for sections
          const rect = target.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          window.scrollTo({ top: absoluteTop - headerOffset, behavior: 'smooth' });
        }, 60);
      });
    });
  })();
  