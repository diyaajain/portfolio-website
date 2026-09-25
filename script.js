document.getElementById('year').textContent = new Date().getFullYear();

/* Day / night toggle (default is the parchment "day" theme) */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

/* Mobile nav */
const navToggle = document.getElementById('nav-toggle');
const nav = document.querySelector('.nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* Scroll-to-top button */
const scrollTop = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('visible', window.scrollY > 500);
});
scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Footprint cursor trail — little webbed duck tracks that waddle across the page */
(function () {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let prints = [];
  let width, height;
  let lastX = null, lastY = null, lastSpawn = 0, side = 1;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnPrint(x, y) {
    const now = performance.now();
    if (now - lastSpawn < 90) return; // one print roughly every step
    if (lastX !== null) {
      const dx = x - lastX, dy = y - lastY;
      if (Math.hypot(dx, dy) < 14) return; // only stamp a print once you've actually moved
    }
    lastSpawn = now;

    let angle = 0;
    if (lastX !== null) angle = Math.atan2(y - lastY, x - lastX);
    lastX = x; lastY = y;
    side *= -1;

    const perpX = Math.cos(angle + Math.PI / 2) * 6 * side;
    const perpY = Math.sin(angle + Math.PI / 2) * 6 * side;

    prints.push({ x: x + perpX, y: y + perpY, angle, alpha: 0.5 });
    if (prints.length > 60) prints.shift();
  }

  window.addEventListener('mousemove', (e) => spawnPrint(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) spawnPrint(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function drawFootprint(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = `rgba(107, 66, 38, ${p.alpha})`; /* coffee-brown ink */
    // webbed-foot: one small "palm" ellipse + three toe dots
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-3.2, -6, 1.6, 2.4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -7.5, 1.6, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(3.2, -6, 1.6, 2.4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    prints.forEach(p => { p.alpha *= 0.985; drawFootprint(p); });
    prints = prints.filter(p => p.alpha > 0.03);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
