function initCarousel(carouselId, trackId, dotsId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const track = document.getElementById(trackId);
  const dotsEl = document.getElementById(dotsId);
  const slides = track.querySelectorAll(".carousel-slide");
  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  /* Set up slides for fade — stack them on top of each other */
  track.style.position = "relative";
  slides.forEach((slide, i) => {
    slide.style.position = i === 0 ? "relative" : "absolute";
    slide.style.inset = "0";
    slide.style.opacity = i === 0 ? "1" : "0";
    slide.style.transition = "opacity 0.8s ease";
    slide.style.zIndex = i === 0 ? "1" : "0";
  });

  /* Build dots */
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => {
      resetAuto();
      goTo(i);
    });
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    const prev_slide = slides[current];
    current = (index + total) % total;
    const next_slide = slides[current];

    /* Bring next slide on top, fade it in */
    next_slide.style.zIndex = "2";
    next_slide.style.opacity = "1";

    /* After transition, demote the old slide underneath */
    setTimeout(() => {
      prev_slide.style.opacity = "0";
      prev_slide.style.zIndex = "0";
      prev_slide.style.position = "absolute";
      next_slide.style.zIndex = "1";
      next_slide.style.position = "relative";
    }, 800);

    dotsEl
      .querySelectorAll(".dot")
      .forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  /* Autoplay */
  function startAuto() {
    autoTimer = setInterval(next, 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  /* Touch / swipe */
  let touchStartX = 0;
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) {
        resetAuto();
        delta > 0 ? next() : prev();
      }
    },
    { passive: true },
  );

  /* Keyboard */
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      resetAuto();
      next();
    }
    if (e.key === "ArrowLeft") {
      resetAuto();
      prev();
    }
  });
}

/* Init both carousels */
initCarousel("vinsCarousel1", "carouselTrack1", "carouselDots1");
initCarousel("vinsCarousel2", "carouselTrack2", "carouselDots2");
