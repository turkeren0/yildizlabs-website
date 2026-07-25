/* =============================================
   YILDIZLABS — Animated Background Canvas
   Dark Theme Interactive Indigo Particle Network
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initVividParticles();
  initNavbar();
  initMobileMenu();
  initReveal();
  initSmoothScroll();
});

function initVividParticles() {
  const canvas = document.getElementById('global-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let ripples = [];
  let mouse = { x: -1000, y: -1000, radius: 220 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Click ripple effect in Indigo #3533cd
  window.addEventListener('click', (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 160,
      opacity: 0.8,
      color: '53, 51, 205'
    });
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 4 + 3;
      this.size = this.baseSize;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.pulseSpeed = Math.random() * 0.03 + 0.012;
      this.pulseAngle = Math.random() * Math.PI * 2;

      const rand = Math.random();
      if (rand < 0.60) {
        this.color = '53, 51, 205'; // Electric Indigo #3533cd
        this.glowColor = 'rgba(53, 51, 205, 0.85)';
      } else if (rand < 0.85) {
        this.color = '82, 80, 236'; // Bright Indigo #5250ec
        this.glowColor = 'rgba(82, 80, 236, 0.85)';
      } else {
        this.color = '255, 255, 255'; // Crisp White
        this.glowColor = 'rgba(255, 255, 255, 0.7)';
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      this.pulseAngle += this.pulseSpeed;
      let currentSize = this.baseSize + Math.sin(this.pulseAngle) * 1.5;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const factor = (mouse.radius - dist) / mouse.radius;
        currentSize += factor * 8;
        this.x -= (dx / dist) * factor * 1.2;
        this.y -= (dy / dist) * factor * 1.2;
      }

      this.size = currentSize;

      if (this.x < -20) this.x = canvas.width + 20;
      if (this.x > canvas.width + 20) this.x = -20;
      if (this.y < -20) this.y = canvas.height + 20;
      if (this.y > canvas.height + 20) this.y = -20;
    }

    draw() {
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = this.glowColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(1, this.size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 16000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 170) {
          const alpha = (1 - dist / 170) * 0.28;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(53, 51, 205, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function handleRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 4;
      r.opacity -= 0.02;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${r.color}, 0.8)`;
      ctx.stroke();
      ctx.restore();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    handleRipples();
    requestAnimationFrame(animate);
  }

  animate();
}

function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = document.getElementById('navbar').offsetHeight;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });
}
