
"use strict";

// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll("#nav-menu a");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    });
  });

  // Close the menu when switching back to desktop width.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    }
  });
}

// ========================================
// AUTOMATIC COPYRIGHT YEAR
// ========================================

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ========================================
// CONTACT FORM VALIDATION
// This demo does not send email.
// ========================================

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.className = "form-status";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();

      formStatus.textContent =
        "Please complete all fields using valid information.";

      formStatus.classList.add("error");
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = "Please complete all fields.";
      formStatus.classList.add("error");
      return;
    }

    formStatus.textContent =
      "Validation successful! This demo does not send messages yet. " +
      "A backend or configured form service is needed to deliver your message.";

    formStatus.classList.add("success");
  });
}
