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

  // Gallery lightbox
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var openLightbox = function (src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption || '';
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function () {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.gallery-grid button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Contact form -> submits to send-quote.php, which emails info@ikadeng.com (cc m.kaddam@ikadeng.com)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var status = document.getElementById('form-status');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        if (status) { status.textContent = 'Please fill in your name, email and message.'; status.style.color = '#c23b3b'; }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (status) { status.textContent = 'Sending your enquiry…'; status.style.color = 'var(--ink-soft)'; }

      fetch('send-quote.php', {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data.success) {
            if (status) { status.textContent = 'Thank you — your enquiry has been sent. We will get back to you shortly.'; status.style.color = '#2f8a4c'; }
            form.reset();
          } else {
            if (status) { status.textContent = result.data.message || 'Something went wrong. Please try again or email us directly.'; status.style.color = '#c23b3b'; }
          }
        })
        .catch(function () {
          if (status) { status.textContent = 'Something went wrong. Please try again or email us directly at info@ikadeng.com.'; status.style.color = '#c23b3b'; }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
});
