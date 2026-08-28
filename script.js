const productDetails = {
  precifica: {
    kicker: "PRECIFICAÇÃO",
    title: "NexoPlan Precifica",
    index: "01",
    page: "precifica/",
    finderDescription: "A melhor escolha para calcular custos, definir margem e chegar a um preço de venda sustentável.",
    benefit: "Saber quanto cada produto custa e quanto cobrar para trabalhar com margem.",
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
    index: "02",
    page: "gestao-financeira/",
    finderDescription: "A solução indicada para organizar entradas, saídas, contas e acompanhar o resultado real de cada mês.",
    benefit: "Entender para onde o dinheiro vai e quanto realmente sobra no negócio.",
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
    index: "03",
    page: "negocio/",
    finderDescription: "A solução mais completa para centralizar produtos, clientes, fornecedores, pedidos, compras, estoque e metas.",
    benefit: "Enxergar a operação inteira e reduzir informações perdidas em controles separados.",
    url: "https://pay.hotmart.com/X107329706V?off=kjiwmiq4",
    regularUrl: "https://pay.hotmart.com/X107329706V",
    description: "A solução mais completa para reunir produtos, clientes, fornecedores, pedidos, compras, estoque, metas e indicadores.",
    ideal: "Negócios que cresceram além de controles separados e precisam reduzir informações perdidas e decisões sem contexto.",
    result: "O que vende, quem compra, o que precisa ser reposto e se a operação está avançando no ritmo das metas.",
    features: ["Até 150 produtos e 200 clientes", "Fornecedores, pedidos e compras", "Até 500 itens de pedido", "Ajustes e acompanhamento de estoque", "Metas e cenários", "Dashboard, relatórios e verificações", "Material de apoio para uso"]
  },
  conjunto: {
    kicker: "ECOSSISTEMA COMPLETO",
    title: "NexoPlan Conjunto Completo",
    index: "04",
    page: "conjunto/",
    finderDescription: "A melhor escolha para levar as três soluções e organizar preço, dinheiro e operação de forma complementar.",
    benefit: "Começar com o ecossistema completo da NexoPlan e economizar em relação às compras separadas.",
    url: "https://pay.hotmart.com/E107372949H?off=5rpvl9n9",
    regularUrl: "https://pay.hotmart.com/E107372949H?off=tcpgmrpt",
    description: "O conjunto reúne NexoPlan Precifica, Gestão Financeira e Negócio 360 para acompanhar as principais decisões do pequeno negócio.",
    ideal: "Empreendedores que se identificam com mais de um problema ou querem começar com as três ferramentas desde o início.",
    result: "Preço, margem, movimentação financeira, clientes, pedidos, estoque e metas organizados por soluções complementares.",
    features: ["NexoPlan Precifica completo", "NexoPlan Gestão Financeira completo", "NexoPlan Negócio 360 completo", "Os três manuais de uso", "Uma única compra pela Hotmart", "Melhor custo-benefício do ecossistema"]
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
    link.textContent = active
      ? (link.dataset.activeLabel || "Comprar com a oferta ↗")
      : (link.dataset.expiredLabel || "Comprar na Hotmart ↗");
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
  revealElements.forEach((element) => element.classList.add("reveal-pending"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.classList.remove("reveal-pending");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px" });

  window.requestAnimationFrame(() => {
    revealElements.forEach((element) => revealObserver.observe(element));
  });

  window.setTimeout(() => {
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.classList.remove("reveal-pending");
    });
  }, 1800);
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const finderButtons = document.querySelectorAll("[data-recommend]");
const finderResult = document.getElementById("finder-result");

function showRecommendation(key) {
  const product = productDetails[key];
  if (!product || !finderResult) return;

  finderButtons.forEach((button) => {
    const selected = button.dataset.recommend === key;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  finderResult.querySelector("[data-result-index]").textContent = product.index;
  finderResult.querySelector("[data-result-kicker]").textContent = product.kicker;
  finderResult.querySelector("[data-result-title]").textContent = product.title;
  finderResult.querySelector("[data-result-description]").textContent = product.finderDescription;
  finderResult.querySelector("[data-result-benefit]").textContent = product.benefit;

  const pageLink = finderResult.querySelector("[data-result-page]");
  const buyLink = finderResult.querySelector("[data-result-buy]");
  pageLink.href = product.page;
  pageLink.setAttribute("aria-label", `Conhecer ${product.title}`);
  buyLink.dataset.promotionalLink = "";
  buyLink.dataset.productKey = key;
  buyLink.dataset.activeLabel = "Ver oferta de lançamento ↗";
  buyLink.dataset.expiredLabel = "Comprar na Hotmart ↗";
  buyLink.href = campaignIsActive() ? product.url : product.regularUrl;
  buyLink.textContent = campaignIsActive() ? "Ver oferta de lançamento ↗" : "Comprar na Hotmart ↗";

  finderResult.classList.remove("is-empty");
  finderResult.dataset.recommendation = key;

  if (window.innerWidth <= 720) {
    window.setTimeout(() => finderResult.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
}

finderButtons.forEach((button) => {
  button.addEventListener("click", () => showRecommendation(button.dataset.recommend));
});

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
