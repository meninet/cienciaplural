/* =====================================================
   CIÊNCIA PLURAL — Main JavaScript
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // --- Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navList.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navList.classList.contains('active'));
    });

    // Close on link click
    navList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Active nav link ---
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      if (path === href || path === href + 'index.html' || path.startsWith(href) && href !== '/') {
        link.classList.add('active');
      }
      if ((path === '/' || path === '/index.html') && (href === '/' || href === '/index.html')) {
        link.classList.add('active');
      }
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Fade-in on scroll ---
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.section, .game-card, .catalog-card, .feature-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // --- Game Search ---
  const searchInput = document.getElementById('game-search');
  const noResults = document.getElementById('search-no-results');

  if (searchInput && typeof searchIndex !== 'undefined') {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      const cards = document.querySelectorAll('.catalog-card[data-game-id]');

      if (!query) {
        cards.forEach(card => card.classList.remove('search-hidden'));
        if (noResults) noResults.style.display = 'none';
        return;
      }

      let found = 0;

      searchIndex.forEach(game => {
        const haystack = (game.title + ' ' + game.tags.join(' ') + ' ' + game.content)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        const card = document.querySelector(`.catalog-card[data-game-id="${game.id}"]`);
        if (!card) return;

        if (haystack.includes(query)) {
          card.classList.remove('search-hidden');
          found++;
        } else {
          card.classList.add('search-hidden');
        }
      });

      if (noResults) {
        noResults.style.display = found === 0 ? 'block' : 'none';
      }
    });
  }

});
