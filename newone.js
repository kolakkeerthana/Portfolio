// Show navbar only after reaching the "Projects" section (or when navigating to it)
(function () {
  const navbar = document.getElementById('navbar');
  const projects = document.getElementById('projects');
  const NAVBAR_VISIBLE_CLASS = 'visible';
  const OFFSET = 60; // small offset so it reveals slightly before the section top if desired

  if (!navbar || !projects) return;

  function updateNavbarVisibility() {
    const triggerPoint = projects.getBoundingClientRect().top + window.scrollY - OFFSET;
    if (window.scrollY >= triggerPoint) {
      navbar.classList.add(NAVBAR_VISIBLE_CLASS);
    } else {
      navbar.classList.remove(NAVBAR_VISIBLE_CLASS);
    }
  }

  // Run on load in case user lands directly on #projects via link/bookmark
  window.addEventListener('load', updateNavbarVisibility);
  // Run on scroll to show/hide as needed
  window.addEventListener('scroll', updateNavbarVisibility);
  // Also observe hashchange (if user uses back/forward or manually changes hash)
  window.addEventListener('hashchange', updateNavbarVisibility);

  // Make sure clicking nav links that go to projects (or below) shows the navbar.
  // We use a small timeout to allow the browser to jump first, then enforce visibility.
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href')?.replace('#', '');
      // let the browser perform default jump (smooth behavior is enabled via CSS)
      setTimeout(() => {
        // If user navigated to projects (or below), show the navbar
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        // If the target's top relative to viewport is <= some threshold (near top), show navbar
        const top = targetEl.getBoundingClientRect().top;
        // If the target is at or above the top/near top, show navbar
        if (top <= window.innerHeight * 0.2 || targetId === 'projects') {
          navbar.classList.add(NAVBAR_VISIBLE_CLASS);
        }
      }, 120); // short delay to allow the smooth scroll to execute
    });
  });
})();


// Year-split timeline reveal
(function () {
  const rows = document.querySelectorAll('.year-timeline .timeline-row');
  if (!rows.length) return;

  // fallback to reveal if observer not supported / slow
  let fallback = setTimeout(() => rows.forEach(r => r.classList.add('revealed')), 700);

  if (!('IntersectionObserver' in window)) {
    rows.forEach(r => r.classList.add('revealed'));
    clearTimeout(fallback);
    return;
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  rows.forEach(r => obs.observe(r));
  // if observer fired cancel fallback
  clearTimeout(fallback);
})();
