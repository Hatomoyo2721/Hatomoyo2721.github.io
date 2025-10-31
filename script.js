/* Smooth scroll & scrollspy & reveal on scroll */
(function ui() {
    if (!document.getElementById('home')) return;

    // reveal on scroll (IntersectionObserver)
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('show');
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* Dark/Light mode toggle */
(function themeToggle() {
    const root = document.documentElement;
    const btn = document.getElementById("theme-toggle");
    const icon = btn.querySelector("i");

    // Load saved mode
    const saved = localStorage.getItem("theme");
    if (saved) root.className = saved;
    else root.classList.add("dark");

    // Set correct icon
    function updateIcon() {
        if (root.classList.contains("dark")) {
            icon.className = "fa-solid fa-moon";
        } else {
            icon.className = "fa-solid fa-sun";
        }
    }
    updateIcon();

    btn.addEventListener("click", () => {
        root.classList.toggle("dark");
        root.classList.toggle("light");
        localStorage.setItem("theme", root.className);
        updateIcon();
    });
})();


/* Navbar Active State (Multi-page) */
(function multiPageNav() {
    
    function updateActiveState() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        const currentFile = path.split('/').pop();

        document.querySelectorAll('.nav-links-container .nav-link, .nav-links-container .dropdown-menu a').forEach(link => {
            link.classList.remove('active');
        });

        if (currentFile === '' || currentFile === 'index.html' || !currentFile) {
            const homeLink = document.querySelector('.nav-link[href="/"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
            return;
        }

        const activeLink = document.querySelector(`.nav-link[href$="${currentFile + hash}"], .dropdown-menu a[href$="${currentFile + hash}"]`);

        if (activeLink) {
            activeLink.classList.add('active');

            const parentDropdown = activeLink.closest('.nav-item.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', updateActiveState);
    window.addEventListener('hashchange', updateActiveState);

})();
