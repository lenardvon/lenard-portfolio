
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
// GITHUB PUBLIC REPOSITORIES
// ========================================

const githubUsername = "lenardvon";
const repoGrid = document.querySelector("#github-repo-grid");
const repoStatus = document.querySelector("#github-repo-status");

function createRepoCard(repo) {
  const card = document.createElement("article");
  card.className = "github-repo-card";

  const heading = document.createElement("h4");
  heading.className = "github-repo-name";

  const titleLink = document.createElement("a");
  titleLink.href = repo.html_url;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  titleLink.textContent = repo.name;

  heading.appendChild(titleLink);

  const description = document.createElement("p");
  description.className = "github-repo-description";
  description.textContent =
    repo.description ||
    "No description has been added to this repository yet.";

  const meta = document.createElement("div");
  meta.className = "github-repo-meta";

  if (repo.language) {
    const language = document.createElement("span");
    language.className = "github-repo-language";
    language.textContent = repo.language;
    meta.appendChild(language);
  }

  const stars = document.createElement("span");
  stars.textContent = `★ ${repo.stargazers_count} stars`;
  meta.appendChild(stars);

  const forks = document.createElement("span");
  forks.textContent = `⑂ ${repo.forks_count} forks`;
  meta.appendChild(forks);

  const link = document.createElement("a");
  link.className = "github-repo-link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View Repository ↗";

  card.append(heading, description, meta, link);

  return card;
}

async function loadGitHubRepositories() {
  if (!repoGrid) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const repositories = await response.json();

    // Display up to six recently updated public repositories.
    const ownRepositories = repositories
      .filter((repo) => !repo.fork)
      .slice(0, 6);

    repoGrid.replaceChildren();

    if (ownRepositories.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "github-empty";
      emptyMessage.textContent =
        "No public repositories are available to display yet. Visit my GitHub profile to see my projects.";

      repoGrid.appendChild(emptyMessage);
      return;
    }

    ownRepositories.forEach((repo) => {
      repoGrid.appendChild(createRepoCard(repo));
    });

    if (repoStatus) {
      repoStatus.textContent =
        "Showing up to six recently updated public repositories.";
    }
  } catch (error) {
    console.error("Unable to load GitHub repositories:", error);

    repoGrid.replaceChildren();

    const errorMessage = document.createElement("p");
    errorMessage.className = "github-error";
    errorMessage.textContent =
      "Repositories could not be loaded right now. Please visit my GitHub profile to see my projects.";

    repoGrid.appendChild(errorMessage);

    if (repoStatus) {
      repoStatus.textContent =
        "The repository list needs an internet connection and access to the GitHub API.";
    }
  }
}

loadGitHubRepositories();

// ========================================
// CONTACT FORM VALIDATION
// Demo only: does not send email.
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
