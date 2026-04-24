// ============================================
// ULTRA SECO - DYNAMIC PRODUCT CATALOG & CART
// ============================================

// --- PRODUCT DATA (Moved to top for safety) ---
window.products = [
    {
        id: 'solucion-interior',
        name: 'Ultra Seco Solución Interior',
        category: 'Construcción',
        description: 'Nanotecnología hidrofóbica para paredes y techos interiores.',
        image: 'images/interiores.jpg',
        link: 'interiores.html',
        type: 'retail_wholesale',
        options: [
            { label: '1 Litro', price: 13.99, wholesalePrice: 9.79, sku: 'US-INT-1L' },
            { label: '1 Litro (Atomizador)', price: 14.99, wholesalePrice: 10.49, sku: 'US-INT-1L-ATOM' },
            { label: 'Galón (3.785L)', price: 38.00, wholesalePrice: 26.6, sku: 'US-INT-GAL' },
            { label: 'Cuñete (18L)', price: 170.00, wholesalePrice: 119.0, sku: 'US-INT-CUN' },
        ]
    },
    {
        id: 'solucion-exterior',
        name: 'Ultra Seco Solución Exterior',
        category: 'Construcción',
        description: 'Protección reforzada contra rayos UV y lluvia.',
        image: 'images/exteriores.jpg',
        link: 'exteriores.html',
        type: 'retail_wholesale',
        options: [
            { label: '1 Litro', price: 16.99, wholesalePrice: 11.89, sku: 'US-EXT-1L' },
            { label: '1 Litro (Atomizador)', price: 17.99, wholesalePrice: 12.59, sku: 'US-EXT-1L-ATOM' },
            { label: 'Galón (3.785L)', price: 48.00, wholesalePrice: 33.6, sku: 'US-EXT-GAL' },
            { label: 'Cuñete (18L)', price: 217.50, wholesalePrice: 152.25, sku: 'US-EXT-CUN' },
        ]
    },
    {
        id: 'fortificador',
        name: 'Fortificador de Superficies',
        category: 'Construcción',
        description: 'Fortalece, protege y mejora la durabilidad del concreto.',
        image: 'images/fortificador.jpg',
        link: 'fortificador.html',
        type: 'retail_wholesale',
        options: [
            { label: '1 Litro', price: 19.00, wholesalePrice: 13.3, sku: 'US-FORT-1L' },
            { label: 'Galón', price: 52.00, wholesalePrice: 36.4, sku: 'US-FORT-GAL' },
            { label: 'Cuñete', price: 254.50, wholesalePrice: 178.15, sku: 'US-FORT-CUN' },
        ]
    },
    {
        id: 'pintura-hidrofobica',
        name: 'Pintura Súper Hidrofóbica',
        category: 'Construcción',
        description: 'Fórmula Ultra Reforzada. Máxima repelencia.',
        image: 'images/pintura.jpg',
        link: 'pintura.html',
        type: 'retail_wholesale',
        options: [
            { label: 'Galón', price: 34.00, wholesalePrice: 23.8, sku: 'PINT-GAL' },
        ]
    },
    {
        id: 'escudo-ceramico',
        name: 'Escudo Cerámico',
        category: 'Hogar',
        description: 'Protección cerámica de alto rendimiento.',
        image: 'images/escudo.jpg',
        link: 'escudo.html',
        type: 'retail_wholesale',
        options: [
            { label: '1 Litro', price: 45.00, wholesalePrice: 31.5, sku: 'ESCUDO-1L' },
        ]
    },
    {
        id: 'estuco',
        name: 'Estuco Súper Hidrofóbico',
        category: 'Construcción',
        description: 'Pasta profesional bloqueadora de humedad.',
        image: 'images/estuco.jpg',
        link: 'estuco.html',
        type: 'retail_wholesale',
        options: [
            { label: '1/4 Galón', price: 6.40, wholesalePrice: 4.48, sku: 'ESTUCO-1/4' },
            { label: 'Galón', price: 19.00, wholesalePrice: 13.3, sku: 'ESTUCO-GAL' },
        ]
    },
    {
        id: 'nano-aditivo',
        name: 'Nano Aditivo para Concreto',
        category: 'Construcción',
        description: 'Aditivo nanotecnológico para concreto.',
        image: 'images/aditivo.png',
        link: 'nano-aditivo.html',
        type: 'retail_wholesale',
        options: [
            { label: '600gr', price: 15.00, wholesalePrice: 10.5, sku: 'ADITIVO-600G' }
        ]
    },
    {
        id: 'cera-protectora',
        name: 'Cera Nano Protectora',
        category: 'Hogar',
        description: 'Cera hidrofóbica para acabados brillantes.',
        image: 'images/cera.jpg',
        link: 'cera.html',
        type: 'retail_wholesale',
        options: [
            { label: '500ml', price: 15.00, wholesalePrice: 10.5, sku: 'CERA-500ML' },
        ]
    },
    {
        id: 'champu',
        name: 'Champú Nano-Concentrado',
        category: 'Vehicular',
        description: 'Encapsula la suciedad para un lavado rápido.',
        image: 'images/champu/product.jpg',
        link: 'champu.html',
        type: 'retail_wholesale',
        options: [
            { label: '1 Litro', price: 12.00, wholesalePrice: 8.4, sku: 'CHAMPU-1L' },
            { label: 'Galón', price: 35.00, wholesalePrice: 24.5, sku: 'CHAMPU-GAL' },
        ]
    },

    // --- NUEVA DIVISIÓN INDUSTRIA ---
    {
        id: 'eco-capturador',
        name: 'Eco Capturador (Minería)',
        category: 'Industria',
        description: 'Sustituto ecológico del mercurio para recuperación de oro.',
        image: 'assets/hero-eco.jpg',
        link: 'eco.html',
        type: 'industrial',
        options: [
            { label: '1 Litro', price: 85.00, wholesalePrice: 59.5, sku: 'ECO-1L' },
            { label: 'Galón', price: 320.00, wholesalePrice: 224.0, sku: 'ECO-GAL' },
            { label: 'Cuñete', price: 1500.00, wholesalePrice: 1050.0, sku: 'ECO-CUN' }
        ]
    },
    {
        id: 'ultra-f3',
        name: 'Ultra F3 (Anti-Fuego)',
        category: 'Industria',
        description: 'Espuma extintora biodegradable para incendios forestales e industriales.',
        image: 'assets/hero-f3.jpg',
        link: 'f3.html',
        type: 'industrial',
        options: [
            { label: 'Cuñete (18L)', price: 450.00, wholesalePrice: 315.0, sku: 'F3-CUN' },
            { label: 'Tambor (200L)', price: 4800.00, wholesalePrice: 3360.0, sku: 'F3-TAM' }
        ]
    },
    {
        id: 'aditivo-asfaltico',
        name: 'Aditivo Asfáltico',
        category: 'Industria',
        description: 'Blindaje contra agua y sol para mezclas asfálticas.',
        image: 'images/aditivo_asfaltico.png',
        link: 'aditivo.html',
        type: 'industrial',
        options: [
            { label: 'Tambor (200L)', price: 3500.00, wholesalePrice: 2450.0, sku: 'ASF-TAM' },
            { label: 'Granel (1000L)', price: 16000.00, wholesalePrice: 11200.0, sku: 'ASF-tank' }
        ]
    },
    {
        id: 'magnetron',
        name: 'Eco Capturador Magnetron',
        category: 'Industria',
        description: 'Tecnología iónica de alto rendimiento para recuperación de oro y plata.',
        image: 'images/magnetron/Gemini_Generated_Image_datubudatubudatu.png',
        link: 'magnetron.html',
        type: 'industrial',
        options: [
            { label: '1 Litro', price: 95.00, wholesalePrice: 66.5, sku: 'MAG-1L' },
            { label: 'Galón', price: 345.00, wholesalePrice: 241.5, sku: 'MAG-GAL' },
            { label: 'Cuñete', price: 1650.00, wholesalePrice: 1155.0, sku: 'MAG-CUN' }
        ]
    }
];
// Backwards compatibility if needed
const products = window.products;

// --- STATE MANAGEMENT ---
let state; // Define with let to allow try-catch block
try {
    state = {
        view: 'retail',
        cart: JSON.parse(localStorage.getItem('ultraSecoCart')) || [],
        quoteList: JSON.parse(localStorage.getItem('ultraSecoQuote')) || [],
        notification: null,
        isCartOpen: false
    };
} catch (e) {
    console.warn("Failed to init state from localStorage", e);
    state = { view: 'retail', cart: [], quoteList: [], notification: null, isCartOpen: false };
}

// --- PRICE OVERRIDES SYSTEM ---
// Load saved prices from Internal Portal (localStorage)
try {
    const savedPrices = JSON.parse(localStorage.getItem('ultraSecoPrices'));
    if (savedPrices) {
        products.forEach(product => {
            if (savedPrices[product.id]) {
                // Determine if structure matches (array or simple price)
                // New logic: stored as array of options matching original order
                const savedOptions = savedPrices[product.id];

                // Safety check: ensure lengths match to avoid misalignment
                if (Array.isArray(savedOptions) && savedOptions.length === product.options.length) {
                    // Update prices
                    product.options.forEach((opt, idx) => {
                        if (savedOptions[idx] && typeof savedOptions[idx].price === 'number') {
                            opt.price = savedOptions[idx].price;
                        }
                    });
                }
            }
        });
        console.log('Ultra Seco System: Custom prices loaded from ecosystem storage.');
    }
} catch (e) {
    console.warn('Ultra Seco System: Could not load custom prices.', e);
}

// --- STYLES INJECTION (Premium Drawer) ---
const cartStyles = `
    .cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    .cart-overlay.open {
        opacity: 1;
        pointer-events: auto;
    }
    .cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 450px;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }
    .cart-drawer.open {
        transform: translateX(0);
    }
    .cart-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.5);
    }
    .cart-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }
    .close-cart-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #64748b;
        cursor: pointer;
        transition: color 0.2s;
    }
    .close-cart-btn:hover {
        color: #ef4444;
    }
    .cart-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }
    .cart-item-card {
        display: flex;
        gap: 1rem;
        background: white;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s;
        border: 1px solid rgba(0, 0, 0, 0.03);
    }
    .cart-item-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .cart-item-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
    .cart-item-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .cart-item-title {
        font-weight: 600;
        color: #1e293b;
        font-size: 1rem;
        margin: 0 0 0.25rem 0;
    }
    .cart-item-variant {
        font-size: 0.85rem;
        color: #64748b;
        margin: 0;
    }
    .cart-item-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
    }
    .qty-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f1f5f9;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
    }
    .qty-btn {
        background: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #334155;
        font-weight: bold;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .qty-btn:hover {
        background: #e2e8f0;
    }
    .item-price {
        font-weight: 700;
        color: #0f172a;
    }
    .remove-btn {
        color: #ef4444;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.25rem;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    .remove-btn:hover {
        opacity: 1;
    }
    .cart-footer {
        padding: 1.5rem;
        background: white;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    }
    .cart-summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        color: #64748b;
    }
    .cart-total-row {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
    }
    .checkout-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    .checkout-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .empty-cart {
        text-align: center;
        padding: 3rem 1rem;
        color: #64748b;
    }
    .empty-cart i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #cbd5e1;
    }
`;

// Inject Styles
const styleSheet = document.createElement("style");
styleSheet.innerText = cartStyles;
document.head.appendChild(styleSheet);

// --- CART LOGIC ---

function addToCart(product, option, quantity = 1) {
    const existingItem = state.cart.find(item => item.sku === option.sku);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        state.cart.push({
            ...product,
            selectedOption: option,
            quantity: parseInt(quantity),
            sku: option.sku
        });
    }
    updateCartBadge();
    localStorage.setItem('ultraSecoCart', JSON.stringify(state.cart));
    showNotification(`"${product.name}" añadido al carrito`);

    // Auto open cart for better UX
    if (!state.isCartOpen) {
        toggleCart();
    } else {
        renderCartDrawer(); // Refresh if already open
    }
}

function updateQuantity(sku, change) {
    const item = state.cart.find(i => i.sku === sku);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(sku);
        } else {
            localStorage.setItem('ultraSecoCart', JSON.stringify(state.cart));
            renderCartDrawer();
            updateCartBadge();
        }
    }
}

function removeFromCart(sku) {
    state.cart = state.cart.filter(item => item.sku !== sku);
    updateCartBadge();
    localStorage.setItem('ultraSecoCart', JSON.stringify(state.cart));
    renderCartDrawer();
}

function getTotalPrice() {
    return state.cart.reduce((total, item) => total + (item.selectedOption.price * item.quantity), 0).toFixed(2);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = state.cart.length;
        badge.style.display = state.cart.length > 0 ? 'flex' : 'none';
    }
}

// --- DRAWER SYSTEM ---

function createCartDrawer() {
    // Check if exists
    if (document.getElementById('cart-drawer-root')) return;

    const root = document.createElement('div');
    root.id = 'cart-drawer-root';
    root.innerHTML = `
        <div class="cart-overlay" onclick="toggleCart()"></div>
        <div class="cart-drawer">
            <div class="cart-header">
                <h2>Tu Carrito</h2>
                <button class="close-cart-btn" onclick="toggleCart()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="cart-body" id="cart-drawer-body">
                <!-- Items go here -->
            </div>
            <div class="cart-footer" id="cart-drawer-footer">
                <!-- Totals go here -->
            </div>
        </div>
`;
    document.body.appendChild(root);
}

function toggleCart() {
    // Check if Shopify cart is available
    const toggleFrame = document.querySelector('iframe[name="frame-toggle"]');
    if (toggleFrame) {
        // Shopify cart is available - use it
        try {
            const innerDoc = toggleFrame.contentDocument || toggleFrame.contentWindow.document;
            const innerButton = innerDoc.querySelector('.shopify-buy__cart-toggle') || innerDoc.querySelector('button');
            if (innerButton) {
                innerButton.click();
                console.log('✅ Abrió carrito de Shopify');
                return;
            }
        } catch (e) {
            console.warn('⚠️ No se pudo acceder al iframe de Shopify:', e.message);
        }
    }

    // Fallback to local cart drawer
    createCartDrawer(); // Ensure it exists
    const overlay = document.querySelector('.cart-overlay');
    const drawer = document.querySelector('.cart-drawer');

    state.isCartOpen = !state.isCartOpen;

    if (state.isCartOpen) {
        overlay.classList.add('open');
        drawer.classList.add('open');
        renderCartDrawer();
    } else {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
    }
}

function renderCartDrawer() {
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');
    if (!body || !footer) return;

    if (state.cart.length === 0) {
        body.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-shopping-basket"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Explora nuestros productos y protege tus espacios.</p>
                <button onclick="toggleCart()" class="cta-button" style="margin-top: 1rem;">Seguir Comprando</button>
            </div>
    `;
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';

    body.innerHTML = state.cart.map(item => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div>
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-variant">${item.selectedOption.label}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity('${item.sku}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.sku}', 1)">+</button>
                    </div>
                    <div class="item-price">$${(item.selectedOption.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart('${item.sku}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
`).join('');

    footer.innerHTML = `
        <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>$${getTotalPrice()}</span>
        </div>
        <div class="cart-summary-row">
            <span>Envío</span>
            <span>Calculado al pagar</span>
        </div>
        <div class="cart-total-row">
            <span>Total</span>
            <span>$${getTotalPrice()}</span>
        </div>
        <button class="checkout-btn" onclick="alert('Redirigiendo a pasarela de pago...')">
            <i class="fa-solid fa-lock"></i> Finalizar Compra
        </button>
`;
}

// --- NOTIFICATION SYSTEM ---

function showNotification(message) {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 11000;";
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = 'glass-panel';
    notification.style.cssText = `
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid #22c55e;
    `;
    notification.innerHTML = `
        <i class="fa-solid fa-check-circle" style="color: #22c55e;"></i>
        <span style="font-weight: 500; color: #1e293b;">${message}</span>
`;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        notification.style.transition = 'all 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- VIEW SWITCHING (Legacy Support) ---

// --- VIEW SWITCHING (Legacy Support + Dynamic Rendering) ---

function switchView(viewName) {
    state.view = viewName;

    // Handle Cart
    if (viewName === 'cart') {
        toggleCart();
        return;
    }

    // Handle Dynamic Rendering (products.html)
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        if (viewName === 'retail' || viewName === 'wholesale') {
            renderCatalog(viewName);
            // Update active state in nav if exists
            return;
        }
    }

    // Handle Static Page Navigation (index.html)
    if (window.showPage) {
        try {
            window.showPage(viewName);
        } catch (e) {
            console.log('showPage not available or failed', e);
        }
    }
}

function renderCatalog(mode) {
    const container = document.getElementById('app-container');
    if (!container) return;

    const title = mode === 'wholesale' ? 'Catálogo Mayorista' : 'Catálogo al Detal';
    const isWholesale = mode === 'wholesale';

    container.innerHTML = `
        <div class="cart-container">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 2rem; color: #1e293b;">${title}</h2>
            
            <div class="product-grid">
                ${products.map(product => {
        // Default to first option for display
        const defaultOpt = product.options[0];
        const displayPrice = defaultOpt.price; // Logic for wholesale calculation could go here

        return `
                    <div class="product-card glass-panel" style="border-radius: 12px; background: white; overflow: hidden;">
                        <div class="product-image-container">
                            <span class="product-category-badge">${product.category}</span>
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            
                            <div class="product-options">
                                <span class="options-label">Presentación:</span>
                                <select id="select-${product.id}" onchange="updateCardPrice('${product.id}')" 
                                    style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                                    ${product.options.map((opt, idx) => `
                                        <option value="${idx}" data-price="${opt.price}">${opt.label}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="product-footer">
                                <div>
                                    <span class="options-label">Precio:</span>
                                    <div class="product-price" id="price-display-${product.id}">$${displayPrice.toFixed(2)}</div>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    ${product.link ? `<a href="${product.link}" class="product-action-btn wholesale-btn" style="text-decoration:none;"><i class="fa-solid fa-eye"></i></a>` : ''}
                                    <button onclick="addToCartDynamic('${product.id}')" class="product-action-btn retail-btn">
                                        <i class="fa-solid fa-cart-plus"></i> Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

// Helper for dynamic card updates
window.updateCardPrice = function (productId) {
    const select = document.getElementById(`select-${productId}`);
    const priceDisplay = document.getElementById(`price-display-${productId}`);
    if (select && priceDisplay) {
        const price = parseFloat(select.options[select.selectedIndex].getAttribute('data-price'));
        priceDisplay.textContent = `$${price.toFixed(2)}`;
    }
};

window.addToCartDynamic = function (productId) {
    const product = products.find(p => p.id === productId);
    const select = document.getElementById(`select-${productId}`);
    if (product && select) {
        const optionIndex = select.value;
        const option = product.options[optionIndex];
        addToCart(product, option, 1);
    }
};

// Auto-render default view on load if container exists
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        switchView('retail');
    }
});

// --- HELPER FOR STATIC PAGES ---
// Call this if you are on a static page (like interiores.html) to init the cart badge
function initStaticPage() {
    updateCartBadge();
    createCartDrawer();
}

// --- INITIALIZATION ---

function init() {
    updateCartBadge();
    createCartDrawer();

    // Expose toggleCart globally
    window.toggleCart = toggleCart;
    window.addToCart = addToCart; // Ensure global access
}

// Wait for DOM to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
