(function () {
  "use strict";

  function initSejoursCarousel() {
    var wrapper = document.querySelector(".sejours-carousel-wrapper");
    if (!wrapper) return;

    var track = wrapper.querySelector(".sejours-carousel-track");
    var btnPrev = wrapper.querySelector(".carousel-btn-prev");
    var btnNext = wrapper.querySelector(".carousel-btn-next");

    /* ── Clone first & last cards for seamless loop ── */
    var realCards = Array.prototype.slice.call(
      track.querySelectorAll(".sejours-card"),
    );
    var total = realCards.length;

    var firstClone = realCards[0].cloneNode(true);
    var lastClone = realCards[total - 1].cloneNode(true);
    firstClone.classList.add("is-clone");
    lastClone.classList.add("is-clone");

    track.appendChild(firstClone);
    track.insertBefore(lastClone, realCards[0]);

    var allCards = Array.prototype.slice.call(
      track.querySelectorAll(".sejours-card"),
    );

    var current = 1;
    var isAnimating = false;

    /* ── Dots ── */
    var dotsWrapper = wrapper.querySelector(".sejours-carousel-dots");
    var dots = [];

    if (dotsWrapper) {
      realCards.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "sejours-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", function () {
          resetAuto();
          goTo(i + 1); // +1 because index 0 is the lastClone
        });
        dotsWrapper.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateDots() {
      var realIndex = current - 1; // subtract 1 to account for lastClone at index 0
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === realIndex);
      });
    }

    /* ── Scroll helpers ── */
    function getTargetScroll(index) {
      var card = allCards[index];
      var trackRect = track.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      return (
        track.scrollLeft +
        (cardRect.left + cardRect.width / 2) -
        (trackRect.left + trackRect.width / 2)
      );
    }

    function scrollTo(index, instant) {
      var target = getTargetScroll(index);
      track.style.scrollBehavior = instant ? "auto" : "smooth";
      track.scrollLeft = target;
    }

    function goTo(index, instant) {
      if (isAnimating && !instant) return;
      current = index;
      scrollTo(current, instant);
      updateCards();
      updateDots();

      if (!instant) {
        isAnimating = true;
        setTimeout(function () {
          isAnimating = false;

          /* Silent reposition on clone hit */
          if (current === 0) {
            current = total;
            scrollTo(current, true);
            updateCards();
            updateDots();
          } else if (current === allCards.length - 1) {
            current = 1;
            scrollTo(current, true);
            updateCards();
            updateDots();
          }
        }, 700);
      }
    }

    function updateCards() {
      allCards.forEach(function (card, i) {
        card.classList.toggle("is-active", i === current);
        card.classList.toggle("is-prev", i === current - 1);
        card.classList.toggle("is-next", i === current + 1);
      });
    }

    /* ── Autoplay ── */
    var autoTimer = null;
    var AUTO_DELAY = 3000;

    function startAuto() {
      // autoTimer = setInterval(function () {
      //   goTo(current + 1);
      // }, AUTO_DELAY);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    /* Pause on hover, resume on leave */
    wrapper.addEventListener("mouseenter", function () {
      clearInterval(autoTimer);
    });
    wrapper.addEventListener("mouseleave", startAuto);

    /* ── Buttons ── */
    btnPrev.addEventListener("click", function () {
      resetAuto();
      goTo(current - 1);
    });
    btnNext.addEventListener("click", function () {
      resetAuto();
      goTo(current + 1);
    });

    btnPrev.style.opacity = btnNext.style.opacity = "1";
    btnPrev.style.pointerEvents = btnNext.style.pointerEvents = "auto";

    /* ── Mouse drag ── */
    var dragStartX = 0;
    var dragStartScroll = 0;
    var dragDistance = 0;
    var isDragging = false;

    track.addEventListener("mousedown", function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartScroll = track.scrollLeft;
      dragDistance = 0;
      track.style.scrollBehavior = "auto";
      track.classList.add("is-dragging");
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      dragDistance = e.clientX - dragStartX;
      track.scrollLeft = dragStartScroll - dragDistance;
    });

    document.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("is-dragging");
      resetAuto();
      if (dragDistance < -60) goTo(current + 1);
      else if (dragDistance > 60) goTo(current - 1);
      else goTo(current);
    });

    /* ── Touch swipe ── */
    var touchStartX = 0;
    track.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );

    track.addEventListener("touchend", function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      resetAuto();
      if (diff > 60) goTo(current + 1);
      else if (diff < -60) goTo(current - 1);
      else goTo(current);
    });

    /* ── Keyboard ── */
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        resetAuto();
        goTo(current + 1);
      }
      if (e.key === "ArrowLeft") {
        resetAuto();
        goTo(current - 1);
      }
    });

    /* ── Resize ── */
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        goTo(current, true);
      }, 100);
    });

    goTo(1, true);
    startAuto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSejoursCarousel);
  } else {
    initSejoursCarousel();
  }
})();
