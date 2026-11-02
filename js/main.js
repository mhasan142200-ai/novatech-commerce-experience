const CART_KEY = "novatech_cart";
const ORDER_KEY = "novatech_last_order";
const TAX_RATE = 0.13;
const FREE_SHIPPING_MINIMUM = 50;
const SHIPPING_FEE = 9.99;

// PayPal sandbox (test mode). The client ID is public by design; the app secret never belongs in front-end code.
const PAYPAL_CLIENT_ID = "AU-9nI92fSx0ahqEjKlgdr7abm8zTcJKMEls6dWjwja0kvJVgTggWT7v2ffEgJ_lAhgh21BRZ7vNVEIQ";
const PAYPAL_CURRENCY = "CAD";

const products = [
    {
        id: 1,
        name: "Nova Wireless Earbuds Pro",
        category: "audio",
        price: 79.99,
        icon: "🎧",
        image: "images/products/nova-wireless-earbuds-pro.svg",
        alt: "Nova Wireless Earbuds Pro noise-cancelling earbuds in an open charging case",
        description: "Active noise cancellation, clear audio, and up to 24 hours of listening with the charging case."
    },
    {
        id: 2,
        name: "Ultra-Slim Armor Phone Case",
        category: "accessories",
        price: 29.99,
        icon: "📱",
        image: "images/products/ultra-slim-armor-phone-case.svg",
        alt: "Ultra-Slim Armor protective phone case with reinforced corners",
        description: "A slim protective shell with reinforced corners, a matte finish, and a comfortable grip."
    },
    {
        id: 3,
        name: "PowerVolt 20K Power Bank",
        category: "charging",
        price: 49.99,
        icon: "🔋",
        image: "images/products/powervolt-20k-power-bank.svg",
        alt: "PowerVolt 20K 20,000 mAh USB-C power bank with fast-charging cable",
        description: "A 20,000 mAh portable battery with 65W USB-C fast charging for phones, tablets, and laptops."
    },
    {
        id: 4,
        name: "Pulse Smartwatch Elite",
        category: "wearables",
        price: 199.99,
        icon: "⌚",
        image: "images/products/pulse-smartwatch-elite.svg",
        alt: "Pulse Smartwatch Elite fitness watch displaying heart rate",
        description: "An AMOLED fitness watch with heart-rate tracking, activity insights, and seven-day battery life."
    },
    {
        id: 5,
        name: "SoundWave Mini Speaker",
        category: "audio",
        price: 39.99,
        icon: "🔊",
        image: "images/products/soundwave-mini-speaker.svg",
        alt: "SoundWave Mini waterproof portable Bluetooth speaker",
        description: "A compact IPX7 water-resistant Bluetooth speaker with balanced 360-degree sound."
    },
    {
        id: 6,
        name: "HyperConnect 7-in-1 Hub",
        category: "accessories",
        price: 59.99,
        icon: "⌨️",
        image: "images/products/hyperconnect-7-in-1-usb-c-hub.svg",
        alt: "HyperConnect 7-in-1 USB-C hub with HDMI, SD card and USB ports",
        description: "A USB-C hub with 4K HDMI, 100W power delivery, an SD reader, and three USB ports."
    }
];

function getCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
        if (!Array.isArray(savedCart)) return [];

        return savedCart.filter(item =>
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            products.some(product => product.id === item.id)
        );
    } catch {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
        showToast("Your browser could not save the cart.");
    }
    updateCartBadge();
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }

    saveCart(cart);
    showToast(`${product.name} added to your cart.`);
    renderCart();
}

function removeFromCart(productId) {
    const product = products.find(item => item.id === productId);
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
    showToast(product ? `${product.name} removed.` : "Item removed.");
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(cartItem => cartItem.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart(cart);
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    const totalCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = String(totalCount);
    badge.setAttribute("aria-label", `${totalCount} ${totalCount === 1 ? "item" : "items"}`);
}

function showToast(message) {
    const toastContainer = document.getElementById("toast");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    window.setTimeout(() => toast.remove(), 3200);
}

function createProductCard(product) {
    return `
        <article class="product-card">
            <div class="product-visual ${product.category}">
                <img class="product-image" src="${product.image}" alt="${product.alt}" width="320" height="240" loading="lazy">
            </div>
            <div class="product-info">
                <span class="category-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="product-bottom">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" type="button" data-add-to-cart="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                </div>
            </div>
        </article>
    `;
}

function renderFeaturedProducts() {
    const container = document.getElementById("featured-products");
    if (!container) return;

    container.innerHTML = products.slice(0, 3).map(createProductCard).join("");
}

function renderProducts(itemsToRender = products) {
    const container = document.getElementById("products-grid");
    if (!container) return;

    if (itemsToRender.length === 0) {
        container.innerHTML = '<p class="no-results">No products match that search. Try another keyword or category.</p>';
        return;
    }

    container.innerHTML = itemsToRender.map(createProductCard).join("");
}

function getDetailedCart() {
    return getCart().map(item => ({
        ...products.find(product => product.id === item.id),
        quantity: item.quantity
    })).filter(item => item.id);
}

// Totals are kept in cents so the PayPal breakdown always adds up exactly.
function calculateTotals(detailedCart) {
    const subtotal = detailedCart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MINIMUM * 100 ? 0 : Math.round(SHIPPING_FEE * 100);
    const tax = Math.round((subtotal + shipping) * TAX_RATE);
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}

function renderSummaryTotals(prefix, totals) {
    document.getElementById(`${prefix}-subtotal`).textContent = formatMoney(totals.subtotal);
    document.getElementById(`${prefix}-shipping`).textContent = totals.shipping === 0 ? "FREE" : formatMoney(totals.shipping);
    document.getElementById(`${prefix}-tax`).textContent = formatMoney(totals.tax);
    document.getElementById(`${prefix}-total`).textContent = formatMoney(totals.total);
}

function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    if (!cartContainer) return;

    const checkoutButton = document.querySelector(".checkout-btn");
    const detailedCart = getDetailedCart();

    if (detailedCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty. <a href="products.html">Explore products</a></p>';
        renderSummaryTotals("cart", calculateTotals([]));
        document.getElementById("cart-shipping").textContent = "Free over $50";
        checkoutButton.disabled = true;
        return;
    }

    cartContainer.innerHTML = detailedCart.map(item => `
        <article class="cart-item">
            <div class="cart-item-visual ${item.category}">
                <img src="${item.image}" alt="${item.alt}" width="86" height="65">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <span class="item-price">$${item.price.toFixed(2)} each · Line total ${formatMoney(Math.round(item.price * 100) * item.quantity)}</span>
            </div>
            <div class="cart-item-controls" aria-label="Quantity controls for ${item.name}">
                <button class="qty-btn" type="button" data-cart-action="decrease" data-product-id="${item.id}" aria-label="Decrease ${item.name} quantity">−</button>
                <span class="qty-display" aria-label="Quantity ${item.quantity}">${item.quantity}</span>
                <button class="qty-btn" type="button" data-cart-action="increase" data-product-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
                <button class="remove-btn" type="button" data-cart-action="remove" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">×</button>
            </div>
        </article>
    `).join("");

    renderSummaryTotals("cart", calculateTotals(detailedCart));
    checkoutButton.disabled = false;
}

function renderOrderLines(detailedCart) {
    return detailedCart.map(item => `
        <li class="order-line">
            <img src="${item.image}" alt="" width="64" height="48">
            <span><strong>${item.name}</strong><small>Qty ${item.quantity} × $${item.price.toFixed(2)}</small></span>
            <span class="order-line-total">${formatMoney(Math.round(item.price * 100) * item.quantity)}</span>
        </li>
    `).join("");
}

function setCheckoutStatus(message, isError = false) {
    const status = document.getElementById("checkout-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
}

function loadPayPalSdk() {
    return new Promise((resolve, reject) => {
        if (window.paypal) {
            resolve(window.paypal);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&currency=${PAYPAL_CURRENCY}&intent=capture&components=buttons`;
        script.onload = () => window.paypal ? resolve(window.paypal) : reject(new Error("PayPal unavailable"));
        script.onerror = () => reject(new Error("PayPal could not load"));
        document.head.appendChild(script);
    });
}

function toPayPalAmount(cents) {
    return { currency_code: PAYPAL_CURRENCY, value: (cents / 100).toFixed(2) };
}

function renderCheckout() {
    const checkoutItems = document.getElementById("checkout-items");
    if (!checkoutItems) return;

    const detailedCart = getDetailedCart();
    if (detailedCart.length === 0) {
        document.querySelector(".checkout-layout").hidden = true;
        document.getElementById("checkout-empty").hidden = false;
        return;
    }

    checkoutItems.innerHTML = renderOrderLines(detailedCart);
    renderSummaryTotals("checkout", calculateTotals(detailedCart));

    if (!PAYPAL_CLIENT_ID) {
        setCheckoutStatus("PayPal sandbox payments are not configured yet.", true);
        return;
    }

    setCheckoutStatus("Loading secure PayPal sandbox checkout…");
    let orderedCart = [];

    loadPayPalSdk().then(paypal => paypal.Buttons({
        style: { layout: "vertical", shape: "rect", label: "pay" },
        // Prices are re-read from the catalog when the order is created, not taken from saved cart data.
        createOrder: (data, actions) => {
            orderedCart = getDetailedCart();
            const totals = calculateTotals(orderedCart);
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                    description: "NovaTech sandbox order",
                    amount: {
                        ...toPayPalAmount(totals.total),
                        breakdown: {
                            item_total: toPayPalAmount(totals.subtotal),
                            shipping: toPayPalAmount(totals.shipping),
                            tax_total: toPayPalAmount(totals.tax)
                        }
                    },
                    items: orderedCart.map(item => ({
                        name: item.name,
                        sku: `NT-${item.id}`,
                        unit_amount: toPayPalAmount(Math.round(item.price * 100)),
                        quantity: String(item.quantity),
                        category: "PHYSICAL_GOODS"
                    }))
                }]
            });
        },
        onApprove: async (data, actions) => {
            setCheckoutStatus("Confirming your sandbox payment…");
            let details;
            try {
                details = await actions.order.capture();
            } catch (error) {
                // A declined card can be retried with another funding source without restarting checkout.
                if (String(error?.message || error).includes("INSTRUMENT_DECLINED")) {
                    setCheckoutStatus("Your payment method was declined. Please choose another card or PayPal account.", true);
                    return actions.restart();
                }
                setCheckoutStatus("The payment could not be completed, so you were not charged. Your cart has not changed.", true);
                return undefined;
            }

            const capture = details.purchase_units?.[0]?.payments?.captures?.[0];
            if (capture?.status && !["COMPLETED", "PENDING"].includes(capture.status)) {
                setCheckoutStatus(`PayPal reported the payment as ${capture.status.toLowerCase()}. Your cart has not changed.`, true);
                return undefined;
            }
            const order = {
                orderId: details.id,
                captureId: capture?.id || "",
                status: capture?.status || details.status,
                payerName: details.payer?.name?.given_name || "",
                placedAt: new Date().toISOString(),
                items: orderedCart.map(({ id, name, price, quantity, image }) => ({ id, name, price, quantity, image })),
                totals: calculateTotals(orderedCart)
            };

            try {
                sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
            } catch {
                // The payment is complete even if the confirmation details cannot be stored.
            }
            localStorage.removeItem(CART_KEY);
            window.location.href = "order-confirmation.html";
        },
        onCancel: () => setCheckoutStatus("Payment cancelled. Your cart has not changed."),
        onError: () => setCheckoutStatus("PayPal could not complete the sandbox payment. You were not charged; please try again.", true)
    }).render("#paypal-button-container"))
        .then(() => setCheckoutStatus("Choose PayPal or a test card to pay in sandbox mode."))
        .catch(() => setCheckoutStatus("PayPal checkout could not load. Check your connection and refresh the page.", true));
}

function renderConfirmation() {
    const confirmation = document.getElementById("order-confirmation");
    if (!confirmation) return;

    let order = null;
    try {
        order = JSON.parse(sessionStorage.getItem(ORDER_KEY));
    } catch {
        order = null;
    }

    if (!order?.orderId) {
        confirmation.hidden = true;
        document.getElementById("confirmation-empty").hidden = false;
        return;
    }

    document.getElementById("confirmation-greeting").textContent = order.payerName
        ? `Thank you, ${order.payerName}. Your payment was approved.`
        : "Thank you. Your payment was approved.";
    document.getElementById("confirmation-order-id").textContent = order.orderId;
    document.getElementById("confirmation-capture-id").textContent = order.captureId || "Not provided";
    document.getElementById("confirmation-status").textContent = order.status;
    document.getElementById("confirmation-date").textContent = new Date(order.placedAt).toLocaleString("en-CA", {
        dateStyle: "long",
        timeStyle: "short"
    });

    const items = order.items
        .map(item => ({ ...item, ...products.find(product => product.id === item.id) }))
        .filter(item => item.name);
    document.getElementById("confirmation-items").innerHTML = renderOrderLines(items);
    renderSummaryTotals("confirmation", order.totals);
}

function setupProductActions() {
    document.addEventListener("click", event => {
        const addButton = event.target.closest("[data-add-to-cart]");
        if (addButton) {
            addToCart(Number(addButton.dataset.addToCart));
            return;
        }

        const cartButton = event.target.closest("[data-cart-action]");
        if (!cartButton) return;

        const productId = Number(cartButton.dataset.productId);
        const action = cartButton.dataset.cartAction;
        if (action === "increase") updateQuantity(productId, 1);
        if (action === "decrease") updateQuantity(productId, -1);
        if (action === "remove") removeFromCart(productId);
    });
}

function setupFilters() {
    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const searchInput = document.getElementById("product-search");
    const resultCount = document.getElementById("product-results-count");
    if (!filterButtons.length || !searchInput || !resultCount) return;

    let activeCategory = "all";
    let searchQuery = "";

    const applyFilters = () => {
        const query = searchQuery.trim().toLowerCase();
        const filteredProducts = products.filter(product => {
            const matchesCategory = activeCategory === "all" || product.category === activeCategory;
            const matchesSearch = !query || [product.name, product.description, product.category]
                .some(value => value.toLowerCase().includes(query));
            return matchesCategory && matchesSearch;
        });

        renderProducts(filteredProducts);
        resultCount.textContent = filteredProducts.length === products.length
            ? `Showing all ${products.length} products`
            : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`;
    };

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });
            activeCategory = button.dataset.filter || "all";
            applyFilters();
        });
    });

    searchInput.addEventListener("input", event => {
        searchQuery = event.target.value;
        applyFilters();
    });
}

function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!toggle || !navLinks) return;

    const setMenuState = isOpen => {
        navLinks.classList.toggle("active", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    };

    toggle.addEventListener("click", () => {
        setMenuState(toggle.getAttribute("aria-expanded") !== "true");
    });

    navLinks.addEventListener("click", event => {
        if (event.target.closest("a")) setMenuState(false);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 780) setMenuState(false);
    });
}

function setupNewsletter() {
    const form = document.querySelector(".newsletter-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value) return;

        showToast("Demo complete—your email was not sent or stored.");
        form.reset();
    });
}

function setupCheckout() {
    const checkoutButton = document.querySelector(".checkout-btn");
    if (!checkoutButton) return;

    checkoutButton.addEventListener("click", () => {
        if (!checkoutButton.disabled) {
            window.location.href = "checkout.html";
        }
    });
}

function setupPrivacyControl() {
    const clearButton = document.getElementById("clear-site-data");
    const status = document.getElementById("privacy-status");
    if (!clearButton || !status) return;

    const updateStatus = () => {
        const itemCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
        status.textContent = itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "cart item is" : "cart items are"} saved in this browser.`
            : "No NovaTech cart data is currently saved.";
    };

    updateStatus();
    clearButton.addEventListener("click", () => {
        localStorage.removeItem(CART_KEY);
        try {
            sessionStorage.removeItem(ORDER_KEY);
        } catch {
            // Session storage may be unavailable; the cart has still been cleared.
        }
        updateCartBadge();
        updateStatus();
        showToast("Saved NovaTech cart data cleared.");
    });
}

function setupShareButtons() {
    const shareButtons = [...document.querySelectorAll("[data-share-post]")];
    if (!shareButtons.length) return;

    const copyShareUrl = async url => {
        if (!navigator.clipboard?.writeText) {
            showToast("Sharing is unavailable in this browser. Copy the post URL from the address bar.");
            return;
        }

        await navigator.clipboard.writeText(url);
        showToast("Post link copied to your clipboard.");
    };

    shareButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const article = document.getElementById(button.dataset.sharePost);
            const heading = article?.querySelector("h2");
            if (!article || !heading) return;

            const shareUrl = new URL(window.location.href);
            shareUrl.hash = article.id;
            const shareData = {
                title: `${heading.textContent.trim()} | NovaTech`,
                text: "Read this NovaTech team article.",
                url: shareUrl.toString()
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    showToast("Post shared.");
                    return;
                } catch (error) {
                    if (error.name === "AbortError") return;
                }
            }

            try {
                await copyShareUrl(shareData.url);
            } catch {
                showToast("Sharing is unavailable in this browser. Copy the post URL from the address bar.");
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    renderFeaturedProducts();
    renderProducts();
    renderCart();
    renderCheckout();
    renderConfirmation();
    setupProductActions();
    setupFilters();
    setupMobileMenu();
    setupNewsletter();
    setupCheckout();
    setupPrivacyControl();
    setupShareButtons();
});
