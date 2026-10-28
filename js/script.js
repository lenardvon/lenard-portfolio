
/* =========================================
   LENARD PORTFOLIO - JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const appLayout = document.querySelector(".app-layout");
  const sidebar = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapseBtn");
  const collapseIcon = document.getElementById("collapseIcon");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const pageHeading = document.getElementById("pageHeading");
  const breadcrumbPage = document.getElementById("breadcrumbPage");
  const navItems = document.querySelectorAll(".nav-item");
  const pageViews = document.querySelectorAll(".page-view");

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  // CHANGE THIS to your actual email address.
  // Example: const CONTACT_EMAIL = "yourname@gmail.com";
  const CONTACT_EMAIL = "lenardvona@gmail.com";

  const GITHUB_USERNAME = "lenardvon";
  const GITHUB_API =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`;

  // =========================================
  // PAGE NAVIGATION
  // =========================================

  function showPage(pageName, updateHash = true) {
    const targetPage = document.getElementById(`page-${pageName}`);

    // Do not navigate to a page that does not exist.
    if (!targetPage) {
      return;
    }

    pageViews.forEach((page) => {
      const isActive = page.id === `page-${pageName}`;

      page.classList.toggle("active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
    });

    navItems.forEach((item) => {
      const isActive = item.dataset.page === pageName;

      item.classList.toggle("active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    const title = targetPage.dataset.title || "Dashboard";

    pageHeading.textContent = title;
    breadcrumbPage.textContent = title;
    document.title = `${title} | Lenard Von Alcantara`;

    // Update the URL without loading a separate HTML file.
    if (updateHash) {
      history.replaceState(null, "", `#${pageName}`);
    }

    closeMobileSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Sidebar menu buttons.
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      showPage(item.dataset.page);
    });
  });

  // Dashboard buttons and cards that open another view.
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.go);
    });
  });

  // Support links such as #projects and #contact.
  document.querySelectorAll("[data-page]").forEach((link) => {
    if (link.tagName === "A") {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showPage(link.dataset.page);
      });
    }
  });

  // Allow direct links such as index.html#projects.
  function loadPageFromHash() {
    const requestedPage = window.location.hash.replace("#", "");
    const pageExists = document.getElementById(`page-${requestedPage}`);

    showPage(pageExists ? requestedPage : "dashboard", false);
  }

  window.addEventListener("hashchange", loadPageFromHash);

  // =========================================
  // COLLAPSIBLE DESKTOP SIDEBAR
  // =========================================

  const savedSidebarState = localStorage.getItem("portfolioSidebarCollapsed");

  if (savedSidebarState === "true" && !mobileQuery.matches) {
    appLayout.classList.add("sidebar-collapsed");
  }

  function updateCollapseButton() {
    const isCollapsed = appLayout.classList.contains("sidebar-collapsed");

    collapseIcon.textContent = isCollapsed ? "›" : "‹";
    collapseBtn.setAttribute(
      "aria-label",
      isCollapsed ? "Expand sidebar" : "Collapse sidebar"
    );
    collapseBtn.title = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
  }

  collapseBtn.addEventListener("click", () => {
    appLayout.classList.toggle("sidebar-collapsed");

    localStorage.setItem(
      "portfolioSidebarCollapsed",
      String(appLayout.classList.contains("sidebar-collapsed"))
    );

    updateCollapseButton();
  });

  updateCollapseButton();

  // =========================================
  // MOBILE SIDEBAR
  // =========================================

  function closeMobileSidebar() {
    appLayout.classList.remove("mobile-sidebar-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.setAttribute("aria-label", "Open navigation");
  }

  function toggleMobileSidebar() {
    const isOpen = appLayout.classList.toggle("mobile-sidebar-open");

    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  }

  mobileMenuBtn.addEventListener("click", toggleMobileSidebar);
  sidebarOverlay.addEventListener("click", closeMobileSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileSidebar();
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    closeMobileSidebar();

    if (event.matches) {
      appLayout.classList.remove("sidebar-collapsed");
    } else {
      updateCollapseButton();
    }
  });

  // =========================================
  // PROFILE IMAGE FALLBACK
  // =========================================

  function setupProfileImage(image) {
    const fallback = image.parentElement.querySelector(".avatar-fallback");

    if (!fallback) {
      return;
    }

    function showFallback() {
      image.style.display = "none";
      fallback.style.display = "grid";
    }

    function showImage() {
      image.style.display = "block";
      fallback.style.display = "none";
    }

    image.addEventListener("error", showFallback);
    image.addEventListener("load", showImage);

    if (image.complete) {
      if (image.naturalWidth > 0) {
        showImage();
      } else {
        showFallback();
      }
    }
  }

  document.querySelectorAll(".profile-image").forEach(setupProfileImage);

  // =========================================
  // GITHUB REPOSITORIES
  // =========================================

  const repoGrid = document.getElementById("github-repo-grid");
  const repoStatus = document.getElementById("github-repo-status");
  const repoCount = document.getElementById("github-repo-count");

  function createRepoCard(repo) {
    const card = document.createElement("article");
    card.className = "repo-card";

    const heading = document.createElement("h3");
    const link = document.createElement("a");

    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name;

    heading.appendChild(link);

    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent =
      repo.description || "No description provided for this repository.";

    const metadata = document.createElement("div");
    metadata.className = "repo-meta";

    if (repo.language) {
      const language = document.createElement("span");
      language.className = "repo-language";
      language.textContent = `● ${repo.language}`;
      metadata.appendChild(language);
    }

    const stars = document.createElement("span");
    stars.textContent = `★ ${repo.stargazers_count} stars`;

    const forks = document.createElement("span");
    forks.textContent = `⑂ ${repo.forks_count} forks`;

    metadata.append(stars, forks);
    card.append(heading, description, metadata);

    return card;
  }

  async function loadGitHubRepositories() {
    if (!repoGrid || !repoStatus) {
      return;
    }

    repoStatus.textContent = "Loading public repositories...";

    try {
      const response = await fetch(GITHUB_API, {
        headers: {
          Accept: "application/vnd.github+json"
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("GitHub user was not found.");
        }

        if (response.status === 403) {
          throw new Error(
            "GitHub API rate limit reached. Please try again later."
          );
        }

        throw new Error("Unable to retrieve GitHub repositories.");
      }

      const repositories = await response.json();

      const publicRepos = repositories
        .filter((repo) => !repo.fork)
        .sort((a, b) =>
          new Date(b.updated_at) - new Date(a.updated_at)
        );

      repoGrid.replaceChildren();

      if (repoCount) {
        repoCount.textContent = `${publicRepos.length} public repositories`;
      }

      if (publicRepos.length === 0) {
        repoStatus.textContent =
          "No public non-fork repositories were found.";
        return;
      }

      publicRepos.slice(0, 6).forEach((repo) => {
        repoGrid.appendChild(createRepoCard(repo));
      });

      repoStatus.textContent =
        `Showing ${Math.min(publicRepos.length, 6)} recently updated repositories.`;

      if (publicRepos.length > 6) {
        const moreLink = document.createElement("a");
        moreLink.className = "btn btn-secondary";
        moreLink.href = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;
        moreLink.target = "_blank";
        moreLink.rel = "noopener noreferrer";
        moreLink.textContent = "View all repositories on GitHub ↗";

        moreLink.style.gridColumn = "1 / -1";
        moreLink.style.justifySelf = "start";

        repoGrid.appendChild(moreLink);
      }
    } catch (error) {
      console.error("GitHub repository error:", error);

      repoStatus.textContent =
        `${error.message} You can still visit the GitHub profile directly.`;

      if (repoCount) {
        repoCount.textContent = "Unavailable";
      }
    }
  }

  loadGitHubRepositories();

  // =========================================
  // CONTACT EMAIL
  // =========================================

  const contactEmailText = document.getElementById("contact-email-text");
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (contactEmailText) {
    if (CONTACT_EMAIL.trim()) {
      contactEmailText.textContent = CONTACT_EMAIL;

      const emailLink = document.createElement("a");
      emailLink.href = `mailto:${CONTACT_EMAIL}`;
      emailLink.textContent = CONTACT_EMAIL;
      emailLink.style.color = "var(--green)";
      emailLink.style.fontWeight = "700";

      contactEmailText.replaceChildren(emailLink);
    } else {
      contactEmailText.textContent = "Email address not configured yet.";
    }
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      if (!CONTACT_EMAIL.trim()) {
        contactFeedback.textContent =
          "Add your email address to CONTACT_EMAIL in js/script.js first.";
        return;
      }

      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        copyEmailBtn.textContent = "Email Copied!";

        contactFeedback.textContent =
          "Your email address was copied to the clipboard.";

        window.setTimeout(() => {
          copyEmailBtn.textContent = "Copy Email Address";
        }, 2000);
      } catch (error) {
        contactFeedback.textContent =
          `Please copy your email manually: ${CONTACT_EMAIL}`;
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      if (!CONTACT_EMAIL.trim()) {
        contactFeedback.textContent =
          "Configure CONTACT_EMAIL in js/script.js before using this form.";
        return;
      }

      const formData = new FormData(contactForm);

      const senderName = String(formData.get("name") || "").trim();
      const senderEmail = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const emailSubject = encodeURIComponent(subject);
      const emailBody = encodeURIComponent(
        `Name: ${senderName}\n` +
        `Email: ${senderEmail}\n\n` +
        `Message:\n${message}`
      );

      contactFeedback.textContent =
        "Opening your email application. Review and send the message there.";

      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    });
  }

  // =========================================
  // FOOTER AND BACK TO TOP
  // =========================================

  const currentYear = document.getElementById("currentYear");
  const backToTop = document.getElementById("backToTop");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Open the requested page on first load.
  loadPageFromHash();
});
