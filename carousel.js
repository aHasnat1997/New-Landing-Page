(function () {
  "use strict";

  function initSejoursCarousel() {
    var wrapper = document.querySelector(".sejours-carousel-wrapper");
    if (!wrapper) return;

    var track = wrapper.querySelector(".sejours-carousel-track");
    var cards = Array.prototype.slice.call(
      track.querySelectorAll(".sejours-card"),
    );
    var btnPrev = wrapper.querySelector(".carousel-btn-prev");
    var btnNext = wrapper.querySelector(".carousel-btn-next");

    var current = 0;
    var total = cards.length;
    var isAnimating = false;

    /* ── Calculate scroll position that centers a card ── */
    function getTargetScroll(index) {
      var card = cards[index];
      var trackRect = track.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var currentCardCenter = cardRect.left + cardRect.width / 2;
      var trackCenter = trackRect.left + trackRect.width / 2;
      return track.scrollLeft + (currentCardCenter - trackCenter);
    }

    /* ── Go to a specific card ── */
    function goTo(index, instant) {
      if (index < 0 || index >= total) return;
      if (isAnimating && !instant) return;

      current = index;
      var target = getTargetScroll(current);

      if (instant) {
        track.style.scrollBehavior = "auto";
        track.scrollLeft = target;
      } else {
        isAnimating = true;
        track.style.scrollBehavior = "smooth";
        track.scrollLeft = target;
        setTimeout(function () {
          isAnimating = false;
        }, 700);
      }

      updateCards();
      updateButtons();
    }

    function updateCards() {
      cards.forEach(function (card, i) {
        card.classList.toggle("is-active", i === current);
        card.classList.toggle("is-prev", i === current - 1);
        card.classList.toggle("is-next", i === current + 1);
      });
    }

    function updateButtons() {
      btnPrev.style.opacity = current === 0 ? "0" : "1";
      btnNext.style.opacity = current === total - 1 ? "0" : "1";
      btnPrev.style.pointerEvents = current === 0 ? "none" : "auto";
      btnNext.style.pointerEvents = current === total - 1 ? "none" : "auto";
    }

    btnPrev.addEventListener("click", function () {
      goTo(current - 1);
    });
    btnNext.addEventListener("click", function () {
      goTo(current + 1);
    });

    /* ── Mouse drag (click and drag) ── */
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
      if (diff > 60) goTo(current + 1);
      else if (diff < -60) goTo(current - 1);
      else goTo(current);
    });

    /* ── Keyboard arrows ── */
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    });

    /* ── Recalculate on resize ── */
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        goTo(current, true);
      }, 100);
    });

    goTo(0, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSejoursCarousel);
  } else {
    initSejoursCarousel();
  }
})();
