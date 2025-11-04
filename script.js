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


/* Mobile Nav Toggle */
(function mobileNav() {
    const navToggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links-container');

    if (navToggleBtn && navLinks) {
        navToggleBtn.addEventListener('click', () => {
            // Thêm/xóa class 'show' để hiện/ẩn menu
            navLinks.classList.toggle('show');

            // Đổi icon hamburger (3 gạch) thành icon "X" khi mở
            const icon = navToggleBtn.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
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


/* Ip check tool*/
(function ipCheck() {
    const ipCard = document.getElementById('ip-info-card');

    if (!ipCard) {
        return;
    }

    async function getIpInfo() {
        try {
            // Use ipinfo.io as it provides IP, ISP, City, etc., all in one call
            const response = await fetch('https://ipinfo.io/json');
            
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            
            const data = await response.json();

            // Create the HTML content to display
            const htmlContent = `
                <ul class="ip-details-list">
                    <li>
                        <strong><i class="fa-solid fa-location-dot"></i> IP Address:</strong> 
                        <span>${data.ip || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-server"></i> ISP (Provider):</strong> 
                        <span>${data.org || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-city"></i> City:</strong> 
                        <span>${data.city || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-map"></i> Region:</strong> 
                        <span>${data.region || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-globe"></i> Country:</strong> 
                        <span>${data.country || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-compass"></i> Location (Latitude/Longitude):</strong> 
                        <span>${data.loc || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-truck-fast"></i> Hostname:</strong> 
                        <span>${data.hostname || 'N/A'}</span>
                    </li>
                </ul>
            `;

            // Inject the HTML into the card
            ipCard.innerHTML = htmlContent;

        } catch (error) {
            // Handle any errors during the fetch
            console.error('Error fetching IP info:', error);
            ipCard.innerHTML = '<p style="text-align: center; color: #FF6B6B;">Sorry, could not fetch IP information. Please try again later.</p>';
        }
    }

    // Call the function immediately on page load
    getIpInfo();

})();