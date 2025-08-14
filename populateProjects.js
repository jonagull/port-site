import { projects } from "./projects.js";

function createProjectCard(project, index) {
    const cardClass = project.featured
        ? "project-card featured"
        : "project-card";
    const animationDelay = (index + 1) * 0.1;

    const techTags = project.tech
        .map((tech) => `<span class="tech-tag">${tech}</span>`)
        .join("");

    const liveDemoText =
        project.category === "Game" ? "Play Game" : "View Live";
    const liveDemoClass =
        project.liveDemo && project.liveDemo !== "#"
            ? "project-btn primary"
            : "project-btn primary disabled";
    const githubClass =
        project.github && project.github !== "#"
            ? "project-btn"
            : "project-btn disabled";

    return `
        <div class="${cardClass}" style="animation-delay: ${animationDelay}s;">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <div class="project-overlay-content">
                        <h4>${project.title}</h4>
                        <p>${project.category}</p>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-category">${
                        project.featured ? "Featured" : project.category
                    }</span>
                </div>
                <p class="project-description">
                    ${project.description}
                </p>
                <div class="project-tech">
                    ${techTags}
                </div>
                <div class="project-actions">
                    <a href="${
                        project.liveDemo
                    }" class="${liveDemoClass}" target="_blank" rel="noopener noreferrer">
                        ${liveDemoText}
                    </a>
                    <a href="${
                        project.github
                    }" class="${githubClass}" target="_blank" rel="noopener noreferrer">
                        Source Code
                    </a>
                </div>
            </div>
        </div>
    `;
}

function populateProjects() {
    const projectsGrid = document.getElementById("projects-grid");

    if (!projectsGrid) {
        console.error("Projects grid element not found");
        return;
    }

    // Sort projects: featured first, then by title
    const sortedProjects = projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
    });

    // Generate HTML for all projects
    const projectsHTML = sortedProjects
        .map((project, index) => createProjectCard(project, index))
        .join("");

    // Insert the HTML
    projectsGrid.innerHTML = projectsHTML;

    // Add loading animation to project cards
    const projectCards = projectsGrid.querySelectorAll(".project-card");
    projectCards.forEach((card, index) => {
        card.classList.add("loading");

        // Trigger animation when card comes into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("loaded");
                        }, index * 100);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        observer.observe(card);
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", populateProjects);

// Export for potential use in other modules
export { populateProjects };
