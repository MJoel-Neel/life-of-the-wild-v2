// --- GESTION DU MENU MOBILE ---
const navMenu = document.getElementById("nav-menu");
const menuIcon = document.getElementById("menu-icon");

function toggleMenu() {
    navMenu.classList.toggle("active");
    // Change l'icône burger en croix
    if (navMenu.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
    } else {
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
    }
}

// Fermer le menu au clic sur un lien
document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
    });
});

// --- GESTION DU MODE SOMBRE / CLAIR ---
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");
const body = document.body;

// Vérifier le thème sauvegardé
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        localStorage.setItem("theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});