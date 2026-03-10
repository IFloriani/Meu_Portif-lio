// Mostrar/esconder botão voltar ao topo
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.hidden = false;
  } else {
    backToTop.hidden = true;
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
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

    const name = quoteForm.name.value.trim();
    const niche = quoteForm.niche.value.trim();
    const goal = quoteForm.goal.value.trim();

    // Validação básica
    if (!name || !niche || !goal) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (name.length < 2) {
      alert('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    const button = quoteForm.querySelector("button[type='submit']");
    const originalText = button.textContent;
    button.textContent = "Enviando...";
    button.disabled = true;

    // Sanitização básica
    const sanitizedName = name.replace(/[<>]/g, '');
    const sanitizedNiche = niche.replace(/[<>]/g, '');
    const sanitizedGoal = goal.replace(/[<>]/g, '');

    const message = 
      `Olá Igor, meu nome é ${sanitizedName}. ` +
      `Meu nicho é ${sanitizedNiche}. ` +
      `Objetivo da minha landing page: ${sanitizedGoal}.`;

    const whatsappUrl = `https://wa.me/5547984054897?text=${encodeURIComponent(message)}`;
    // Pequeno delay para feedback visual
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      button.textContent = originalText;
      button.disabled = false;
      // quoteForm.reset(); // Opcional: limpar formulário
    }, 700);
  });
}

// Adicione lazy loading para imagens fora da viewport
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.loading = 'lazy';
  });
}
