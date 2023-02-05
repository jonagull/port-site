import { projects } from "./projects.js";

const projectsNode = document.getElementById("projects-parent");

for (var i = 0; i < projects.length; i++) {
    let projectContainer = document.createElement("a");
    projectContainer.setAttribute("class", "card");

    if (projects[i].link) {
        projectContainer.setAttribute("href", projects[i].link);
    }

    projectContainer.innerHTML = `
                <div class="card__background"
                    style="background-image: url(${projects[i].image})">
                </div>
                <div class="card__content">
                    <p class="card__category">${projects[i].title}</p>
                    <h3 class="card__heading">${projects[i].description}</h3>
                </div>
    `;

    projectsNode.appendChild(projectContainer);
}
