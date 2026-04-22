/* ============================================================
   BHARAT BHUSHAN SINGLA — SENIOR ADVOCATE
   script.js — Shared JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile hamburger ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Sticky navbar shadow ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 30
        ? '0 4px 24px rgba(26,60,110,0.14)'
        : '0 2px 8px rgba(26,60,110,0.08)';
    });
  }

  /* ---- Active nav link by current page ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Portfolio filter tabs ---- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const caseCards   = document.querySelectorAll('.case-card');

  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;

        caseCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- Counter animation on stats bar ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 16);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
  }

  /* ---- Scroll-reveal animation ---- */
  const revealEls = document.querySelectorAll(
    '.card, .service-card, .case-card, .testimonial-card, .timeline-item, .practice-item, .membership-card'
  );

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
      revealObserver.observe(el);
    });
  }

  /* ---- Contact form validation ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fullName',    errId: 'nameErr',    msg: 'Please enter your full name.' },
        { id: 'phone',       errId: 'phoneErr',   msg: 'Please enter a valid 10-digit phone number.',
          validate: v => /^[6-9]\d{9}$/.test(v.replace(/\s/g,'')) },
        { id: 'email',       errId: 'emailErr',   msg: 'Please enter a valid email address.',
          validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), required: false },
        { id: 'matter',      errId: 'matterErr',  msg: 'Please select a legal matter type.' },
        { id: 'message',     errId: 'msgErr',     msg: 'Please describe your legal matter (min 20 chars).',
          validate: v => v.trim().length >= 20 },
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        if (!input || !errEl) return;

        const val = input.value.trim();
        const isEmpty = val === '' || val === 'default';
        const required = f.required !== false;

        let isError = false;
        if (required && isEmpty) { isError = true; }
        else if (!isEmpty && f.validate && !f.validate(val)) { isError = true; }

        if (isError) {
          input.classList.add('error');
          errEl.textContent = f.msg;
          errEl.classList.add('show');
          valid = false;
        } else {
          input.classList.remove('error');
          errEl.classList.remove('show');
        }
      });

      if (valid) {
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) successMsg.classList.add('show');
        contactForm.reset();
        setTimeout(() => successMsg && successMsg.classList.remove('show'), 5000);
      }
    });

    // Live clear error on input
    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', function () {
        this.classList.remove('error');
        const errEl = document.querySelector(`[id="${this.id}Err"], [id="${this.id.replace('f','F')}Err"]`);
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
// ============================================================
// PORTFOLIO FILTER — Works for BOTH Active & Concluded sections
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // Concluded cases filter (data-filter)
  const concludedBtns = document.querySelectorAll('[data-filter]');
  const concludedCards = document.querySelectorAll('.case-card[data-category]');

  concludedBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      concludedBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const filter = this.getAttribute('data-filter');
      concludedCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // Active cases filter (data-active-filter)
  const activeBtns = document.querySelectorAll('[data-active-filter]');
  const activeCards = document.querySelectorAll('.case-card[data-active-category]');

  activeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      activeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const filter = this.getAttribute('data-active-filter');
      activeCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-active-category') === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }
});
/* ---- Keyframe for fade-in used by filter ---- */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }`;
document.head.appendChild(style);
