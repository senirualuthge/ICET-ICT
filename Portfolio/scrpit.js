
/* =====================================
   1. SMOOTH SCROLLING
===================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (event) {
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


/* =====================================
   2. PROJECT DETAILS MODAL
===================================== */

const modal = document.createElement("div");

modal.className = "project-modal";

modal.innerHTML = `
    <div class="modal-content" role="dialog"
         aria-modal="true" aria-labelledby="modal-title">

        <button class="modal-close" aria-label="Close dialog">
            &times;
        </button>

        <h2 id="modal-title"></h2>
        <p class="modal-technology"></p>
        <p class="modal-description"></p>
        <a class="modal-link" href="#">View Project</a>

    </div>
`;

document.body.appendChild(modal);

const modalTitle = modal.querySelector("#modal-title");
const modalTechnology = modal.querySelector(".modal-technology");
const modalDescription = modal.querySelector(".modal-description");
const modalLink = modal.querySelector(".modal-link");
const closeButton = modal.querySelector(".modal-close");

function closeModal() {
    modal.classList.remove("active");
}

document.querySelectorAll(".project").forEach(project => {
    const title = project.querySelector("h3");
    const description = project.querySelector("p");
    const technology = project.querySelector(".technology");
    const projectLink = project.querySelector("a");

    if (!title || !projectLink) return;

    const detailsButton = document.createElement("button");

    detailsButton.type = "button";
    detailsButton.className = "details-button";
    detailsButton.textContent = "More Details";

    project.appendChild(detailsButton);

    detailsButton.addEventListener("click", () => {
        modalTitle.textContent = title.textContent;
        modalTechnology.textContent = technology
            ? technology.textContent
            : "Web Development";

        modalDescription.textContent = description
            ? description.textContent
            : "Portfolio project";

        modalLink.href = projectLink.href;
        modalLink.style.display = "inline-block";

        modal.classList.add("active");
        closeButton.focus();
    });
});

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* =====================================
   3. GITHUB API INTEGRATION
===================================== */

const githubUsername = "senirualuthge";

const githubSection = document.createElement("section");

githubSection.id = "github-projects";
githubSection.className = "section";

githubSection.innerHTML = `
    <div class="container">
        <h2>My GitHub Repositories</h2>

        <p class="github-intro">
            Explore my repositories and development projects.
        </p>

        <p class="github-status" aria-live="polite">
            Loading repositories...
        </p>

        <div class="github-repositories"></div>

        <a class="github-profile"
           href="https://github.com/${githubUsername}"
           target="_blank"
           rel="noopener noreferrer">
            Visit My GitHub Profile →
        </a>
    </div>
`;

const contactSection = document.querySelector("#contact");
const projectsSection = document.querySelector("#projects");

if (contactSection) {
    contactSection.before(githubSection);
} else if (projectsSection) {
    projectsSection.after(githubSection);
} else {
    document.querySelector("main")?.appendChild(githubSection);
}

async function loadGitHubRepositories() {
    const status = githubSection.querySelector(".github-status");
    const repositoryContainer =
        githubSection.querySelector(".github-repositories");

    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
            throw new Error("Could not retrieve repositories.");
        }

        const repositories = await response.json();

        status.textContent = "";

        if (repositories.length === 0) {
            status.textContent = "No public repositories were found.";
            return;
        }

        repositories.forEach(repo => {
            const card = document.createElement("article");
            card.className = "github-card";

            const title = document.createElement("h3");
            title.textContent = repo.name;

            const description = document.createElement("p");
            description.textContent =
                repo.description || "No description provided.";

            const language = document.createElement("span");
            language.className = "github-language";
            language.textContent = repo.language || "Other";

            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View Repository →";

            card.append(title, description, language, link);
            repositoryContainer.appendChild(card);
        });

    } catch (error) {
        status.textContent =
            "Repositories could not be loaded. Please visit my GitHub profile.";

        console.error("GitHub API error:", error);
    }
}

loadGitHubRepositories();
