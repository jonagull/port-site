import { projects } from "./projects.js";

const projectsNode = document.getElementById("projects-parent");

for (var i = 0; i < projects.length; i++) {
    let projectContainer = document.createElement("div");
    projectContainer.setAttribute("class", "project__container");

    projectContainer.innerHTML = `
    <div class="project-text__container">
        <h1>${projects[i].title}</h1>
        <p>${projects[i].description}</p>
        <button>Link</button>
    </div>

    <div class="project-image__container">
        <img src="${projects[i].image}" alt="">
    </div>
    `;

    projectsNode.appendChild(projectContainer);
}
