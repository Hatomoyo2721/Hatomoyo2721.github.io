/* Sanitize function to prevent XSS */
function sanitize(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

    // --- GLOBAL ISP LOOKUP TABLE ---
    // Note: Only popular ISPs will have their website displayed.
    // The values are now plain domains (no https://)
    const ispWebsiteMap = {
        // Vietnam
        'VIETTEL': 'viettel.com.vn',
        'FPT': 'fpt.vn',
        'VNPT': 'vnpt.com.vn',
        'MOBIFONE': 'mobifone.vn',

        // US
        'COMCAST': 'xfinity.com',
        'AT&T': 'att.com',
        'VERIZON': 'verizon.com',
        'SPECTRUM': 'spectrum.com', // (Charter)
        'CHARTER': 'spectrum.com',
        'T-MOBILE': 't-mobile.com',

        // Europe
        'VODAFONE': 'vodafone.com',
        'ORANGE': 'orange.com',
        'DEUTSCHE TELEKOM': 'telekom.de',
        'BT': 'bt.com', // (British Telecom)
        'TELEFONICA': 'telefonica.com',

        // Asia
        'NTT': 'global.ntt', // (Japan)
        'KDDI': 'kddi.com', // (Japan)
        'CHINA TELECOM': 'chinatelecom-h.com',
        'KT': 'kt.com', // (South Korea)

        // Australia
        'TELSTRA': 'telstra.com.au',

        // Cloud / Services
        'GOOGLE': 'google.com',
        'AMAZON': 'aws.amazon.com',
        'MICROSOFT': 'azure.microsoft.com',
        'CLOUDFLARE': 'cloudflare.com'
    };

    // This function finds the website domain from the ISP name
    function findIspWebsite(ispName) {
        if (!ispName) {
            return null;
        }
        const upperIspName = ispName.toUpperCase();
        for (const key in ispWebsiteMap) {
            if (upperIspName.includes(key)) {
                return ispWebsiteMap[key]; // Returns 'viettel.com.vn'
            }
        }
        return null; // No match found
    }

    async function getIpInfo() {
        try {
            // Use ipinfo.io as it provides IP, ISP, City, etc., all in one call
            const response = await fetch('https://ipinfo.io/json');

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }

            const data = await response.json();

            // Get the ISP name and find the website
            const ispName = data.org || 'N/A';
            const ispWebsite = findIspWebsite(ispName); // Uses the function defined above

            // Create HTML content
            const htmlContent = `
                <ul class="ip-details-list">
                    <li>
                        <strong><i class="fa-solid fa-location-dot"></i> IP Address:</strong> 
                        <span>${data.ip || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-server"></i> ISP:</strong> 
                        <span>${ispName}</span>
                    </li>

                    ${ispWebsite ? `
                    <li>
                        <strong><i class="fa-solid fa-link"></i> ISP Website:</strong> 
                        
                        <span>${ispWebsite}</span>
                        
                        <span class="tooltip">
                            <i class="fa-solid fa-circle-info"></i>
                            <span class="tooltip-text">Only popular ISPs will have their website displayed.</span>
                        </span>
                    </li>` : ''} 
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
                        <strong><i class="fa-solid fa-compass"></i> Location (Lat/Lon):</strong> 
                        <span>${data.loc || 'N/A'}</span>
                    </li>
                    <li>
                        <strong><i class="fa-solid fa-truck-fast"></i> Hostname:</strong> 
                        <span>${data.hostname || 'N/A'}</span>
                    </li>
                </ul>
            `;

            // Inject HTML into the card
            ipCard.innerHTML = htmlContent;

        } catch (error) {
            // Handle errors
            console.error('Error fetching IP info:', error);
            ipCard.innerHTML = '<p style="text-align: center; color: #FF6B6B;">Sorry, could not fetch IP information. Please try again later.</p>';
        }
    }

    // Call the function immediately on page load
    getIpInfo();

})();


/* Website latency check */
(function pingCheck() {
    const card = document.getElementById('ping-check-card');
    if (!card) return;

    const urlInput = document.getElementById('ping-url');
    const pingButton = document.getElementById('ping-button');
    const resultsDiv = document.getElementById('ping-results');

    async function checkLatency() {
        let url = urlInput.value.trim();
        if (!url) {
            resultsDiv.innerHTML = `<span class="error">Please enter a domain.</span>`;
            return;
        }

        // Sanitize input
        const safeUrl = sanitize(urlInput.value.trim());

        // Add https:// if user just types 'google.com'
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Disable button, show loading
        pingButton.disabled = true;
        pingButton.textContent = 'Checking...';

        // Sanitize for display
        resultsDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Pinging ${safeUrl}...`;

        try {
            const startTime = performance.now();
            await fetch(url, { mode: 'no-cors', cache: 'no-cache' });
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            // safeUrl is already sanitized
            resultsDiv.innerHTML = `Response from <strong>${safeUrl}</strong>: <span class="success">${latency} ms</span>`;

        } catch (error) {
            console.error('Ping error:', error);
            resultsDiv.innerHTML = `<span class="error">Could not reach ${safeUrl} or website doesn't exist.</span>`;
        } finally {
            // Re-enable button
            pingButton.disabled = false;
            pingButton.textContent = 'Check';
        }
    }

    // Run check on button click
    pingButton.addEventListener('click', checkLatency);

    // Also allow pressing 'Enter' in the input box
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkLatency();
        }
    });

})();
