let analyticsEnabled = false;
let analyticsLoaded = false;

function trackEvent(eventName, params = {}) {
  if (analyticsEnabled && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

const consentStorageKey = "analytics_consent_v1";

function loadAnalytics() {
  if (analyticsLoaded || !window.GA_MEASUREMENT_ID) {
    return;
  }

  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", window.GA_MEASUREMENT_ID, {
    anonymize_ip: true
  });
}

function getStoredConsent() {
  try {
    return localStorage.getItem(consentStorageKey);
  } catch (error) {
    return null;
  }
}

function persistConsent(value) {
  try {
    localStorage.setItem(consentStorageKey, value);
  } catch (error) {
    // Ignore storage errors and keep browsing usable.
  }
}

function applyAnalyticsConsent(value) {
  analyticsEnabled = value === "accepted";

  if (analyticsEnabled) {
    loadAnalytics();
  }
}

function applyRegionalPricing(countryCode) {
  const isBrazil = countryCode === "BR";

  document.querySelectorAll("[data-price-brl][data-price-usd]").forEach((node) => {
    node.textContent = isBrazil ? node.getAttribute("data-price-brl") : node.getAttribute("data-price-usd");
  });

  document.querySelectorAll("[data-rate-brl][data-rate-usd]").forEach((node) => {
    node.textContent = isBrazil ? node.getAttribute("data-rate-brl") : node.getAttribute("data-rate-usd");
  });
}

async function detectVisitorCountry() {
  try {
    const response = await fetch("/cdn-cgi/trace", { cache: "no-store" });
    if (response.ok) {
      const trace = await response.text();
      const match = trace.match(/^loc=([A-Z]{2})$/m);
      if (match) return match[1];
    }
  } catch (error) {
    // Ignore network errors and fallback to browser heuristics.
  }

  const browserLang = (navigator.language || "").toLowerCase();
  const timezone = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();

  if (browserLang.includes("-br") || timezone.includes("america/sao_paulo")) {
    return "BR";
  }

  return "INTL";
}

detectVisitorCountry().then((countryCode) => {
  applyRegionalPricing(countryCode);
});

const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const cookieBanner = document.querySelector("[data-cookie-banner]");

applyAnalyticsConsent(getStoredConsent());

if (cookieBanner) {
  const storedConsent = getStoredConsent();

  if (!storedConsent) {
    cookieBanner.hidden = false;
  }

  cookieBanner.querySelectorAll("[data-cookie-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-cookie-action");
      const consentValue = action === "accept" ? "accepted" : "declined";

      persistConsent(consentValue);
      applyAnalyticsConsent(consentValue);
      cookieBanner.hidden = true;

      if (consentValue === "accepted") {
        trackEvent("cookie_consent_accept", {
          consent_scope: "analytics"
        });
      }
    });
  });
}

document.querySelectorAll(".language-switch__link[data-lang]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      localStorage.setItem("preferred_lang", link.getAttribute("data-lang"));
    } catch (error) {
      // Ignore storage errors and keep navigation flow.
    }

    trackEvent("language_switch_click", {
      target_language: link.getAttribute("data-lang")
    });
  });
});

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref === "#") {
      return;
    }

    let targetUrl;
    try {
      targetUrl = new URL(rawHref, window.location.href);
    } catch (error) {
      return;
    }

    const isSamePage =
      targetUrl.origin === window.location.origin &&
      targetUrl.pathname === window.location.pathname;

    if (!isSamePage || !targetUrl.hash) {
      return;
    }

    const targetSelector = targetUrl.hash;

    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    event.preventDefault();

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    // Wait one frame to avoid early-scroll race while first layout is settling.
    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior,
        block: "start"
      });

      if (history.replaceState) {
        history.replaceState(null, "", targetSelector);
      }
    });
  });
});

function pickCopy(copy) {
  if (typeof copy === "string") return copy;
  return isEnglish ? copy.en : copy.pt;
}

// Mostrar/esconder botao voltar ao topo
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.hidden = window.scrollY <= 400;
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    trackEvent("back_to_top_click");
  });
}
const projects = [
  {
    title: {
      pt: "Glow Estética",
      en: "Glow Beauty Studio"
    },
    description: {
      pt: "Landing page de um estúdio especializado em alongamento de unhas e cílios, com foco em atrair novas clientes, destacar serviços e facilitar o agendamento online.",
      en: "Landing page for a beauty studio specialized in nail and lash extensions, focused on attracting new clients, showcasing services, and simplifying online booking."
    },
    image: "assets/glow-preview.png",
    url: "https://lashdesing.netlify.app/",
    meta: {
      status: {
        pt: "Case ao vivo",
        en: "Live case"
      },
      type: {
        pt: "Landing page",
        en: "Landing page"
      },
      niche: {
        pt: "Nicho: estetica e beleza",
        en: "Niche: beauty"
      },
      format: {
        pt: "Formato: pagina unica",
        en: "Format: single page"
      },
      focus: {
        pt: "Foco: agendamento via WhatsApp",
        en: "Focus: WhatsApp bookings"
      }
    },
    caseStudy: {
      goal: {
        pt: "Atrair novos agendamentos de serviços de beleza",
        en: "Attract new beauty service bookings"
      },
      solution: {
        pt: "Estrutura com oferta clara, prova social e CTA para WhatsApp",
        en: "Structure with clear offer, social proof, and WhatsApp CTA"
      },
      result: {
        pt: "Página mais objetiva para divulgação local e campanhas",
        en: "A clearer page for local promotion and paid campaigns"
      }
    },
    theme: {
      accent: "#6ff0ff",
      surface: "rgba(14, 22, 54, 0.9)",
      line: "rgba(111, 240, 255, 0.35)"
    }
  }
];

const projectsContainer = document.getElementById("projects");
const cardTemplate = document.getElementById("project-card-template");

document.querySelectorAll("[data-project-count]").forEach((node) => {
  node.textContent = String(projects.length);
});

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
  const status = cardNode.querySelector(".card__status");
  const type = cardNode.querySelector(".card__type");
  const niche = cardNode.querySelector(".card__niche");
  const format = cardNode.querySelector(".card__format");
  const focus = cardNode.querySelector(".card__focus");
  const description = cardNode.querySelector(".card__description");
  const goal = cardNode.querySelector(".card__goal");
  const solution = cardNode.querySelector(".card__solution");
  const result = cardNode.querySelector(".card__result");

  if (project.theme) {
    card.style.setProperty("--project-accent", project.theme.accent);
    card.style.setProperty("--project-surface", project.theme.surface);
    card.style.setProperty("--project-line", project.theme.line);
  }

  link.href = project.url;
  const titleText = pickCopy(project.title);
  const descriptionText = pickCopy(project.description);

  link.setAttribute(
    "aria-label",
    isEnglish ? `Open project ${titleText}` : `Abrir projeto ${titleText}`
  );

  link.addEventListener("click", () => {
    trackEvent("portfolio_project_open", {
      project_name: titleText
    });
  });

  title.textContent = titleText;
  if (project.meta) {
    status.textContent = pickCopy(project.meta.status);
    type.textContent = pickCopy(project.meta.type);
    niche.textContent = pickCopy(project.meta.niche);
    format.textContent = pickCopy(project.meta.format);
    focus.textContent = pickCopy(project.meta.focus);
  }
  description.textContent = descriptionText;

  if (project.caseStudy) {
    goal.textContent = pickCopy(project.caseStudy.goal);
    solution.textContent = pickCopy(project.caseStudy.solution);
    result.textContent = pickCopy(project.caseStudy.result);
  }

  image.src = project.image;
  image.alt = isEnglish ? `Project preview ${titleText}` : `Preview do projeto ${titleText}`;

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

    // Validacao basica
    if (!name || !niche || !goal) {
      alert(isEnglish ? "Please fill in all fields" : "Por favor, preencha todos os campos");
      return;
    }

    if (name.length < 2) {
      alert(
        isEnglish
          ? "Name must contain at least 2 characters"
          : "Nome deve ter pelo menos 2 caracteres"
      );
      return;
    }

    const button = quoteForm.querySelector("button[type='submit']");
    const originalText = button.textContent;
    button.textContent = isEnglish ? "Sending..." : "Enviando...";
    button.disabled = true;

    // Sanitizacao basica
    const sanitizedName = name.replace(/[<>]/g, "");
    const sanitizedNiche = niche.replace(/[<>]/g, "");
    const sanitizedGoal = goal.replace(/[<>]/g, "");

    const message = isEnglish
      ? `Hi Igor, my name is ${sanitizedName}. My niche is ${sanitizedNiche}. My landing page goal is: ${sanitizedGoal}.`
      : `Olá Igor, meu nome é ${sanitizedName}. Meu nicho é ${sanitizedNiche}. Objetivo da minha landing page: ${sanitizedGoal}.`;

    const whatsappUrl = `https://wa.me/5547984054897?text=${encodeURIComponent(message)}`;
    // Pequeno delay para feedback visual
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      trackEvent("quote_form_submit", {
        lead_source: "form",
        niche: sanitizedNiche
      });
      button.textContent = originalText;
      button.disabled = false;
      // quoteForm.reset(); // Opcional: limpar formulário
    }, 700);
  });
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent("cta_click", {
      cta_name: element.getAttribute("data-track")
    });
  });
});

const revealTargets = document.querySelectorAll(
  ".projects-section__spotlight, .projects-section__stat, .plan-card, .testimonial-card, .highlight-card, .about__item, .pain__item, .process__item, .service-scope__item, .why-me__item, .outcomes__item, .card"
);

function applyReveal(selector, stagger = 0, startDelay = 0) {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal-on-scroll");

    if (stagger > 0) {
      element.style.setProperty("--reveal-delay", `${startDelay + index * stagger}ms`);
    }
  });
}

applyReveal(".projects-section__spotlight, .projects-section__stat", 80, 40);
applyReveal(".pain__item, .about__item, .process__item, .service-scope__item, .why-me__item, .outcomes__item", 70, 40);
applyReveal(".highlight-card, .plan-card, .testimonial-card, .card", 90, 60);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = `${Math.min(index * 0.03, 0.24)}s`;
    revealObserver.observe(element);
  });
}

// Adicione lazy loading para imagens fora da viewport
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.loading = 'lazy';
  });
}
