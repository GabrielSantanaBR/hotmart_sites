const productDetails = {
  precifica: {
    kicker: "PRECIFICAÇÃO",
    title: "NexoPlan Precifica",
    url: "https://pay.hotmart.com/B107154291R?off=lxihr5tx",
    regularUrl: "https://pay.hotmart.com/B107154291R",
    description: "Uma solução prática para transformar custos reais em preço de venda, com visão de margem, ponto de equilíbrio e metas.",
    ideal: "Confeiteiros, doceiros, salgadeiros, produtores de alimentos, MEIs e pequenos negócios que ainda precificam no improviso.",
    result: "O custo real de cada produto, a margem obtida, o preço sugerido e quanto precisa ser vendido para cobrir os custos.",
    features: ["Configurações e cadastro de ingredientes", "Receitas, rendimentos e composição de produtos", "Atualização de custos e formação de preço", "Custos fixos e ponto de equilíbrio", "Dashboard, metas e rentabilidade", "Material de apoio para uso"]
  },
  financeiro: {
    kicker: "CONTROLE FINANCEIRO",
    title: "NexoPlan Gestão Financeira",
    url: "https://pay.hotmart.com/U107329608Y?off=amuz3gem",
    regularUrl: "https://pay.hotmart.com/U107329608Y",
    description: "Organize a rotina financeira, acompanhe compromissos e entenda o resultado do mês sem se perder em lançamentos espalhados.",
    ideal: "Pequenos negócios que já vendem, mas misturam informações, esquecem vencimentos ou não sabem quanto realmente sobra.",
    result: "Receitas, despesas, contas, orçamento e resultado mensal reunidos em uma visão objetiva.",
    features: ["Configurações e categorias", "Cadastro de clientes", "Contas a receber e contas a pagar", "Movimentações financeiras", "Orçamento e conferência", "Dashboard de resultados", "Material de apoio para uso"]
  },
  negocio: {
    kicker: "GESTÃO INTEGRADA",
    title: "NexoPlan Negócio 360",
    url: "https://pay.hotmart.com/X107329706V?off=kjiwmiq4",
    regularUrl: "https://pay.hotmart.com/X107329706V",
    description: "A solução mais completa para reunir produtos, clientes, fornecedores, pedidos, compras, estoque, metas e indicadores.",
    ideal: "Negócios que cresceram além de controles separados e precisam reduzir informações perdidas e decisões sem contexto.",
    result: "O que vende, quem compra, o que precisa ser reposto e se a operação está avançando no ritmo das metas.",
    features: ["Até 150 produtos e 200 clientes", "Fornecedores, pedidos e compras", "Até 500 itens de pedido", "Ajustes e acompanhamento de estoque", "Metas e cenários", "Dashboard, relatórios e verificações", "Material de apoio para uso"]
  }
};

const campaignDeadline = new Date("2026-09-26T23:59:00-03:00");

function campaignIsActive() {
  return Date.now() < campaignDeadline.getTime();
}

function syncCampaignLinks(active) {
  document.querySelectorAll("[data-promotional-link]").forEach((link) => {
    const product = productDetails[link.dataset.productKey];
    if (!product) return;
    link.href = active ? product.url : product.regularUrl;
    link.textContent = active ? "Comprar com a oferta ↗" : "Comprar na Hotmart ↗";
  });

  document.querySelectorAll("[data-offer-label]").forEach((label) => {
    label.textContent = active ? "OFERTA DE LANÇAMENTO" : "OFERTA ENCERRADA";
    label.classList.toggle("expired", !active);
  });
}

function updateCountdown() {
  const countdowns = document.querySelectorAll("[data-countdown]");
  if (!countdowns.length) return;

  const remaining = Math.max(0, campaignDeadline.getTime() - Date.now());
  const active = remaining > 0;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const pad = (value) => String(value).padStart(2, "0");

  countdowns.forEach((countdown) => {
    countdown.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
    countdown.querySelector("[data-hours]").textContent = pad(hours);
    countdown.querySelector("[data-minutes]").textContent = pad(minutes);
    countdown.querySelector("[data-seconds]").textContent = pad(seconds);
    countdown.setAttribute("aria-label", active ? `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos restantes` : "Oferta de lançamento encerrada");
  });

  document.querySelectorAll("[data-campaign]").forEach((campaign) => {
    campaign.classList.toggle("expired", !active);
    const copy = campaign.querySelector(".campaign-copy p");
    if (copy && !active) copy.textContent = "A campanha de lançamento foi encerrada. Os produtos continuam disponíveis pelo preço normal.";
  });

  syncCampaignLinks(active);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

function setMenu(open) {
  header?.classList.toggle("menu-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

menuButton?.addEventListener("click", () => setMenu(!header.classList.contains("menu-open")));
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", (event) => {
  if (header?.classList.contains("menu-open") && !header.contains(event.target)) setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setMenu(false);
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

document.querySelectorAll("[data-focus-product]").forEach((link) => {
  link.addEventListener("click", () => {
    const key = link.dataset.focusProduct;
    window.setTimeout(() => {
      const card = document.querySelector(`[data-product="${key}"]`);
      if (!card) return;
      card.classList.remove("focused");
      void card.offsetWidth;
      card.classList.add("focused");
    }, 350);
  });
});

const modalBackdrop = document.getElementById("product-modal");
const modal = modalBackdrop?.querySelector(".product-modal");
const modalClose = modalBackdrop?.querySelector(".modal-close");
const modalBuy = modalBackdrop?.querySelector(".modal-buy");
let triggerBeforeModal = null;

function openModal(key, trigger) {
  const product = productDetails[key];
  if (!product || !modalBackdrop || !modal) return;
  triggerBeforeModal = trigger;
  document.getElementById("modal-kicker").textContent = product.kicker;
  document.getElementById("modal-title").textContent = product.title;
  document.getElementById("modal-description").textContent = product.description;
  document.getElementById("modal-ideal").textContent = product.ideal;
  document.getElementById("modal-result").textContent = product.result;
  const featureList = document.getElementById("modal-features");
  featureList.replaceChildren(...product.features.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));
  modalBuy.href = campaignIsActive() ? product.url : product.regularUrl;
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.focus();
}

function closeModal() {
  if (!modalBackdrop?.classList.contains("open")) return;
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  triggerBeforeModal?.focus();
  triggerBeforeModal = null;
}

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.detail, button));
});
modalClose?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeModal();
  }
  if (event.key === "Tab" && modalBackdrop?.classList.contains("open")) {
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const year = document.getElementById("current-year");
if (year) year.textContent = new Date().getFullYear();
