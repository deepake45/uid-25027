/* ===== THE SOULED STORE - MAIN SCRIPT ===== */

/* -------- DATA -------- */
const PRODUCTS = [
  { id:1, name:"Dragon Force Oversized Tee", theme:"Anime", price:699, original:999, off:30, badge:"new", sizes:["S","M","L","XL","XXL"], emoji:"🐉", category:"men" },
  { id:2, name:"Soul Reaper Classic Tee", theme:"Anime", price:549, original:799, off:31, badge:"hot", sizes:["S","M","L","XL"], emoji:"⚔️", category:"men" },
  { id:3, name:"Ninja Way Graphic Tee", theme:"Anime", price:599, original:899, off:33, badge:"new", sizes:["S","M","L","XL","XXL"], emoji:"🍥", category:"men" },
  { id:4, name:"Iron Legacy Hoodie", theme:"Marvel", price:1199, original:1799, off:33, badge:"", sizes:["S","M","L","XL"], emoji:"🦾", category:"men" },
  { id:5, name:"Captain's Shield Tee", theme:"Marvel", price:649, original:899, off:28, badge:"hot", sizes:["S","M","L","XL","XXL"], emoji:"🛡️", category:"men" },
  { id:6, name:"Gamma Surge Oversized", theme:"Marvel", price:699, original:999, off:30, badge:"new", sizes:["M","L","XL","XXL"], emoji:"💚", category:"men" },
  { id:7, name:"Sakura Bloom Crop Tee", theme:"Anime", price:549, original:799, off:31, badge:"new", sizes:["XS","S","M","L"], emoji:"🌸", category:"women" },
  { id:8, name:"Wonder Drop Hoodie", theme:"DC", price:1099, original:1599, off:31, badge:"", sizes:["S","M","L","XL"], emoji:"⚡", category:"women" },
  { id:9, name:"Breaking Law Oversized", theme:"TV & Movies", price:749, original:999, off:25, badge:"hot", sizes:["S","M","L","XL","XXL"], emoji:"🧪", category:"men" },
  { id:10, name:"Heisenberg Classic Tee", theme:"TV & Movies", price:599, original:799, off:25, badge:"", sizes:["S","M","L","XL"], emoji:"🎩", category:"men" },
  { id:11, name:"Mini Heroes Tee", theme:"Marvel", price:449, original:599, off:25, badge:"new", sizes:["2-4Y","4-6Y","6-8Y","8-10Y"], emoji:"🦸", category:"kids" },
  { id:12, name:"Level Up Gaming Tee", theme:"Gaming", price:649, original:899, off:28, badge:"", sizes:["S","M","L","XL","XXL"], emoji:"🎮", category:"men" },
];

const BESTSELLERS = [
  { id:13, name:"Pirate King Oversized Tee", theme:"Anime", price:799, original:1099, off:27, badge:"hot", sizes:["S","M","L","XL","XXL"], emoji:"☠️", category:"men" },
  { id:14, name:"Survey Corps Graphic Tee", theme:"Anime", price:649, original:899, off:28, badge:"", sizes:["S","M","L","XL"], emoji:"🦅", category:"men" },
  { id:15, name:"Fullmetal Drop Hoodie", theme:"Anime", price:1299, original:1799, off:28, badge:"hot", sizes:["S","M","L","XL","XXL"], emoji:"⚙️", category:"men" },
  { id:16, name:"Black Panther Tee", theme:"Marvel", price:699, original:999, off:30, badge:"new", sizes:["S","M","L","XL"], emoji:"🐾", category:"men" },
  { id:17, name:"F.R.I.E.N.D.S Central Perk", theme:"TV & Movies", price:599, original:799, off:25, badge:"", sizes:["XS","S","M","L","XL"], emoji:"☕", category:"women" },
  { id:18, name:"Matrix Code Oversized", theme:"Movies", price:749, original:999, off:25, badge:"new", sizes:["S","M","L","XL","XXL"], emoji:"💊", category:"men" },
  { id:19, name:"Demon Slayer Drop Tee", theme:"Anime", price:699, original:999, off:30, badge:"hot", sizes:["S","M","L","XL"], emoji:"🗡️", category:"men" },
  { id:20, name:"Originals Inked Logo Tee", theme:"Originals", price:549, original:749, off:27, badge:"new", sizes:["S","M","L","XL","XXL"], emoji:"🖋️", category:"men" },
];

/* -------- STATE -------- */
let cart = [];
let wishlist = [];
let activeTab = "all";
let sliderIndex = 0;
let sliderTimer;

/* -------- UTILITIES -------- */
function formatPrice(n) { return "₹" + n.toLocaleString("en-IN"); }

function showToast(msg, duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* -------- PRODUCT CARD -------- */
function createProductCard(product) {
  const inWishlist = wishlist.includes(product.id);
  const badge = product.badge
    ? `<span class="product-badge ${product.badge}">${product.badge === "new" ? "NEW" : "HOT"}</span>`
    : "";
  const off = product.off
    ? `<span class="price-off">-${product.off}%</span>`
    : "";
  const sizes = product.sizes.map(s => `<span class="size-chip">${s}</span>`).join("");

  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image-wrap">
      <div class="product-image-placeholder" style="background:${randomPastel()};">
        <div class="pimg-icon">${product.emoji}</div>
        <div class="pimg-name">${product.theme}</div>
      </div>
      ${badge}
      <button class="product-wishlist ${inWishlist ? "active" : ""}" data-id="${product.id}">
        <i class="fa${inWishlist ? "-solid" : "-regular"} fa-heart"></i>
      </button>
      <div class="product-actions" data-id="${product.id}">
        + Add to Bag
      </div>
    </div>
    <div class="product-info">
      <p class="product-theme">${product.theme}</p>
      <p class="product-name">${product.name}</p>
      <div class="product-price">
        <span class="price-current">${formatPrice(product.price)}</span>
        <span class="price-original">${formatPrice(product.original)}</span>
        ${off}
      </div>
      <div class="product-sizes">${sizes}</div>
    </div>
  `;

  // Wishlist toggle
  card.querySelector(".product-wishlist").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWishlist(product.id, card.querySelector(".product-wishlist"));
  });

  // Add to cart
  card.querySelector(".product-actions").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  return card;
}

function randomPastel() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 60%, 93%)`;
}

/* -------- RENDER PRODUCTS -------- */
function renderProducts(containerId, products) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";
  products.forEach(p => grid.appendChild(createProductCard(p)));
}

function filterProducts(tab) {
  activeTab = tab;
  const filtered = tab === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === tab);
  renderProducts("productGrid", filtered);
}

/* -------- TABS -------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterProducts(btn.dataset.tab);
  });
});

/* -------- WISHLIST -------- */
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(i => i !== id);
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    btn.classList.add("active");
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    showToast("❤️ Added to wishlist!");
  }
  updateWishlistCount();
}

function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlist.length;
}

/* -------- CART -------- */
function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`🛍️ "${product.name}" added to bag!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
  renderCartItems();
}

function updateCart() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartItemCount").textContent = count;

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = formatPrice(total);

  const hasItems = cart.length > 0;
  document.getElementById("cartEmpty").style.display = hasItems ? "none" : "flex";
  document.getElementById("cartItems").style.display = hasItems ? "flex" : "none";
  document.getElementById("cartFooter").style.display = hasItems ? "block" : "none";
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.theme} · Qty: ${item.qty}</p>
        <p class="cart-item-price">${formatPrice(item.price * item.qty)}</p>
        <span class="cart-item-remove" data-id="${item.id}">Remove</span>
      </div>
    `;
    el.querySelector(".cart-item-remove").addEventListener("click", () => {
      removeFromCart(item.id);
    });
    container.appendChild(el);
  });
}

/* CART DRAWER */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

document.getElementById("cartBtn").addEventListener("click", () => {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  renderCartItems();
  document.body.style.overflow = "hidden";
});
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

/* -------- HERO SLIDER -------- */
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;

function goToSlide(index) {
  slides[sliderIndex].classList.remove("active");
  dots[sliderIndex].classList.remove("active");
  sliderIndex = (index + totalSlides) % totalSlides;
  slides[sliderIndex].classList.add("active");
  dots[sliderIndex].classList.add("active");
}

function nextSlide() { goToSlide(sliderIndex + 1); }
function prevSlide() { goToSlide(sliderIndex - 1); }

document.getElementById("sliderNext").addEventListener("click", () => {
  nextSlide();
  resetSliderTimer();
});
document.getElementById("sliderPrev").addEventListener("click", () => {
  prevSlide();
  resetSliderTimer();
});
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    goToSlide(i);
    resetSliderTimer();
  });
});

function startSliderTimer() {
  sliderTimer = setInterval(nextSlide, 4000);
}
function resetSliderTimer() {
  clearInterval(sliderTimer);
  startSliderTimer();
}
startSliderTimer();

/* -------- SEARCH -------- */
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

searchToggle.addEventListener("click", () => {
  searchBox.classList.add("active");
  searchInput.focus();
});
searchClose.addEventListener("click", () => {
  searchBox.classList.remove("active");
  searchInput.value = "";
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchBox.classList.remove("active");
    searchInput.value = "";
  }
});

/* -------- MOBILE NAV -------- */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
const mobileNavClose = document.getElementById("mobileNavClose");

hamburgerBtn.addEventListener("click", () => {
  mobileNav.classList.add("active");
  mobileNavOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});
function closeMobileNav() {
  mobileNav.classList.remove("active");
  mobileNavOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
mobileNavClose.addEventListener("click", closeMobileNav);
mobileNavOverlay.addEventListener("click", closeMobileNav);

/* -------- HEADER SCROLL -------- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}, { passive: true });

/* -------- NEWSLETTER -------- */
document.getElementById("newsletterBtn").addEventListener("click", () => {
  const email = document.getElementById("newsletterEmail").value.trim();
  if (!email || !email.includes("@")) {
    showToast("⚠️ Please enter a valid email address.");
    return;
  }
  showToast("🎉 You're subscribed! Welcome to the fam.");
  document.getElementById("newsletterEmail").value = "";
});

/* -------- INIT -------- */
filterProducts("all");
renderProducts("bestSellerGrid", BESTSELLERS);
updateCart();
updateWishlistCount();
