/* =========================================================================
   main.js — Responsive Interactive Portfolio
   Vanilla JavaScript. No dependencies.
   -------------------------------------------------------------------------
   Modules in this file
     1. Config
     2. Utilities
     3. Theme (dark/light) toggle
     4. Navigation: mobile menu, smooth scroll, scrollspy, progress, to-top
     5. Typing effect
     6. Scroll-reveal + skill bars (IntersectionObserver)
     7. Accordion
     8. Projects: GitHub API fetch, filter, modal
     9. Contact form validation
    10. Init
   ========================================================================= */

(() => {
  "use strict";

  /* ------------------------------------------------------- 1. CONFIG */

  /**
   * TODO: replace with your real GitHub username.
   * The Projects section fetches live repositories from the public
   * GitHub REST API: https://api.github.com/users/<username>/repos
   */
  const GITHUB_USERNAME = "your-username";

  const CONFIG = {
    reposToShow: 12,       // max repositories to request/display
    apiBase: "https://api.github.com",
  };

  /* ---------------------------------------------------- 2. UTILITIES */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Escape untrusted text before it touches innerHTML. */
  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  /** Format an ISO date as a short, readable string. */
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  /** Reduce a language name to a CSS-safe slug for filter matching. */
  const slug = (str = "") => String(str).toLowerCase().replace(/[^a-z0-9]/g, "");

  /** Official-ish language colors, with a sensible fallback. */
  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
    Python: "#3572A5", Java: "#b07219", PHP: "#4F5D95", C: "#555555",
    "C++": "#f34b7d", "C#": "#178600", Ruby: "#701516", Go: "#00ADD8",
    Swift: "#F05138", Kotlin: "#A97BFF", Shell: "#89e051", Dart: "#00B4AB",
  };
  const langColor = (lang) => LANG_COLORS[lang] || "var(--accent)";

  /* ------------------------------------------- 3. THEME (DARK / LIGHT) */
  const root = document.documentElement;
  const themeToggle = $("#theme-toggle");

  const getStoredTheme = () => {
    try { return localStorage.getItem("theme"); } catch { return null; }
  };
  const storeTheme = (value) => {
    try { localStorage.setItem("theme", value); } catch { /* storage may be blocked */ }
  };

  function applyTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    const isDark = theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    $("#theme-icon")?.setAttribute(
      "d",
      isDark
        ? "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"
        : "M12 4v2m0 12v2m8-8h-2M6 12H4m13.6-5.6-1.4 1.4M7.8 16.2l-1.4 1.4m11.2 0-1.4-1.4M7.8 7.8 6.4 6.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
    );
  }

  function initTheme() {
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));

    themeToggle?.addEventListener("click", () => {
      const next = root.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* -------------------------------------------------------- 4. NAV */
  function initNav() {
    const header = $("#site-header");
    const menuBtn = $("#menu-toggle");
    const mobileMenu = $("#mobile-menu");
    const navLinks = $$('#nav-links .nav-link, #mobile-menu .nav-link');
    const progress = $("#scroll-progress");
    const toTop = $("#to-top");

    /* Sticky header style + scroll progress + back-to-top visibility */
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("scrolled", y > 20);
      toTop?.classList.toggle("hidden", y < 500);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      if (progress) progress.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    /* Mobile menu toggle */
    const closeMenu = () => {
      mobileMenu?.classList.add("hidden");
      menuBtn?.setAttribute("aria-expanded", "false");
      menuBtn?.setAttribute("aria-label", "Open menu");
    };
    menuBtn?.addEventListener("click", () => {
      const isOpen = !mobileMenu?.classList.contains("hidden");
      if (isOpen) return closeMenu();
      mobileMenu?.classList.remove("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
    });

    /* Smooth scrolling for in-page anchors (CSS scroll-behavior is the fallback) */
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        const headerOffset = (header?.offsetHeight || 0) + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
        // Move focus for keyboard/screen-reader users without a visual jump.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.replaceState(null, "", id);
      });
    });

    /* Scrollspy: highlight the link for the section in view */
    const sections = $$("main section[id]");
    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach((a) => {
              const active = a.getAttribute("href") === `#${id}`;
              a.classList.toggle("is-active", active);
              if (active) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ---------------------------------------------------- 5. TYPING */
  function initTyping() {
    const el = $("#typed");
    if (!el) return;
    const phrases = ["responsive websites.", "accessible interfaces.", "delightful interactions.", "clean, modern code."];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = phrases[0]; return; }

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

  /* ---------------------------------- 6. SCROLL-REVEAL + SKILL BARS */
  function initReveal() {
    /* Give a few layout blocks the reveal animation without editing markup. */
    const revealTargets = $$(
      "#about article, #projects .section-head, #journey .section-head, #contact > div > *"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const bars = $$(".bar > span");
    const items = $$(".reveal, .tl-item");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible", "visible"));
      bars.forEach((b) => (b.style.width = b.dataset.width));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible", "visible");
          if (entry.target.matches("article")) {
            $$(".bar > span", entry.target).forEach((b) => (b.style.width = b.dataset.width));
          }
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));

    /* Ensure bars animate even if their section never matches the selector above. */
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

  /* --------------------------------------------------- 7. ACCORDION */
  function initAccordion() {
    const triggers = $$(".acc-trigger");
    triggers.forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      const setOpen = (open) => {
        btn.setAttribute("aria-expanded", String(open));
        panel.classList.toggle("is-open", open);
      };
      btn.addEventListener("click", () => {
        setOpen(btn.getAttribute("aria-expanded") !== "true");
      });
    });
  }

  /* --------------------------------------------------- 8. PROJECTS */
  const FALLBACK_REPOS = [
    { name: "portfolio-website", description: "This responsive, interactive portfolio — HTML5, Tailwind CSS and vanilla JavaScript.", html_url: "https://github.com/", language: "HTML", stargazers_count: 12, forks_count: 3, updated_at: "2026-07-10T00:00:00Z", topics: ["portfolio", "tailwind", "javascript"] },
    { name: "weather-dashboard", description: "A weather dashboard consuming the OpenWeather API with live search and saved cities.", html_url: "https://github.com/", language: "JavaScript", stargazers_count: 8, forks_count: 2, updated_at: "2026-06-02T00:00:00Z", topics: ["api", "fetch", "dashboard"] },
    { name: "task-tracker", description: "A keyboard-friendly task tracker with keyboard shortcuts and localStorage persistence.", html_url: "https://github.com/", language: "JavaScript", stargazers_count: 5, forks_count: 1, updated_at: "2026-05-21T00:00:00Z", topics: ["localstorage", "a11y"] },
    { name: "css-art-gallery", description: "A gallery of pure-CSS illustrations exploring gradients, filters and blend modes.", html_url: "https://github.com/", language: "CSS", stargazers_count: 14, forks_count: 4, updated_at: "2026-04-11T00:00:00Z", topics: ["css", "art", "blend-modes"] },
    { name: "python-scraper", description: "A small, polite web scraper that extracts and structures public data.", html_url: "https://github.com/", language: "Python", stargazers_count: 6, forks_count: 1, updated_at: "2026-03-08T00:00:00Z", topics: ["python", "scraping"] },
    { name: "type-safe-utils", description: "A collection of small, well-tested TypeScript utilities.", html_url: "https://github.com/", language: "TypeScript", stargazers_count: 9, forks_count: 2, updated_at: "2026-02-19T00:00:00Z", topics: ["typescript", "utils"] },
  ];

  const state = { repos: [], filter: "all" };

  /** Build the HTML string for one repository card. */
  function repoCard(repo, index) {
    const lang = repo.language || "Other";
    return `
      <button type="button" class="repo-card" data-lang="${escapeHtml(slug(lang))}" data-index="${index}"
              aria-label="View details for ${escapeHtml(repo.name)}">
        <span class="flex items-center justify-between gap-3">
          <span class="repo-icon" aria-hidden="true">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 12v9M4 7.5 12 12l8-4.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="text-xs" style="color:${langColor(repo.language)}">● ${escapeHtml(lang)}</span>
        </span>
        <span class="font-display text-lg font-semibold break-words">${escapeHtml(repo.name)}</span>
        <span class="text-sm text-muted line-clamp-2">${escapeHtml(repo.description || "No description provided.")}</span>
        <span class="mt-auto flex items-center gap-4 pt-2 text-xs text-muted">
          <span aria-label="${repo.stargazers_count || 0} stars">★ ${repo.stargazers_count || 0}</span>
          <span aria-label="${repo.forks_count || 0} forks">⑂ ${repo.forks_count || 0}</span>
          <span>Updated ${escapeHtml(formatDate(repo.updated_at))}</span>
        </span>
      </button>`;
  }

  function renderRepos() {
    const grid = $("#repo-grid");
    if (!grid) return;
    const list = state.filter === "all"
      ? state.repos
      : state.repos.filter((r) => slug(r.language || "Other") === state.filter);

    if (!list.length) {
      grid.innerHTML = `<p class="text-muted sm:col-span-2 lg:col-span-3">No repositories match this filter.</p>`;
      return;
    }
    grid.innerHTML = list.map(repoCard).join("");
  }

  /** Open the modal with details for the clicked repository. */
  function openModal(repo) {
    const modal = $("#project-modal");
    if (!modal || !repo) return;

    $("#modal-kicker").textContent = repo.language ? `${repo.language} project` : "Repository";
    $("#modal-title").textContent = repo.name;
    $("#modal-body").innerHTML = `
      <p>${escapeHtml(repo.description || "No description provided.")}</p>
      <ul class="grid grid-cols-3 gap-3 pt-2 text-center">
        <li class="stat"><dt>Stars</dt><dd>${repo.stargazers_count || 0}</dd></li>
        <li class="stat"><dt>Forks</dt><dd>${repo.forks_count || 0}</dd></li>
        <li class="stat"><dt>Open issues</dt><dd>${repo.open_issues_count || 0}</dd></li>
      </ul>
      <p class="text-xs">Last updated ${escapeHtml(formatDate(repo.updated_at))}</p>`;

    const tags = $("#modal-tags");
    tags.innerHTML = (repo.topics || []).map((t) => `<li class="chip">#${escapeHtml(t)}</li>`).join("");

    const link = $("#modal-link");
    link.href = repo.html_url;

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");           // minimal fallback
    document.body.classList.add("modal-open");
    $("#project-modal .modal-panel")?.scrollTo(0, 0);
  }

  function closeModal() {
    const modal = $("#project-modal");
    if (!modal) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
  }

  function initModal() {
    const modal = $("#project-modal");
    if (!modal) return;

    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));

    /* Click on the area outside the panel (including the ::backdrop) closes it. */
    modal.addEventListener("click", (e) => {
      if (e.target !== modal) return;
      const r = modal.getBoundingClientRect();
      const outside =
        e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top  || e.clientY > r.bottom;
      if (outside) closeModal();
    });

    /* Keep body scroll-lock in sync however the dialog closes (Esc included). */
    modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

    /* Delegate card clicks (works for dynamically rendered cards). */
    $("#repo-grid")?.addEventListener("click", (e) => {
      const card = e.target.closest(".repo-card");
      if (!card) return;
      openModal(state.repos[Number(card.dataset.index)]);
    });
  }

  /** Fetch repositories from the GitHub API, with a graceful fallback. */
  async function loadRepos() {
    const grid = $("#repo-grid");
    const status = $("#repo-status");
    const isPlaceholder = GITHUB_USERNAME === "your-username";

    document.querySelectorAll("#repo-filters .filter-btn").forEach((b) => b.disabled = true);
    if (status) status.textContent = "Loading repositories…";

    try {
      if (isPlaceholder) throw new Error("placeholder-username");

      const res = await fetch(
        `${CONFIG.apiBase}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos` +
          `?sort=updated&per_page=${CONFIG.reposToShow}`,
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
      /* Fallback keeps the section useful when the API is unavailable. */
      state.repos = FALLBACK_REPOS;
      const reason =
        err.message === "rate-limit" ? "GitHub rate limit reached"
        : err.message === "not-found" ? "GitHub user not found"
        : err.message === "placeholder-username" ? "Set GITHUB_USERNAME in js/main.js"
        : "GitHub API unavailable";
      if (status) status.textContent = `${reason} — showing sample projects`;
    } finally {
      renderRepos();
      document.querySelectorAll("#repo-filters .filter-btn").forEach((b) => b.disabled = false);
    }
  }

  function initProjects() {
    state.repos = [];
    const filters = $("#repo-filters");
    filters?.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      state.filter = btn.dataset.filter;
      $$(".filter-btn", filters).forEach((b) => b.classList.toggle("is-active", b === btn));
      renderRepos();
    });
    $("#reload-repos")?.addEventListener("click", loadRepos);

    /* Keep the contact links pointing at the configured account. */
    if (GITHUB_USERNAME !== "your-username") {
      const href = `https://github.com/${GITHUB_USERNAME}`;
      const link = $("#gh-profile-link");
      if (link) { link.href = href; link.textContent = `github.com/${GITHUB_USERNAME}`; }
    }

    loadRepos();
  }

  /* ------------------------------------------- 9. CONTACT FORM */
  function initForm() {
    const form = $("#contact-form");
    if (!form) return;
    const result = $("#form-result");

    const showError = (field, message) => {
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const validate = () => {
      let ok = true;
      const name = $("#name"), email = $("#email"), message = $("#message");

      if (!name.value.trim()) { showError(name, "Please enter your name."); ok = false; }
      else showError(name, "");

      if (!email.value.trim()) { showError(email, "Please enter your email."); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "Please enter a valid email address."); ok = false;
      } else showError(email, "");

      if (message.value.trim().length < 10) {
        showError(message, "Please write at least 10 characters."); ok = false;
      } else showError(message, "");

      return ok;
    };

    /* Live re-validation once a field has been touched */
    ["#name", "#email", "#message"].forEach((sel) => {
      const field = $(sel);
      field?.addEventListener("blur", () => { if (field.value) validate(); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();                 // no backend in this coursework build
      if (!validate()) {
        if (result) result.textContent = "Please fix the highlighted fields.";
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      if (result) result.textContent = `Thanks, ${$("#name").value.trim()}! This demo form doesn't send yet — connect it to a service like Formspree or a backend endpoint.`;
      form.reset();
    });
  }

  /* ------------------------------------------------------- 10. INIT */
  function init() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    initTheme();
    initNav();
    initTyping();
    initAccordion();
    initModal();
    initProjects();
    initForm();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
