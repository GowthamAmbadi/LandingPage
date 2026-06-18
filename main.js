/* ============================================================
   UPARI Consulting — Main JavaScript
   File: main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── ACTIVE NAV LINK ──────────────────────────────────────
     Marks the nav link whose href matches the current page.
     Works when pages are in the same folder.
  ─────────────────────────────────────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-inner a').forEach(function (link) {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* ── ACTIVE SIDEBAR LINK ──────────────────────────────────
     Same logic for the sidebar navigation links.
  ─────────────────────────────────────────────────────────── */
  document.querySelectorAll('.sidebar-box ul li a').forEach(function (link) {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────
     Any link that starts with # scrolls smoothly to target.
  ─────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── MOBILE HAMBURGER MENU ───────────────────────────────
     Toggles .open on .nav-inner when the button is clicked.
     Closes the menu when a nav link is tapped.
  ─────────────────────────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navInner  = document.querySelector('.nav-inner');

  if (navToggle && navInner) {
    navToggle.addEventListener('click', function () {
      const isOpen = navInner.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    navInner.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navInner.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  /* ── CURRENT YEAR IN FOOTER ───────────────────────────────
     Auto-updates the copyright year.
     Add id="footer-year" to the year span in your footer.
  ─────────────────────────────────────────────────────────── */
  document.querySelectorAll('#footer-year, #footer-year-2').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});