/* =========================================================================
   main.js — Responsive Interactive Portfolio (Bootstrap 5 build)
   Uses Bootstrap's own components (ScrollSpy, Modal, Toast) plus vanilla JS.
   -------------------------------------------------------------------------
     1. Config
     2. Utilities
     3. Theme (data-bs-theme color modes)
     4. Navbar, scroll progress, back-to-top
     5. Typing effect
     6. Scroll-reveal + skill progress bars
     7. Projects: GitHub API, filter, Bootstrap modal
     8. Contact form validation + toast
     9. Init
   ========================================================================= */

(() => {
  "use strict";

  /* ------------------------------------------------------- 1. CONFIG */

  /**
   * TODO: replace with your real GitHub username.
   * Repositories are fetched from the public GitHub REST API.
   */
  const GITHUB_USERNAME = "your-username";

  const CONFIG = { reposToShow: 12, apiBase: "https://api.github.com" };

  /* ---------------------------------------------------- 2. UTILITIES */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const slug = (str = "") => String(str).toLowerCase().replace(/[^a-z0-9]/g, "");

  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
    Python: "#3572A5", Java: "#b07219", PHP: "#4F5D95", C: "#555555",
    "C++": "#f34b7d", "C#": "#178600", Ruby: "#701516", Go: "#00ADD8",
    Swift: "#F05138", Kotlin: "#A97BFF", Shell: "#89e051", Dart: "#00B4AB",
  };
  const langColor = (lang) => LANG_COLORS[lang] || "var(--accent)";

  /* ------------------------------------------------------- 3. THEME */
  const root = document.documentElement;
  const themeToggle = $("#theme-toggle");
  const themeIcon = $("#theme-icon");

  const getStoredTheme = () => { try { return localStorage.getItem("theme"); } catch { return null; } };
  const storeTheme = (v) => { try { localStorage.setItem("theme", v); } catch { /* blocked */ } };

  function applyTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    const isDark = theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    if (themeIcon) themeIcon.className = isDark ? "bi bi-moon-stars" : "bi bi-sun";
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0b1020" : "#ffffff");
  }

  function initTheme() {
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));

    themeToggle?.addEventListener("click", () => {
      const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* -------------------------------- 4. NAVBAR / PROGRESS / BACK-TO-TOP */
  function initNav() {
    const nav = $("#mainNav");
    const progress = $("#scroll-progress");
    const toTop = $("#to-top");
    const collapseEl = $("#mobileMenu");

    const onScroll = () => {
      const y = window.scrollY;
      nav?.classList.toggle("scrolled", y > 20);
      toTop?.classList.toggle("d-none", y < 500);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    /* Close the mobile menu after choosing a link.
       (Smooth scrolling + offset are handled by Bootstrap's ScrollSpy
        data-bs-smooth-scroll plus the CSS scroll-margin-top rule.) */
    $$('#mobileMenu a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (!collapseEl?.classList.contains("show")) return;
        const instance = window.bootstrap?.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        instance?.hide();
      });
    });
  }

  /* Bootstrap ScrollSpy reads layout offsets, so refresh it after the
     project grid changes height. */
  function refreshSpy() {
    try { window.bootstrap?.ScrollSpy.getOrCreateInstance(document.body, { target: "#navLinks" }).refresh(); }
    catch { /* ScrollSpy not available — non-fatal */ }
  }

  /* ---------------------------------------------------- 5. TYPING */
  function initTyping() {
    const el = $("#typed");
    if (!el) return;
    const phrases = ["responsive websites.", "accessible interfaces.", "delightful interactions.", "clean, modern code."];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = phrases[0]; return; }

    let phrase = 0, char = 0, deleting = false;
    const tick = () => {
      const current = phrases[phrase];
      el.textContent = current.slice(0, char);
      if (!deleting && char < current.length) { char++; setTimeout(tick, 65); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1400); }
      else if (char > 0) { char--; setTimeout(tick, 30); }
      else { deleting = false; phrase = (phrase + 1) % phrases.length; setTimeout(tick, 300); }
    };
    tick();
  }

  /* ---------------------------------- 6. SCROLL-REVEAL + PROGRESS BARS */
  function initReveal() {
    $$("#about .col-lg-6, #projects .section-head, #journey .section-head, #contact .col-lg-6")
      .forEach((el) => el.classList.add("reveal"));

    const bars = $$(".progress-bar[data-width]");
    const items = $$(".reveal, .tl-item");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible", "visible"));
      bars.forEach((b) => (b.style.width = b.dataset.width));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible", "visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => revealObserver.observe(el));

    const barObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((b) => barObserver.observe(b));
  }

  /* --------------------------------------------------- 7. PROJECTS */
  const FALLBACK_REPOS = [
    { name: "portfolio-bootstrap", description: "This responsive portfolio — HTML5, Bootstrap 5 and vanilla JavaScript.", html_url: "https://github.com/", language: "HTML", stargazers_count: 11, forks_count: 3, updated_at: "2026-07-10T00:00:00Z", topics: ["portfolio", "bootstrap", "javascript"] },
    { name: "weather-dashboard", description: "A weather dashboard consuming the OpenWeather API with live search and saved cities.", html_url: "https://github.com/", language: "JavaScript", stargazers_count: 8, forks_count: 2, updated_at: "2026-06-02T00:00:00Z", topics: ["api", "fetch", "dashboard"] },
    { name: "task-tracker", description: "A keyboard-friendly task tracker with keyboard shortcuts and localStorage persistence.", html_url: "https://github.com/", language: "JavaScript", stargazers_count: 5, forks_count: 1, updated_at: "2026-05-21T00:00:00Z", topics: ["localstorage", "a11y"] },
    { name: "css-art-gallery", description: "A gallery of pure-CSS illustrations exploring gradients, filters and blend modes.", html_url: "https://github.com/", language: "CSS", stargazers_count: 14, forks_count: 4, updated_at: "2026-04-11T00:00:00Z", topics: ["css", "art", "blend-modes"] },
    { name: "python-scraper", description: "A small, polite web scraper that extracts and structures public data.", html_url: "https://github.com/", language: "Python", stargazers_count: 6, forks_count: 1, updated_at: "2026-03-08T00:00:00Z", topics: ["python", "scraping"] },
    { name: "type-safe-utils", description: "A collection of small, well-tested TypeScript utilities.", html_url: "https://github.com/", language: "TypeScript", stargazers_count: 9, forks_count: 2, updated_at: "2026-02-19T00:00:00Z", topics: ["typescript", "utils"] },
  ];

  const state = { repos: [], filter: "all" };

  /** Build the HTML for one repository card (Bootstrap grid column). */
  function repoCard(repo, index) {
    const lang = repo.language || "Other";
    return `
      <div class="col-md-6 col-lg-4">
        <button type="button" class="repo-card" data-lang="${escapeHtml(slug(lang))}" data-index="${index}"
                aria-label="View details for ${escapeHtml(repo.name)}">
          <span class="d-flex align-items-center justify-content-between gap-2">
            <span class="repo-icon" aria-hidden="true"><i class="bi bi-box-seam"></i></span>
            <span class="small text-nowrap" style="color:${langColor(repo.language)}">
              <i class="bi bi-circle-fill" style="font-size:.5rem;vertical-align:middle" aria-hidden="true"></i>
              ${escapeHtml(lang)}
            </span>
          </span>
          <span class="repo-name fs-5">${escapeHtml(repo.name)}</span>
          <span class="small text-body-secondary clamp-2">${escapeHtml(repo.description || "No description provided.")}</span>
          <span class="d-flex align-items-center gap-3 pt-2 mt-auto small text-body-secondary">
            <span aria-label="${repo.stargazers_count || 0} stars"><i class="bi bi-star" aria-hidden="true"></i> ${repo.stargazers_count || 0}</span>
            <span aria-label="${repo.forks_count || 0} forks"><i class="bi bi-diagram-2" aria-hidden="true"></i> ${repo.forks_count || 0}</span>
            <span class="ms-auto">Updated ${escapeHtml(formatDate(repo.updated_at))}</span>
          </span>
        </button>
      </div>`;
  }

  function renderRepos() {
    const grid = $("#repo-grid");
    if (!grid) return;
    const list = state.filter === "all"
      ? state.repos
      : state.repos.filter((r) => slug(r.language || "Other") === state.filter);

    grid.innerHTML = list.length
      ? list.map(repoCard).join("")
      : `<div class="col-12"><p class="text-body-secondary mb-0">No repositories match this filter.</p></div>`;

    refreshSpy();
  }

  function openModal(repo) {
    if (!repo) return;
    const modalEl = $("#project-modal");
    if (!modalEl) return;

    $("#modal-kicker").textContent = repo.language ? `${repo.language} project` : "Repository";
    $("#modal-title").textContent = repo.name;
    $("#modal-body").innerHTML = `
      <p class="mb-0">${escapeHtml(repo.description || "No description provided.")}</p>
      <div class="row g-2 text-center">
        <div class="col-4"><div class="modal-stat"><div class="label">Stars</div><div class="value">${repo.stargazers_count || 0}</div></div></div>
        <div class="col-4"><div class="modal-stat"><div class="label">Forks</div><div class="value">${repo.forks_count || 0}</div></div></div>
        <div class="col-4"><div class="modal-stat"><div class="label">Issues</div><div class="value">${repo.open_issues_count || 0}</div></div></div>
      </div>
      <p class="small mb-0">Last updated ${escapeHtml(formatDate(repo.updated_at))}</p>`;

    $("#modal-tags").innerHTML = (repo.topics || [])
      .map((t) => `<li class="chip">#${escapeHtml(t)}</li>`).join("");

    const link = $("#modal-link");
    if (link) link.href = repo.html_url;

    window.bootstrap?.Modal.getOrCreateInstance(modalEl).show();
  }

  async function loadRepos() {
    const status = $("#repo-status");
    const isPlaceholder = GITHUB_USERNAME === "your-username";

    $$("#repo-filters .filter-btn").forEach((b) => (b.disabled = true));
    if (status) status.textContent = "Loading repositories…";

    try {
      if (isPlaceholder) throw new Error("placeholder-username");

      const res = await fetch(
        `${CONFIG.apiBase}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=${CONFIG.reposToShow}`,
        { headers: { Accept: "application/vnd.github+json" } }
      );

      if (res.status === 403) throw new Error("rate-limit");
      if (res.status === 404) throw new Error("not-found");
      if (!res.ok) throw new Error(`http-${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("empty");

      state.repos = data.filter((r) => !r.fork).slice(0, CONFIG.reposToShow);
      if (!state.repos.length) state.repos = data.slice(0, CONFIG.reposToShow);
      if (status) status.textContent = `Live from GitHub · ${state.repos.length} repositories`;
    } catch (err) {
      state.repos = FALLBACK_REPOS;
      const reason =
        err.message === "rate-limit" ? "GitHub rate limit reached"
        : err.message === "not-found" ? "GitHub user not found"
        : err.message === "placeholder-username" ? "Set GITHUB_USERNAME in js/main.js"
        : "GitHub API unavailable";
      if (status) status.textContent = `${reason} — showing sample projects`;
    } finally {
      renderRepos();
      $$("#repo-filters .filter-btn").forEach((b) => (b.disabled = false));
    }
  }

  function initProjects() {
    const filters = $("#repo-filters");

    filters?.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      state.filter = btn.dataset.filter;
      $$(".filter-btn", filters).forEach((b) => b.classList.toggle("is-active", b === btn));
      renderRepos();
    });

    $("#reload-repos")?.addEventListener("click", loadRepos);

    $("#repo-grid")?.addEventListener("click", (e) => {
      const card = e.target.closest(".repo-card");
      if (card) openModal(state.repos[Number(card.dataset.index)]);
    });

    if (GITHUB_USERNAME !== "your-username") {
      const href = `https://github.com/${GITHUB_USERNAME}`;
      const link = $("#gh-profile-link");
      if (link) { link.href = href; link.textContent = `github.com/${GITHUB_USERNAME}`; }
    }

    loadRepos();
  }

  /* -------------------------------------- 8. CONTACT FORM + TOAST */
  function initForm() {
    const form = $("#contact-form");
    if (!form) return;

    const showToast = (message) => {
      const toastEl = $("#form-toast");
      const msg = $("#toast-message");
      if (msg) msg.textContent = message;
      window.bootstrap?.Toast.getOrCreateInstance(toastEl).show();
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();          // no backend in this coursework build

      const name = $("#name");
      // Custom email check on top of the native constraint validation.
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim());
      if (!emailOk) $("#email").setCustomValidity("invalid");
      else $("#email").setCustomValidity("");

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        form.querySelector(":invalid")?.focus();
        return;
      }

      showToast(`Thanks, ${name.value.trim()}! This demo form doesn't send yet — connect it to Formspree or a backend.`);
      form.reset();
      form.classList.remove("was-validated");
    });

    $$("#contact-form .form-control").forEach((field) => {
      field.addEventListener("input", () => {
        if (!form.classList.contains("was-validated")) return;
        field.setCustomValidity("");
      });
    });
  }

  /* ------------------------------------------------------- 9. INIT */
  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    initTheme();
    initNav();
    initTyping();
    initProjects();
    initForm();
    initReveal();

    /* Grid height changes as repos render; keep ScrollSpy accurate. */
    window.addEventListener("load", refreshSpy);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
