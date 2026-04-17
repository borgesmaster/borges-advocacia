/* ═══════════════════════════════════════════════════
   BORGES & BORGES ADVOCACIA — Main JavaScript
═══════════════════════════════════════════════════ */

/* ── Loader ─────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 2000);
});

/* ── Navbar scroll behavior ─────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── Mobile menu ────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

/* ── Scroll Reveal (Intersection Observer) ──────── */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ── Counter Animation ──────────────────────────── */
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ── Active nav link on scroll ──────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

/* ── Smooth scroll for anchor links ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Back to top ────────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backTop.classList.add('visible');
  else backTop.classList.remove('visible');
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Multi-step form ────────────────────────────── */
let currentStep = 1;

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.form-step[data-step="${step}"]`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  const dot = document.querySelector(`.dot[data-dot="${step}"]`);
  if (dot) dot.classList.add('active');

  currentStep = step;
}

function nextStep(from) {
  // Basic validation
  const step = document.querySelector(`.form-step[data-step="${from}"]`);
  const required = step.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ff3b30';
      field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      valid = false;
    }
  });

  // Radio validation for step 1
  if (from === 1) {
    const radios = step.querySelectorAll('input[name="tipo"]');
    const checked = Array.from(radios).some(r => r.checked);
    if (!checked) {
      radios.forEach(r => r.nextElementSibling.style.borderColor = '#ff3b30');
      setTimeout(() => radios.forEach(r => r.nextElementSibling.style.borderColor = ''), 2000);
      valid = false;
    }
  }


  if (!valid) return;
  showStep(from + 1);
}

function prevStep(from) {
  showStep(from - 1);
}

// Form submit → show success
const formAgendamento = document.getElementById('formAgendamento');
if (formAgendamento) {
  formAgendamento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(formAgendamento);

    try {
      await fetch('https://formsubmit.co/ajax/advborgeseborges@outlook.com', {
        method: 'POST',
        body: data
      });
      showStep(4);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      showStep(4);
    }
  });
}

// Contato form success
const contatoForm = document.querySelector('.contato-form');
if (contatoForm) {
  contatoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contatoForm);
    const btn = contatoForm.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
      await fetch('https://formsubmit.co/ajax/advborgeseborges@outlook.com', {
        method: 'POST',
        body: data
      });
      btn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
      btn.style.background = '#34c759';
      setTimeout(() => {
        contatoForm.reset();
        btn.innerHTML = 'Enviar Mensagem <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } catch (err) {
      btn.textContent = 'Tente novamente';
      btn.disabled = false;
    }
  });
}

/* ── Set min date for scheduling ─────────────────── */
const dateInput = document.querySelector('input[name="data"]');
if (dateInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

/* ── Current year in footer ─────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Parallax on hero ───────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    const scrollY = window.scrollY;
    const grid = hero.querySelector('.hero-grid');
    if (grid) grid.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
});

/* ── Typewriter effect on hero title ────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const accent = document.querySelector('.hero-title-accent');
    if (!accent) return;
    const text = accent.textContent;
    accent.textContent = '';
    accent.style.display = 'inline-block';
    let i = 0;
    const interval = setInterval(() => {
      accent.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 80);
  }, 2200);
});

/* ── Area cards tilt effect ─────────────────────── */
document.querySelectorAll('.area-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 6;
    const tiltY = -(x / rect.width) * 6;
    card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Form navigation buttons ────────────────────── */
document.querySelectorAll('button[data-step]').forEach(btn => {
  const step = btn.getAttribute('data-step');
  if (btn.classList.contains('btn-step-next')) {
    btn.addEventListener('click', () => nextStep(parseInt(step)));
  } else if (btn.classList.contains('btn-step-back')) {
    btn.addEventListener('click', () => prevStep(parseInt(step)));
  }
});

/* ── Expose step functions globally ─────────────── */
window.nextStep = nextStep;
window.prevStep = prevStep;
