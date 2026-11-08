// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartUI();
    updateAuthUI();
});

// ================= MENU MOBILE =================
const navMenu = document.getElementById("nav-menu");
const menuIcon = document.getElementById("menu-icon");

function toggleMenu() {
    navMenu.classList.toggle("active");
    if (navMenu.classList.contains("active")) {
        menuIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    }
}

document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuIcon.classList.replace("fa-xmark", "fa-bars");
    });
});

// ================= THEME (DARK/LIGHT) =================
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");

function initTheme() {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        localStorage.setItem("theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});

// ================= TOAST NOTIFICATIONS =================
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ================= MODAL MANAGEMENT =================
function openModal(id) {
    document.getElementById(id).classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
    document.body.style.overflow = "auto";
}

// Fermer les modales en cliquant à l'extérieur
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = "auto";
    }
}

// ================= CART LOGIC =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(btn) {
    const card = btn.closest(".featured");
    const id = card.dataset.id;
    const title = card.dataset.title;
    const author = card.dataset.author;
    const price = parseFloat(card.dataset.price);
    const img = card.dataset.img;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, title, author, price, img, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${title}" added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartDisplay = document.getElementById("cart-display");

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center; color:var(--text-muted);'>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            count += item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="qty-controls">
                        <button onclick="changeQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartDisplay.textContent = `Cart($${total.toFixed(0)})`;
}

function openCartModal() {
    openModal("cart-modal");
}

function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    showToast("Order placed successfully! Thank you.");
    cart = [];
    saveCart();
    updateCartUI();
    closeModal("cart-modal");
}

// ================= AUTH LOGIC =================
let currentUser = JSON.parse(localStorage.getItem("user")) || null;

function openAuthModal() {
    openModal("auth-modal");
    if (currentUser) {
        switchAuthTab('logged');
    } else {
        switchAuthTab('login');
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else if (tab === 'register') {
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
        document.getElementById('register-form').classList.add('active');
    } else if (tab === 'logged') {
        document.querySelector('.auth-tabs').style.display = 'none';
        document.getElementById('logged-in-view').classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    // Simulation de login
    currentUser = { name: email.split("@")[0], email: email };
    localStorage.setItem("user", JSON.stringify(currentUser));
    updateAuthUI();
    closeModal("auth-modal");
    showToast("Logged in successfully!");
    e.target.reset();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    // Simulation d'inscription
    currentUser = { name, email };
    localStorage.setItem("user", JSON.stringify(currentUser));
    updateAuthUI();
    closeModal("auth-modal");
    showToast("Account created successfully!");
    e.target.reset();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem("user");
    updateAuthUI();
    closeModal("auth-modal");
    showToast("Logged out.");
    document.querySelector('.auth-tabs').style.display = 'flex';
}

function updateAuthUI() {
    const userDisplay = document.getElementById("user-display");
    if (currentUser) {
        userDisplay.textContent = currentUser.name;
        document.getElementById("profile-name").textContent = `Hello, ${currentUser.name} (${currentUser.email})`;
    } else {
        userDisplay.textContent = "Account";
    }
}

// ================= READ ME LOGIC =================
function openReadModal(element) {
    // Si on clique depuis la section "Best Selling", on adapte les données
    let title, author, img;
    
    if (element.classList.contains('best-selling')) {
        title = element.querySelector('h3').textContent;
        author = element.querySelector('.author').textContent.replace('By ', '');
        img = element.querySelector('.best-book img').src;
    } else {
        const card = element.closest('.featured');
        title = card.dataset.title;
        author = card.dataset.author;
        img = card.dataset.img;
    }

    document.getElementById('read-title').textContent = title;
    document.getElementById('read-author').textContent = `By ${author}`;
    document.getElementById('read-img').src = img;

    openModal('read-modal');
}

// ================= NEWSLETTER =================
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    showToast(`Subscribed with ${email}!`);
    this.reset();
});