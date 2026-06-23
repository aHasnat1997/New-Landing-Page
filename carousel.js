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

    track.appendChild(firstClone); // clone of first → after last
    track.insertBefore(lastClone, realCards[0]); // clone of last  → before first

    /* Re-query all cards including clones */
    var allCards = Array.prototype.slice.call(
      track.querySelectorAll(".sejours-card"),
    );
    /* real cards now sit at indices 1 … total  (0 = lastClone, total+1 = firstClone) */

    var current = 1; // start on the first real card (index 1)
    var isAnimating = false;

    /* ── Scroll so that card[index] is centred ── */
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
      if (instant) {
        track.style.scrollBehavior = "auto";
        track.scrollLeft = target;
      } else {
        track.style.scrollBehavior = "smooth";
        track.scrollLeft = target;
      }
    }

    function goTo(index, instant) {
      if (isAnimating && !instant) return;
      current = index;
      scrollTo(current, instant);
      updateCards();

      if (!instant) {
        isAnimating = true;
        setTimeout(function () {
          isAnimating = false;

          /* ── Silent reposition: if on a clone, jump to real counterpart ── */
          if (current === 0) {
            /* Was on lastClone (before first real) → jump to real last */
            current = total;
            scrollTo(current, true);
            updateCards();
          } else if (current === allCards.length - 1) {
            /* Was on firstClone (after last real) → jump to real first */
            current = 1;
            scrollTo(current, true);
            updateCards();
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

    btnPrev.addEventListener("click", function () {
      goTo(current - 1);
    });
    btnNext.addEventListener("click", function () {
      goTo(current + 1);
    });

    /* Buttons always visible */
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

    /* ── Keyboard ── */
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    });

    /* ── Resize ── */
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        goTo(current, true);
      }, 100);
    });

    /* Start on real first card */
    goTo(1, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSejoursCarousel);
  } else {
    initSejoursCarousel();
  }
})();
