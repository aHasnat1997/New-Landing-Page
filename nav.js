(function () {
  "use strict";

  function initNav() {
    var hamburger = document.getElementById("nav-hamburger");
    var panel = document.getElementById("nav-panel");
    var overlay = document.getElementById("nav-overlay");
    var closeBtn = document.getElementById("nav-close");

    if (!hamburger || !panel || !overlay || !closeBtn) return;

    function openMenu() {
      panel.classList.add("is-open");
      overlay.classList.add("is-open");
      hamburger.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
      closeBtn.focus();
    }

    function closeMenu() {
      panel.classList.remove("is-open");
      overlay.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
      hamburger.focus();
    }

    hamburger.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open"))
        closeMenu();
    });

    // Close when a nav link is clicked (for single-page scrolling)
    var links = panel.querySelectorAll(".nav-panel-link");
    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }
})();
