(() => {
  "use strict";

  const config = {
    ga4Id: "",
    clarityId: "",
    consentRequired: true,
    debug: false,
    campaignId: "lancamento_nexoplan_2026_09",
    campaignName: "Lançamento NexoPlan — Setembro 2026",
    ...(window.NEXOPLAN_ANALYTICS || {})
  };

  const products = {
    precifica: { id: "nexoplan_precifica", name: "NexoPlan Precifica", category: "Planilha digital" },
    financeiro: { id: "nexoplan_gestao_financeira", name: "NexoPlan Gestão Financeira", category: "Planilha digital" },
    negocio: { id: "nexoplan_negocio_360", name: "NexoPlan Negócio 360", category: "Planilha digital" },
    conjunto: { id: "nexoplan_conjunto_completo", name: "NexoPlan Conjunto Completo", category: "Pacote digital" }
  };

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const consentKey = "nexoplan_analytics_consent";
  const attributionKey = "nexoplan_attribution";
  const trackedViews = new Set();
  let listenersReady = false;
  let scrollTracked = false;
  let providersLoaded = false;

  const validGa4 = /^G-[A-Z0-9]+$/i.test(config.ga4Id);
  const validClarity = /^[a-z0-9]+$/i.test(config.clarityId);
  const providerConfigured = validGa4 || validClarity;

  function safeStorage(storage, action, key, value) {
    try {
      if (action === "get") return storage.getItem(key);
      if (action === "set") storage.setItem(key, value);
    } catch (_) {
      return null;
    }
    return null;
  }

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    const incoming = {};
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) incoming[key] = value.slice(0, 160);
    });

    if (Object.keys(incoming).length) {
      incoming.landing_page = window.location.pathname;
      incoming.captured_at = new Date().toISOString();
      safeStorage(window.sessionStorage, "set", attributionKey, JSON.stringify(incoming));
      return incoming;
    }

    const stored = safeStorage(window.sessionStorage, "get", attributionKey);
    if (!stored) return {};
    try { return JSON.parse(stored); } catch (_) { return {}; }
  }

  const attribution = captureAttribution();

  function getConsent() {
    if (!config.consentRequired) return "granted";
    return safeStorage(window.localStorage, "get", consentKey);
  }

  function analyticsAllowed() {
    return providerConfigured && getConsent() === "granted";
  }

  function itemFor(key) {
    const product = products[key];
    if (!product) return null;
    return { item_id: product.id, item_name: product.name, item_category: product.category };
  }

  function locationName(element) {
    const section = element?.closest("section, header, footer, aside");
    if (!section) return "page";
    return section.id || [...section.classList].find((name) => !["reveal", "visible"].includes(name)) || section.tagName.toLowerCase();
  }

  function track(eventName, parameters = {}) {
    if (!analyticsAllowed()) return false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("event", eventName, {
      transport_type: "beacon",
      page_type: document.body.dataset.pageType || "page",
      ...parameters
    });
    if (config.debug) console.info("[NexoPlan Analytics]", eventName, parameters);
    return true;
  }

  function loadGoogleAnalytics() {
    if (!validGa4 || document.querySelector('script[data-nexoplan-ga4]')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied" });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", config.ga4Id, {
      anonymize_ip: true,
      send_page_view: true,
      campaign_source: attribution.utm_source,
      campaign_medium: attribution.utm_medium,
      campaign_name: attribution.utm_campaign
    });
    const script = document.createElement("script");
    script.async = true;
    script.dataset.nexoplanGa4 = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4Id)}`;
    document.head.appendChild(script);
  }

  function loadClarity() {
    if (!validClarity || window.clarity) return;
    ((c, l, a, r, i, t, y) => {
      c[a] = c[a] || function clarity(){ (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = true;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", config.clarityId);
  }

  function loadProviders() {
    if (providersLoaded || !analyticsAllowed()) return;
    providersLoaded = true;
    loadGoogleAnalytics();
    loadClarity();
  }

  function decorateCheckoutLink(link) {
    if (!link?.href || !link.href.includes("pay.hotmart.com")) return;
    const url = new URL(link.href);
    Object.entries(attribution).forEach(([key, value]) => {
      if (utmKeys.includes(key) && value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    link.href = url.toString();
  }

  function inferProductKey(element) {
    const explicit = element?.dataset.productKey || element?.dataset.recommend;
    if (explicit && products[explicit]) return explicit;
    const card = element?.closest("[data-product]");
    if (card?.dataset.product && products[card.dataset.product]) return card.dataset.product;
    const href = element?.closest("a")?.getAttribute("href") || "";
    if (href.includes("gestao-financeira")) return "financeiro";
    if (href.includes("precifica")) return "precifica";
    if (href.includes("negocio")) return "negocio";
    if (href.includes("conjunto")) return "conjunto";
    return document.body.dataset.productKey || "";
  }

  function trackInitialViews() {
    const productKey = document.body.dataset.productKey;
    if (productKey && !trackedViews.has(`item:${productKey}`)) {
      const item = itemFor(productKey);
      if (item && track("view_item", { items: [item] })) trackedViews.add(`item:${productKey}`);
    }

    document.querySelectorAll("[data-campaign]").forEach((promotion, index) => {
      const viewKey = `promotion:${index}`;
      if (trackedViews.has(viewKey)) return;
      const promotionItems = productKey
        ? [itemFor(productKey)].filter(Boolean)
        : Object.keys(products).map(itemFor).filter(Boolean);
      if (track("view_promotion", {
        promotion_id: config.campaignId,
        promotion_name: config.campaignName,
        creative_slot: locationName(promotion),
        items: promotionItems
      })) trackedViews.add(viewKey);
    });

    checkScrollDepth();
  }

  function checkScrollDepth() {
    if (scrollTracked) return;
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const viewportBottom = window.scrollY + window.innerHeight;
    if (documentHeight > 0 && viewportBottom / documentHeight >= 0.75) {
      if (track("scroll_75", { percent_scrolled: 75 })) scrollTracked = true;
    }
  }

  function setupListeners() {
    if (listenersReady) return;
    listenersReady = true;

    document.addEventListener("click", (event) => {
      const target = event.target.closest("a, button");
      if (!target) return;

      const productKey = inferProductKey(target);
      const item = itemFor(productKey);
      const checkout = target.closest("[data-promotional-link]");
      const recommendation = target.closest("[data-recommend]");
      const productSelection = recommendation || target.closest("[data-product] a, .journey-step, .bundle-path, .comparison-cards a");

      if (productSelection && item) {
        track("select_item", {
          item_list_id: recommendation ? "product_finder" : "storefront",
          item_list_name: recommendation ? "Seletor de solução" : "Vitrine de produtos",
          items: [item]
        });
      }

      if (checkout && item) {
        decorateCheckoutLink(checkout);
        track("select_promotion", {
          promotion_id: config.campaignId,
          promotion_name: config.campaignName,
          creative_slot: locationName(checkout),
          items: [item]
        });
        track("begin_checkout", {
          checkout_provider: "Hotmart",
          offer_type: checkout.href.includes("5rpvl9n9") || checkout.href.includes("lxihr5tx") || checkout.href.includes("amuz3gem") || checkout.href.includes("kjiwmiq4") ? "promotional" : "regular",
          items: [item]
        });
      }

      if (target.matches(".button, .header-cta, .mobile-finder-cta, .finder-option, .journey-step, .bundle-path, .comparison-cards a, .detail-button")) {
        track("cta_click", {
          cta_text: (target.textContent || target.getAttribute("aria-label") || "CTA").trim().replace(/\s+/g, " ").slice(0, 100),
          cta_location: locationName(target),
          product_id: item?.item_id || undefined
        });
      }
    }, true);

    window.addEventListener("scroll", checkScrollDepth, { passive: true });
  }

  function createConsentBanner() {
    if (!providerConfigured || getConsent()) return;
    const banner = document.createElement("aside");
    banner.className = "analytics-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Preferências de análise do site");
    banner.innerHTML = '<p><strong>Podemos medir sua navegação?</strong><br>Usamos dados de interação para melhorar o site e entender quais soluções ajudam mais. Nenhum dado financeiro é coletado.</p><div class="analytics-consent-actions"><button type="button" data-consent="reject">Agora não</button><button type="button" data-consent="accept">Permitir análise</button></div>';
    document.body.appendChild(banner);

    banner.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-consent]")?.dataset.consent;
      if (!choice) return;
      safeStorage(window.localStorage, "set", consentKey, choice === "accept" ? "granted" : "denied");
      banner.hidden = true;
      if (choice === "accept") {
        loadProviders();
        trackInitialViews();
      }
    });
  }

  function init() {
    setupListeners();
    createConsentBanner();
    if (analyticsAllowed()) {
      loadProviders();
      trackInitialViews();
    }
  }

  window.nexoAnalytics = Object.freeze({
    track,
    attribution: () => ({ ...attribution }),
    consent: () => getConsent()
  });

  window.nexoTrackPurchase = (data = {}) => {
    const item = itemFor(data.productKey);
    if (!item || !data.transactionId) return false;
    return track("purchase", {
      transaction_id: String(data.transactionId),
      value: Number(data.value || 0),
      currency: data.currency || "BRL",
      items: [{ ...item, quantity: 1 }]
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
