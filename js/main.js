/* ============================================================
   BIKEMONTREAL.COM — Main JavaScript
   Navigation, Scroll Animations, FAQ, Interactivity
   ============================================================ */

(function () {
  'use strict';

  // === NAVIGATION ===
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navMobile = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  // Scroll behavior — add scrolled class
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // === SCROLL REVEAL ANIMATIONS ===
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // === FAQ ACCORDION ===
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(function (i) {
        i.classList.remove('active');
        var answer = i.querySelector('.faq__answer');
        if (answer) answer.style.maxHeight = null;
      });

      // Open clicked item if it was closed
      if (!isActive) {
        item.classList.add('active');
        var answer = item.querySelector('.faq__answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // === BIKESCORE CIRCLE ANIMATION ===
  var scoreCircles = document.querySelectorAll('.bikescore-circle');

  if ('IntersectionObserver' in window && scoreCircles.length > 0) {
    var scoreObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var circle = entry.target;
            var fill = circle.querySelector('.bikescore-circle__fill');
            var score = parseInt(circle.getAttribute('data-score'), 10) || 0;
            var circumference = 157; // 2 * PI * 25
            var offset = circumference - (score / 100) * circumference;
            if (fill) {
              fill.style.strokeDashoffset = offset;
            }
            scoreObserver.unobserve(circle);
          }
        });
      },
      { threshold: 0.5 }
    );

    scoreCircles.forEach(function (circle) {
      scoreObserver.observe(circle);
    });
  }

  // === COUNTER ANIMATION (hero stats) ===
  var statValues = document.querySelectorAll('.hero__stat-value[data-count]');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statValues.length > 0) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // === PARALLAX HERO (subtle) ===
  var heroBg = document.querySelector('.hero__bg img');

  if (heroBg) {
    var ticking = false;

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            var scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
              heroBg.style.transform = 'translateY(' + scrolled * 0.3 + 'px) scale(1.1)';
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // === ACTIVE NAV LINK HIGHLIGHTING ===
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // === LAZY LOAD IMAGES ===
  var lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    var imageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.getAttribute('data-src');
            if (img.getAttribute('data-srcset')) {
              img.srcset = img.getAttribute('data-srcset');
            }
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' }
    );

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }
})();
