// Shared JavaScript for Simon's Microgreen Shop

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const page = body.dataset.page;

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

  // Future impact.com conversion tracking will use values from orderData here
  //
  // Example (pseudo-code only, not active):
  // impactTracking.trackConversion({
  //   orderId: orderData.orderId,
  //   amount: orderData.subtotal,
  //   currency: orderData.currency,
  //   sku: orderData.sku,
  // });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

