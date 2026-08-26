const PRODUCT_URLS = {
  precifica: "",
  financeiro: "",
  negocio: ""
};

const productDetails = {
  precifica: {
    kicker: "PRECIFICAÇÃO",
    title: "NexoPlan Precifica",
    description: "Uma solução prática para transformar custos reais em um preço de venda coerente, com visão de margem, ponto de equilíbrio e metas.",
    ideal: "MEIs, confeiteiros, produtores, vendedores e pequenos negócios que ainda calculam preço no improviso.",
    result: "Mais clareza sobre custo, margem e quanto precisa ser vendido para o negócio se sustentar.",
    features: [
      "Cadastro e atualização de custos",
      "Cálculo de preço e margem",
      "Custos fixos e ponto de equilíbrio",
      "Metas e análise de rentabilidade",
      "Material de apoio para uso"
    ]
  },
  financeiro: {
    kicker: "CONTROLE FINANCEIRO",
    title: "NexoPlan Gestão Financeira",
    description: "Controle o dinheiro que entra e sai, acompanhe compromissos e entenda o resultado do mês sem se perder em lançamentos espalhados.",
    ideal: "Pequenos negócios que já vendem, mas ainda misturam informações, esquecem despesas ou não sabem quanto realmente sobra.",
    result: "Uma rotina financeira mais organizada e uma visão objetiva de receitas, despesas e resultado.",
    features: [
      "Controle de receitas e despesas",
      "Acompanhamento mensal",
      "Dashboard de indicadores",
      "Metas e compromissos",
      "Estrutura simples para uso recorrente"
    ]
  },
  negocio: {
    kicker: "GESTÃO 360°",
    title: "NexoPlan Negócio 360",
    description: "A solução mais completa do ecossistema para reunir operação, vendas, estoque, clientes, fornecedores e indicadores em um só lugar.",
    ideal: "Negócios que já precisam de mais controle operacional e querem reduzir controles separados e decisões sem contexto.",
    result: "Uma visão integrada do negócio, com menos informação perdida e mais base para planejar os próximos passos.",
    features: [
      "Pedidos e acompanhamento de vendas",
      "Clientes e fornecedores",
      "Produtos e estoque",
      "Metas operacionais",
      "Indicadores consolidados",
      "Visão mais ampla do negócio"
    ]
  }
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");

menuButton?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

function syncPurchaseButtons() {
  document.querySelectorAll("[data-buy]").forEach((button) => {
    const key = button.dataset.buy;
    const url = PRODUCT_URLS[key];

    if (url) {
      button.disabled = false;
      button.textContent = "Comprar agora";
      button.addEventListener("click", () => window.location.href = url);
    } else {
      button.disabled = true;
      button.textContent = "Em breve";
    }
  });
}

syncPurchaseButtons();

document.querySelectorAll("[data-focus-product]").forEach((link) => {
  link.addEventListener("click", () => {
    const product = link.dataset.focusProduct;
    setTimeout(() => {
      const card = document.querySelector(`[data-product="${product}"]`);
      if (!card) return;
      card.classList.add("focused");
      setTimeout(() => card.classList.remove("focused"), 1600);
    }, 420);
  });
});

const modalBackdrop = document.getElementById("product-modal");
const modalClose = document.querySelector(".modal-close");
const modalBuy = document.querySelector(".modal-buy");
let activeProduct = null;

function openModal(productKey) {
  const product = productDetails[productKey];
  if (!product || !modalBackdrop) return;

  activeProduct = productKey;
  document.getElementById("modal-kicker").textContent = product.kicker;
  document.getElementById("modal-title").textContent = product.title;
  document.getElementById("modal-description").textContent = product.description;
  document.getElementById("modal-ideal").textContent = product.ideal;
  document.getElementById("modal-result").textContent = product.result;

  const featureList = document.getElementById("modal-features");
  featureList.innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join("");

  const url = PRODUCT_URLS[productKey];
  modalBuy.disabled = !url;
  modalBuy.textContent = url ? "Comprar agora" : "Em breve";

  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose?.focus();
}

function closeModal() {
  modalBackdrop?.classList.remove("open");
  modalBackdrop?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeProduct = null;
}

document.querySelectorAll(".detail-button").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.detail));
});

modalClose?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalBackdrop?.classList.contains("open")) closeModal();
});

modalBuy?.addEventListener("click", () => {
  const url = PRODUCT_URLS[activeProduct];
  if (url) window.location.href = url;
});

document.getElementById("current-year").textContent = new Date().getFullYear();
