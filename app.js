const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const header = document.querySelector("[data-header]");

if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];

const setActiveLink = () => {
    const headerOffset = header ? header.offsetHeight + 48 : 120;
    const visibleSections = sections.filter((section) => section.getBoundingClientRect().top <= headerOffset);
    const current = visibleSections[visibleSections.length - 1];

    navLinks.forEach((link) => {
        const isActive = current && link.getAttribute("href") === `#${current.id}`;
        link.classList.toggle("active", Boolean(isActive));
    });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });

document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
        const email = button.getAttribute("data-email") || "";
        const originalText = button.textContent;

        try {
            await navigator.clipboard.writeText(email);
            button.textContent = "E-mail copiado";
        } catch (error) {
            window.location.href = `mailto:${email}`;
            button.textContent = "Abrindo e-mail";
        }

        window.setTimeout(() => {
            button.textContent = originalText;
        }, 2200);
    });
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
            // O portfólio continua funcionando mesmo sem cache offline.
        });
    });
}
