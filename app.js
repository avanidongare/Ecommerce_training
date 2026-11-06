const products = [
  {
    id: 1,
    name: "Laptop",
    price: 146000,
    category: "Computers",
    label: "THE WORKHORSE",
    note: "A capable everyday machine, built to keep up.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    imageClass: "product-image-laptop",
  },
  {
    id: 2,
    name: "Mouse",
    price: 1000,
    category: "Peripherals",
    label: "DESK ESSENTIAL",
    note: "A comfortable, precise companion for the long haul.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Keyboards",
    price: 2000,
    category: "Peripherals",
    label: "A BETTER TYPE",
    note: "Tactile keys for a more satisfying workday.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
  },
];

const CART_STORAGE_KEY = "orbit-supply-cart";
const FREE_SHIPPING_MINIMUM = 5000;
const SHIPPING_FEE = 100;
const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cart = loadCart();
let activeCategory = "All";
let toastTimeout;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
    return new Map(Object.entries(saved).map(([id, quantity]) => [Number(id), Math.max(0, Number(quantity) || 0)]).filter(([, quantity]) => quantity > 0));
  } catch {
    return new Map();
  }
}

function formatPrice(amount) {
  return `Rs. ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Object.fromEntries(cart)));
}

function renderProducts() {
  const search = document.querySelector("#product-search").value.trim().toLowerCase();
  const sortBy = document.querySelector("#product-sort").value;
  const visibleProducts = products
    .filter((product) => activeCategory === "All" || product.category === activeCategory)
    .filter((product) => `${product.name} ${product.category} ${product.note}`.toLowerCase().includes(search));

  if (sortBy === "price-low") visibleProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") visibleProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "name") visibleProducts.sort((a, b) => a.name.localeCompare(b.name));

  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 65}ms">
      <div class="product-visual">
        <img class="${product.imageClass || ""}" src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-tag">${product.label}</span>
        <span class="product-number">0${product.id} / 03</span>
      </div>
      <div class="product-details">
        <p class="product-category">${product.category.toUpperCase()}</p>
        <div class="product-name-row"><h3 class="product-name">${product.name}</h3><p class="product-price">${formatPrice(product.price)}</p></div>
        <p class="product-note">${product.note}</p>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">
          <span>${cart.has(product.id) ? "Add another" : "Add to bag"}</span><span aria-hidden="true">+</span>
        </button>
      </div>
    </article>`).join("");

  document.querySelector("#catalog-count").textContent = `${String(visibleProducts.length).padStart(2, "0")} ITEMS`;
  document.querySelector("#no-results").hidden = visibleProducts.length > 0;
}

function renderCart() {
  const quantity = [...cart.values()].reduce((sum, itemQuantity) => sum + itemQuantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart.get(product.id) || 0), 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_SHIPPING_MINIMUM ? 0 : SHIPPING_FEE;

  document.querySelector("#header-count").textContent = quantity;
  document.querySelector("#panel-count").textContent = `(${quantity})`;
  document.querySelector("#mobile-cart-count").textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
  document.querySelector("#mobile-cart-total").textContent = formatPrice(subtotal + deliveryFee);
  document.querySelector("#empty-cart").hidden = quantity > 0;
  document.querySelector("#cart-summary").hidden = quantity === 0;

  cartItems.innerHTML = products.filter((product) => cart.has(product.id)).map((product) => `
    <div class="cart-item">
      <div class="cart-thumb"><img src="${product.image}" alt="" /></div>
      <div>
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-price">${formatPrice(product.price)}</p>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${cart.get(product.id)}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <button class="remove-button" type="button" data-remove="${product.id}" aria-label="Remove ${product.name}">×</button>
    </div>`).join("");

  if (quantity > 0) {
    const shippingNote = document.querySelector("#shipping-note");
    shippingNote.textContent = deliveryFee === 0
      ? "You unlocked complimentary delivery. Nice."
      : `Add ${formatPrice(FREE_SHIPPING_MINIMUM - subtotal)} for complimentary delivery.`;
    document.querySelector("#subtotal").textContent = formatPrice(subtotal);
    document.querySelector("#delivery").textContent = deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee);
    document.querySelector("#total").textContent = formatPrice(subtotal + deliveryFee);
  }
}

function updateCart() {
  saveCart();
  renderProducts();
  renderCart();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-category]");
  if (!tab) return;
  activeCategory = tab.dataset.category;
  document.querySelectorAll(".category-tab").forEach((item) => item.classList.toggle("is-active", item === tab));
  renderProducts();
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    activeCategory = link.dataset.categoryLink;
    document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.category === activeCategory));
    renderProducts();
  });
});

document.querySelector("#product-search").addEventListener("input", renderProducts);
document.querySelector("#product-sort").addEventListener("change", renderProducts);

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const productId = Number(button.dataset.add);
  cart.set(productId, (cart.get(productId) || 0) + 1);
  updateCart();
  showToast(`${products.find((product) => product.id === productId).name} added to your bag`);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const productId = Number(quantityButton.dataset.quantity);
    const quantity = (cart.get(productId) || 0) + Number(quantityButton.dataset.change);
    if (quantity > 0) cart.set(productId, quantity);
    else cart.delete(productId);
    updateCart();
  }
  if (removeButton) {
    cart.delete(Number(removeButton.dataset.remove));
    updateCart();
  }
});

function toggleMobileCart(forceOpen) {
  const panel = document.querySelector("#cart-panel");
  const shouldOpen = forceOpen ?? !panel.classList.contains("is-open");
  panel.classList.toggle("is-open", shouldOpen);
  document.querySelector("#mobile-cart-button").innerHTML = shouldOpen ? 'Close bag <span aria-hidden="true">↓</span>' : 'View bag <span aria-hidden="true">↑</span>';
}

document.querySelector("#header-cart").addEventListener("click", () => {
  if (window.matchMedia("(max-width: 650px)").matches) toggleMobileCart(true);
  else document.querySelector("#cart-panel").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelector("#mobile-cart-button").addEventListener("click", () => toggleMobileCart());

document.querySelector("#checkout-button").addEventListener("click", () => {
  const quantity = [...cart.values()].reduce((sum, itemQuantity) => sum + itemQuantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart.get(product.id) || 0), 0);
  const total = subtotal + (subtotal >= FREE_SHIPPING_MINIMUM ? 0 : SHIPPING_FEE);
  document.querySelector("#confirmation-copy").textContent = `Your total is ${formatPrice(total)}. This storefront is frontend-only: your order is not saved and no payment is collected.`;
  document.querySelector("#checkout-modal").hidden = false;
  document.querySelector("#modal-close").focus();
});

function closeCheckout() {
  document.querySelector("#checkout-modal").hidden = true;
  toggleMobileCart(false);
}

document.querySelector("#modal-close").addEventListener("click", closeCheckout);
document.querySelector("#continue-shopping").addEventListener("click", closeCheckout);
document.querySelector("#checkout-modal").addEventListener("click", (event) => {
  if (event.target.id === "checkout-modal") closeCheckout();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#checkout-modal").hidden) closeCheckout();
});

renderProducts();
renderCart();