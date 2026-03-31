// Shared JavaScript for Simon's Microgreen Shop

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const page = body.dataset.page;

  ensureDataLayer();
  captureImpactClickId();
  pushImpactIdentify();
  setFooterYear();

  if (page === "product") {
    initProductPage();
  } else if (page === "thankyou") {
    initThankYouPage();
  }
});

function setFooterYear() {
  const yearEls = document.querySelectorAll("#footer-year");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = year;
  });
}

function initProductPage() {
  const form = document.getElementById("buy-now-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const quantityInput = document.getElementById("quantity");
    const safeQuantity = Math.max(1, parseInt(quantityInput.value || "1", 10));

    const productName = "Arugula Seed Pouch";
    const sku = "ARUGULA-001";
    const category = "Seeds";
    const price = 2.0;
    const currency = "USD";

    const params = new URLSearchParams({
      productName,
      sku,
      category,
      price: price.toFixed(2),
      currency,
      quantity: String(safeQuantity),
      orderId: "ORD-1001",
    });

    window.location.href = "thankyou.html?" + params.toString();
  });
}

function initThankYouPage() {
  const searchParams = new URLSearchParams(window.location.search);

  const productName = searchParams.get("productName") || "Arugula Seed Pouch";
  const sku = searchParams.get("sku") || "ARUGULA-001";
  const category = searchParams.get("category") || "Seeds";
  const price = parseFloat(searchParams.get("price") || "2.00");
  const quantity = parseInt(searchParams.get("quantity") || "1", 10) || 1;
  const currency = searchParams.get("currency") || "USD";
  const orderId = searchParams.get("orderId") || "ORD-1001";
  const subtotal = price * quantity;

  // Visible DOM elements for order details
  setText("order-id", orderId);
  setText("order-product-name", productName);
  setText("order-sku", sku);
  setText("order-category", category);
  setText("order-price", price.toFixed(2));
  setText("order-currency", currency);
  setText("order-quantity", String(quantity));
  setText("order-subtotal", subtotal.toFixed(2));

  // JavaScript object containing the same order details
  window.orderData = {
    orderId: orderId,
    productName: productName,
    sku: sku,
    category: category,
    price: price,
    quantity: quantity,
    currency: currency,
    subtotal: subtotal,
  };

  pushImpactConversion(window.orderData);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

function captureImpactClickId() {
  const params = new URLSearchParams(window.location.search);
  const clickId = params.get("im_ref");

  if (clickId) {
    try {
      localStorage.setItem("impact_click_id", clickId);
    } catch (e) {
      // localStorage may be blocked; fail silently.
    }
  }
}

function getImpactClickId() {
  try {
    return localStorage.getItem("impact_click_id") || "";
  } catch (e) {
    return "";
  }
}

function getOrCreateCustomProfileId() {
  try {
    const existingId = localStorage.getItem("impact_custom_profile_id");
    if (existingId) return existingId;

    const newId = crypto && crypto.randomUUID ? crypto.randomUUID() : "cpid-" + Date.now();
    localStorage.setItem("impact_custom_profile_id", newId);
    return newId;
  } catch (e) {
    return "cpid-" + Date.now();
  }
}

function pushImpactIdentify() {
  window.dataLayer.push({
    event: "impact_identify",
    impact: {
      customerId: "123456",
      customerEmailSha1: "3reihr4btjeow4uihfkewng",
      customProfileId: getOrCreateCustomProfileId(),
      clickId: getImpactClickId(),
    },
  });
}

function pushImpactConversion(orderData) {
  window.dataLayer.push({
    event: "impact_conversion",
    impact: {
      eventId: 70289,
      orderId: orderData.orderId,
      customProfileId: getOrCreateCustomProfileId(),
      customerId: "123456",
      customerEmailSha1: "3reihr4btjeow4uihfkewng",
      customerStatus: "New",
      currencyCode: orderData.currency,
      orderPromoCode: "SIMON DISCOUNT",
      orderDiscount: 0,
      clickId: getImpactClickId(),
      items: [
        {
          subTotal: Number(orderData.subtotal.toFixed(2)),
          category: orderData.category,
          sku: orderData.sku,
          quantity: orderData.quantity,
          name: orderData.productName,
        },
      ],
    },
  });
}

