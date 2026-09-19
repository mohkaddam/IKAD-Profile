document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Highlight active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal (with a safety net so content is never stuck hidden)
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 200px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // Fallback: guarantee visibility even if the observer misses an element
    // (e.g. full-page renders, print, or edge-case viewport timing).
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }, 1200);
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Project filter (projects page)
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var cards = document.querySelectorAll('.project-card');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-client') === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // Contact form -> mailto fallback (no backend wired up yet)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var subject = form.subject.value.trim() || 'Website enquiry';
      var message = form.message.value.trim();
      var status = document.getElementById('form-status');

      if (!name || !email || !message) {
        if (status) { status.textContent = 'Please fill in your name, email and message.'; status.style.color = '#c23b3b'; }
        return;
      }

      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || '-') + '\n\n' + message;
      var mailto = 'mailto:m.kaddam@ikadeng.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      if (status) { status.textContent = 'Opening your email app to send this enquiry to IKAD Engineering…'; status.style.color = '#2f8a4c'; }
    });
  }
});
