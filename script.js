const projects = [
  {
    title: "Glow Estética",
    description:
      "Landing page de um studio especializado em alongamento de unhas e cílios, com foco em atrair novas clientes, destacar serviços e facilitar o agendamento online.",
    image: "assets/glow-preview.png",
    url: "https://lashdesing.netlify.app/",
    theme: {
      accent: "#6ff0ff",
      surface: "rgba(14, 22, 54, 0.9)",
      line: "rgba(111, 240, 255, 0.35)"
    }
  }
];

const projectsContainer = document.getElementById("projects");
const cardTemplate = document.getElementById("project-card-template");

if (projects.length === 1) {
  projectsContainer.classList.add("projects--single");
}

if (projects.length === 2) {
  projectsContainer.classList.add("projects--two");
}

if (projects.length === 3) {
  projectsContainer.classList.add("projects--three");
}

function createCard(project) {
  const cardNode = cardTemplate.content.cloneNode(true);

  const card = cardNode.querySelector(".card");
  const link = cardNode.querySelector(".card__link");
  const image = cardNode.querySelector(".card__preview");
  const title = cardNode.querySelector(".card__title");
  const description = cardNode.querySelector(".card__description");

  if (project.theme) {
    card.style.setProperty("--project-accent", project.theme.accent);
    card.style.setProperty("--project-surface", project.theme.surface);
    card.style.setProperty("--project-line", project.theme.line);
  }

  link.href = project.url;
  link.setAttribute("aria-label", `Abrir projeto ${project.title}`);

  title.textContent = project.title;
  description.textContent = project.description;

  image.src = project.image;
  image.alt = `Preview do projeto ${project.title}`;

  return cardNode;
}

projects.forEach((project) => {
  projectsContainer.appendChild(createCard(project));
});

const quoteForm = document.getElementById("quote-form");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = formData.get("name");
    const niche = formData.get("niche");
    const goal = formData.get("goal");

    const message =
      `Ola Igor, meu nome e ${name}. ` +
      `Meu nicho e ${niche}. ` +
      `Objetivo da minha landing page: ${goal}.`;

    const whatsappUrl = `https://wa.me/5547984054897?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
