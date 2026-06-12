/* ilitya prototype — micro-interactions
   custom cursor · scroll reveal · shop filters · nav */

(function () {
  document.documentElement.classList.add("js");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- header: gain a quiet background once scrolled ----- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", scrollY > 24);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- mobile menu ----- */
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
  }

  /* ----- soft reveal on scroll ----- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms";
  });
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ----- custom cursor (desktop / fine pointers only) ----- */
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.innerHTML =
      '<span class="cursor-dot"></span><span class="cursor-trail"><span class="cursor-label"></span></span>';
    document.body.appendChild(cursor);
    document.body.classList.add("has-cursor");

    var label = cursor.querySelector(".cursor-label");
    var trail = cursor.querySelector(".cursor-trail");
    var tx = innerWidth / 2, ty = innerHeight / 2, lx = tx, ly = ty;

    /* the dot is the pointer: 1:1, no smoothing, updated straight
       from the event for minimum latency */
    addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!cursor.classList.contains("is-active")) {
        lx = tx;
        ly = ty;
        cursor.classList.add("is-active");
      }
      cursor.style.transform = "translate(" + tx + "px," + ty + "px)";
    });
    document.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-active");
    });

    /* grow over anything interactive, since the native arrow is gone */
    var HOVERABLE = "a, button, [data-cursor], input, textarea, select, label";
    document.addEventListener("mouseover", function (e) {
      cursor.classList.toggle("is-hover", !!e.target.closest(HOVERABLE));
    });

    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        label.textContent = el.dataset.cursor;
        cursor.classList.add("has-label");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("has-label");
      });
    });

    /* only the label trails, softly */
    (function loop() {
      lx += (tx - lx) * 0.22;
      ly += (ty - ly) * 0.22;
      trail.style.transform = "translate(" + (lx - tx) + "px," + (ly - ty) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ----- shop filters ----- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  var products = document.querySelectorAll("[data-cat]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      var f = btn.dataset.filter;
      products.forEach(function (p) {
        p.classList.toggle("is-hidden", f !== "all" && p.dataset.cat !== f);
      });
    });
  });

  /* ----- prototype forms: acknowledge, don't submit ----- */
  document.querySelectorAll("form[data-proto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (note) note.textContent = "Thank you — we will be in touch shortly.";
    });
  });

  /* ----- year ----- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
