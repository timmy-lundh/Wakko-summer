/* ============================================
   WAKKO SUMMER — APP JAVASCRIPT
   ============================================ */

// ---- Cart state ----
let cart = [];
try { cart = JSON.parse(localStorage.getItem('wakkoCart') || '[]'); } catch (e) { cart = []; }

// ---- Product catalogue ----
const products = [
  {
    id: 'unicorn',
    name: 'Giant Inflatable Unicorn',
    desc: 'Magical oversized pool float that turns any pool into a fairytale. UV-resistant, durable PVC.',
    price: 34.99,
    originalPrice: 44.99,
    emoji: '🦄',
    imageClass: 'product-card__image--unicorn',
    badge: 'Best Seller',
    badgeClass: '',
    rating: 4.8,
    reviews: 234,
    age: '5+',
    category: 'Pool Inflatables',
    benefits: [
      'Giant 180cm size fits adults and kids',
      'Premium quick-inflate valve',
      'UV-resistant material',
      'Holds up to 120 kg'
    ]
  },
  {
    id: 'sprinkler',
    name: 'Backyard Splash Sprinkler',
    desc: 'Giant 6-metre splash pad with multiple water jets for the ultimate garden water play.',
    price: 24.99,
    originalPrice: 32.99,
    emoji: '💦',
    imageClass: 'product-card__image--sprinkler',
    badge: 'New',
    badgeClass: 'product-card__badge--new',
    rating: 4.7,
    reviews: 187,
    age: '3+',
    category: 'Garden Sprinklers',
    benefits: [
      'Connects to standard garden hose',
      'Non-slip surface',
      'Easy setup in under 2 minutes',
      'Safe rounded edges for toddlers'
    ]
  },
  {
    id: 'blaster',
    name: 'Kids Water Blaster Set',
    desc: 'Set of 4 colour-coded water blasters. Perfect for team water battles in the garden.',
    price: 19.99,
    originalPrice: null,
    emoji: '🔫',
    imageClass: 'product-card__image--blaster',
    badge: null,
    badgeClass: '',
    rating: 4.6,
    reviews: 312,
    age: '4+',
    category: 'Water Toys',
    benefits: [
      'Set of 4 — one for each player',
      'Up to 10m water range',
      'Large 600ml tank each',
      'BPA-free food-grade plastic'
    ]
  },
  {
    id: 'lounger',
    name: 'Floating Pool Lounger',
    desc: 'Premium adult pool lounger with head rest, cup holder and inflatable pillow.',
    price: 42.99,
    originalPrice: 55.99,
    emoji: '🏊',
    imageClass: 'product-card__image--lounger',
    badge: 'Sale',
    badgeClass: 'product-card__badge--sale',
    rating: 4.9,
    reviews: 156,
    age: 'Adult',
    category: 'Pool Inflatables',
    benefits: [
      'Built-in cup holder',
      'Extra thick 0.3mm PVC',
      'Adjustable back rest',
      'Holds up to 150 kg'
    ]
  },
  {
    id: 'slide',
    name: 'Inflatable Water Slide',
    desc: 'Epic 5-metre backyard water slide with splash pool. Hours of non-stop summer fun.',
    price: 89.99,
    originalPrice: 119.99,
    emoji: '🌊',
    imageClass: 'product-card__image--slide',
    badge: 'Popular',
    badgeClass: 'product-card__badge--popular',
    rating: 4.8,
    reviews: 94,
    age: '6+',
    category: 'Water Toys',
    benefits: [
      '5 metres of sliding fun',
      'Built-in sprinkler strip',
      'Safety side walls',
      'Includes repair kit'
    ]
  },
  {
    id: 'beach',
    name: 'Beach Ball Party Pack',
    desc: '8 vibrant oversized beach balls for the whole family. Pool, beach or garden ready.',
    price: 14.99,
    originalPrice: null,
    emoji: '🏖️',
    imageClass: 'product-card__image--beach',
    badge: null,
    badgeClass: '',
    rating: 4.5,
    reviews: 421,
    age: 'All Ages',
    category: 'Beach Fun',
    benefits: [
      '8 balls — 8 different designs',
      '40cm diameter when inflated',
      'Lightweight and easy to pack',
      'Vivid colours that last all summer'
    ]
  }
];

// ---- Initialise ----
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initMobileNav();

  const page = document.body.dataset.page;
  if (page === 'home')     { renderProducts(); }
  if (page === 'product')  { initProductPage(); }
  if (page === 'cart')     { renderCartPage(); }
  if (page === 'checkout') { renderCheckoutSummary(); initPaymentOptions(); initCheckoutForm(); }

  document.body.classList.add('page-enter');
});

// ---- Cart helpers ----
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.emoji} <strong>${product.name}</strong> added to cart!`);
  pulseCartBtn();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartPage();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
  renderCartPage();
}

function saveCart() {
  localStorage.setItem('wakkoCart', JSON.stringify(cart));
}

function cartTotal()  { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount()  { return cart.reduce((s, i) => s + i.qty, 0); }
function shipping()   { return cartTotal() > 50 ? 0 : 4.99; }
function orderTotal() { return cartTotal() + shipping(); }

function updateCartUI() {
  document.querySelectorAll('.nav__cart-count').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

function pulseCartBtn() {
  const btn = document.querySelector('.nav__cart-btn');
  if (!btn) return;
  btn.style.transform = 'scale(1.18)';
  setTimeout(() => btn.style.transform = '', 300);
}

// ---- Render product grid ----
function renderProducts() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__image ${p.imageClass}" onclick="window.location.href='product.html?id=${p.id}'">
        ${p.badge ? `<span class="product-card__badge ${p.badgeClass}">${p.badge}</span>` : ''}
        <button class="product-card__wishlist" onclick="event.stopPropagation(); toggleWishlist('${p.id}', this)" title="Wishlist">🤍</button>
        <span>${p.emoji}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__rating">
          <span class="product-card__stars">${stars(p.rating)}</span>
          <span class="product-card__rating-count">(${p.reviews})</span>
        </div>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__footer">
          <div class="product-card__price">
            <span class="product-card__price-current">€${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="product-card__price-original">€${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="product-card__add" onclick="addToCart('${p.id}')" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function stars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function toggleWishlist(id, btn) {
  if (btn.textContent === '🤍') { btn.textContent = '❤️'; showToast('Added to wishlist! ❤️'); }
  else                          { btn.textContent = '🤍'; showToast('Removed from wishlist'); }
}

// ---- Product page ----
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'unicorn';
  const p  = products.find(pr => pr.id === id) || products[0];

  // Breadcrumb
  const bc = document.querySelector('#breadcrumb-product');
  if (bc) bc.textContent = p.name;

  // Image area
  const mainImg = document.querySelector('.product-gallery__main span');
  if (mainImg) mainImg.textContent = p.emoji;

  // Gradient match
  const mainWrap = document.querySelector('.product-gallery__main');
  if (mainWrap) {
    const gradMap = { unicorn: 'linear-gradient(135deg,#FFB3E6 0%,#FF69B4 100%)', sprinkler: 'linear-gradient(135deg,#B3E5FC 0%,#4FC3F7 100%)', blaster: 'linear-gradient(135deg,#B3F9F3 0%,#26C6DA 100%)', lounger: 'linear-gradient(135deg,#FFE0B2 0%,#FF8F00 100%)', slide: 'linear-gradient(135deg,#C5CAE9 0%,#5C6BC0 100%)', beach: 'linear-gradient(135deg,#FFFDE7 0%,#FFD54F 100%)' };
    mainWrap.style.background = gradMap[p.id] || gradMap.unicorn;
  }

  // Info
  const title = document.querySelector('.product-info__title');
  if (title) title.textContent = p.name;

  const cat = document.querySelector('.product-info__category-tag');
  if (cat) cat.textContent = p.category;

  const price = document.querySelector('.product-info__price-current');
  if (price) price.textContent = `€${p.price.toFixed(2)}`;

  const orig = document.querySelector('.product-info__price-original');
  if (orig) {
    if (p.originalPrice) { orig.textContent = `€${p.originalPrice.toFixed(2)}`; orig.style.display = ''; }
    else orig.style.display = 'none';
  }

  const save = document.querySelector('.product-info__price-save');
  if (save) {
    if (p.originalPrice) {
      const pct = Math.round((1 - p.price / p.originalPrice) * 100);
      save.textContent = `Save ${pct}%`;
    } else save.style.display = 'none';
  }

  const desc = document.querySelector('.product-info__description');
  if (desc) desc.textContent = p.desc;

  const benefitsList = document.querySelector('.product-info__benefits-list');
  if (benefitsList) {
    benefitsList.innerHTML = p.benefits.map(b => `
      <div class="product-info__benefit">
        <span class="product-info__benefit-check">✓</span> ${b}
      </div>`).join('');
  }

  const ageEl = document.querySelector('#metaAge');
  if (ageEl) ageEl.textContent = p.age;

  const reviewCount = document.querySelector('#reviewCount');
  if (reviewCount) reviewCount.textContent = `${p.reviews} reviews`;

  const starsEl = document.querySelector('.product-info__stars');
  if (starsEl) starsEl.textContent = stars(p.rating);

  // Add to cart button
  const addBtn = document.querySelector('#addToCartBtn');
  if (addBtn) addBtn.addEventListener('click', () => {
    const qty = parseInt(document.querySelector('.qty-value')?.textContent || '1');
    for (let i = 0; i < qty; i++) addToCart(p.id);
  });

  // Gallery thumb click
  const thumbs    = document.querySelectorAll('.product-gallery__thumb');
  const thumbEmojis = [p.emoji, '💧', '🌊', '⭐'];
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) mainImg.textContent = thumbEmojis[i] || p.emoji;
    });
  });
  if (thumbs[0]) { thumbs[0].classList.add('active'); thumbs[0].textContent = p.emoji; }

  // Qty selector
  initQtySelector();

  // Related products
  renderRelated(p.id);
}

function initQtySelector() {
  const minus = document.querySelector('.qty-btn--minus');
  const plus  = document.querySelector('.qty-btn--plus');
  const val   = document.querySelector('.qty-value');
  if (!minus || !plus || !val) return;
  minus.addEventListener('click', () => val.textContent = Math.max(1, parseInt(val.textContent) - 1));
  plus.addEventListener('click',  () => val.textContent = parseInt(val.textContent) + 1);
}

function renderRelated(currentId) {
  const grid = document.querySelector('.related-products-grid');
  if (!grid) return;
  const related = products.filter(p => p.id !== currentId).slice(0, 4);
  grid.innerHTML = related.map(p => `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <div class="product-card__image ${p.imageClass}">
        <span>${p.emoji}</span>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__footer">
          <span class="product-card__price-current">€${p.price.toFixed(2)}</span>
          <button class="product-card__add" onclick="event.stopPropagation(); addToCart('${p.id}')">+</button>
        </div>
      </div>
    </div>`).join('');
}

// ---- Cart page ----
function renderCartPage() {
  const itemsEl = document.querySelector('.cart-items');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty__icon">🛒</span>
        <h3>Your cart is empty</h3>
        <p>Add some summer fun to your cart!</p>
        <a href="index.html" class="btn btn--primary">Shop Summer Toys</a>
      </div>`;
  } else {
    itemsEl.innerHTML = `
      <div class="cart-items-header">
        <div></div>
        <div>Product</div>
        <div style="text-align:center">Quantity</div>
        <div style="text-align:right">Price</div>
        <div></div>
      </div>` +
      cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        const imgClass = p ? p.imageClass.replace('product-card__image--','') : 'unicorn';
        const gradMap = { unicorn:'linear-gradient(135deg,#FFB3E6,#FF69B4)', sprinkler:'linear-gradient(135deg,#B3E5FC,#4FC3F7)', blaster:'linear-gradient(135deg,#B3F9F3,#26C6DA)', lounger:'linear-gradient(135deg,#FFE0B2,#FF8F00)', slide:'linear-gradient(135deg,#C5CAE9,#5C6BC0)', beach:'linear-gradient(135deg,#FFFDE7,#FFD54F)' };
        return `
        <div class="cart-item">
          <div class="cart-item__image" style="background:${gradMap[item.id] || gradMap.unicorn}">${item.emoji}</div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__meta"><span class="cart-item__stock">✓ In stock</span></div>
          </div>
          <div class="qty-selector">
            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          </div>
          <div class="cart-item__price">€${(item.price * item.qty).toFixed(2)}</div>
          <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
        </div>`;
      }).join('');
  }

  // Summary numbers
  setText('#cartSubtotal', `€${cartTotal().toFixed(2)}`);
  setText('#cartShipping', shipping() === 0 ? 'FREE 🎉' : `€${shipping().toFixed(2)}`);
  setText('#cartTotal', `€${orderTotal().toFixed(2)}`);

  // Free shipping nudge
  const nudge = document.querySelector('#freeShippingNudge');
  if (nudge) {
    if (cartTotal() >= 50) {
      nudge.textContent = '🎉 You\'ve unlocked free shipping!';
      nudge.style.display = 'block';
    } else {
      const left = (50 - cartTotal()).toFixed(2);
      nudge.textContent = `Add €${left} more for FREE shipping!`;
      nudge.style.display = 'block';
    }
  }
}

// ---- Checkout page ----
function renderCheckoutSummary() {
  const container = document.querySelector('.checkout-summary-items');
  if (!container) return;

  const gradMap = { unicorn:'linear-gradient(135deg,#FFB3E6,#FF69B4)', sprinkler:'linear-gradient(135deg,#B3E5FC,#4FC3F7)', blaster:'linear-gradient(135deg,#B3F9F3,#26C6DA)', lounger:'linear-gradient(135deg,#FFE0B2,#FF8F00)', slide:'linear-gradient(135deg,#C5CAE9,#5C6BC0)', beach:'linear-gradient(135deg,#FFFDE7,#FFD54F)' };

  container.innerHTML = cart.length === 0
    ? '<p style="color:var(--text-light);font-size:0.875rem;font-weight:600;padding:12px 0">Your cart is empty.</p>'
    : cart.map(item => `
        <div class="checkout-summary-item">
          <div class="checkout-summary-item__image" style="background:${gradMap[item.id] || gradMap.unicorn}">${item.emoji}</div>
          <div class="checkout-summary-item__info">
            <div class="checkout-summary-item__name">${item.name}</div>
            <div class="checkout-summary-item__qty">Qty: ${item.qty}</div>
          </div>
          <div class="checkout-summary-item__price">€${(item.price * item.qty).toFixed(2)}</div>
        </div>`).join('');

  setText('#checkoutSubtotal', `€${cartTotal().toFixed(2)}`);
  setText('#checkoutShipping', shipping() === 0 ? 'FREE' : `€${shipping().toFixed(2)}`);
  setText('#checkoutTotal', `€${orderTotal().toFixed(2)}`);
}

function initPaymentOptions() {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
  const first = document.querySelector('.payment-option');
  if (first) first.classList.add('selected');
}

function initCheckoutForm() {
  const form = document.querySelector('#checkoutForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    cart = [];
    saveCart();
    updateCartUI();
    document.querySelector('.checkout-layout').innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:80px 24px;">
        <div style="font-size:5rem;margin-bottom:22px;">🎉</div>
        <h2 style="font-size:2rem;font-weight:900;color:var(--dark);margin-bottom:12px;">Order Confirmed!</h2>
        <p style="font-size:1rem;color:var(--text-light);font-weight:600;margin-bottom:10px;">Thank you for shopping with Wakko Summer!</p>
        <p style="font-size:0.9rem;color:var(--text-light);font-weight:600;margin-bottom:32px;">A confirmation email has been sent to your inbox. Your summer fun is on its way! ☀️</p>
        <a href="index.html" class="btn btn--primary btn--lg">Continue Shopping</a>
      </div>`;
  });
}

// ---- Mobile nav ----
function initMobileNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const links     = document.querySelector('.nav__links');
  if (!hamburger || !links) return;
  hamburger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ---- Toast ----
let toastTimer;
function showToast(html) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.innerHTML = html;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ---- Utility ----
function setText(sel, val) {
  const el = document.querySelector(sel);
  if (el) el.textContent = val;
}
