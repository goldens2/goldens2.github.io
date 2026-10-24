(() => {
  'use strict';
  const root = document.documentElement;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Tema manual, com preferência do sistema como padrão.
  const themeButtons = document.querySelectorAll('.theme-toggle');
  const savedTheme = (() => { try { return localStorage.getItem('gm-theme'); } catch { return null; } })();
  const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const setTheme = theme => {
    root.setAttribute('data-theme', theme);
    themeButtons.forEach(b => { b.querySelector('.theme-icon').textContent = theme === 'light' ? '☀' : '☾'; b.setAttribute('aria-label', theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'); });
  };
  setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme);
  themeButtons.forEach(btn => btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('gm-theme', next); } catch { /* preferências são opcionais */ }
  }));

  // Navegação móvel.
  const menuButton = document.querySelector('.menu-button');
  const nav = document.getElementById('menu');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  // Contatos são ocultos até serem definidos no arquivo de configuração.
  const contactArea = document.getElementById('contact-actions');
  if (contactArea) {
    const cfg = window.PORTFOLIO_CONFIG || {};
    const links = [
      ['github', 'GitHub ↗', true],
      ['linkedin', 'LinkedIn ↗', true],
      ['email', 'Enviar e-mail ↗', false],
      ['curriculum', 'Ver currículo ↗', true]
    ];
    const allowedHttps = value => { try { const u = new URL(value); return u.protocol === 'https:'; } catch { return false; } };
    const allowedEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const actions = links.filter(([key, , asUrl]) => asUrl ? allowedHttps(cfg[key]) : allowedEmail(cfg[key]));
    if (actions.length) {
      contactArea.textContent = '';
      actions.forEach(([key, label, asUrl], index) => {
        const a = document.createElement('a');
        a.className = `btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`;
        a.textContent = label;
        a.href = asUrl ? cfg[key] : `mailto:${cfg[key]}`;
        if (asUrl) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        contactArea.appendChild(a);
      });
    }
  }

  // Visualização do cartão inicial: valores ilustrativos e não transmitidos por sensores.
  const svg = document.getElementById('hero-chart');
  if (svg) {
    const points = Array.from({ length: 35 }, (_, i) => ({ x: 6 + i * (488 / 34), y: 92 - Math.cos(i * 0.31) * 18 + Math.sin(i * 0.76) * 8 + i * .36 }));
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const area = `${path} L494,156 L6,156 Z`;
    const last = points[points.length - 1];
    const lines = [38, 81, 124, 156].map(y => `<line x1="0" x2="500" y1="${y}" y2="${y}" stroke="#2b4555" stroke-width="1" stroke-dasharray="3 6"/>`).join('');
    svg.innerHTML = `<defs><linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#66dfc6" stop-opacity=".3"/><stop offset="1" stop-color="#66dfc6" stop-opacity="0"/></linearGradient></defs>${lines}<path d="${area}" fill="url(#area-gradient)"/><path d="${path}" fill="none" stroke="#70e7ca" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last.x}" cy="${last.y}" r="6" fill="#70e7ca" stroke="#112b34" stroke-width="4"/>`;
  }
})();
