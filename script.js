/* -----------------------
   typing effect (accessible)
   ----------------------- */
(function typing() {
    const typingEl = document.getElementById('typing');
    // Updated text for the typing effect
    const text = "Thanh Sơn — Cybersecurity";
    let k = 0;
    if (!typingEl) return;
    typingEl.textContent = '';
    function step() {
        typingEl.textContent = text.slice(0, k++);
        if (k <= text.length) setTimeout(step, 80);
    }
    step();
})();

/* -----------------------
   matrix background
   ----------------------- */
(function matrix() {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    let drops = new Array(columns).fill(1);
    const chars = "01#@$%&*{}[]<>/\\";

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        const cols = Math.floor(w / fontSize);
        drops = new Array(cols).fill(1);
    }
    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = "rgba(8,27,46,0.08)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(16,231,244,0.28)";
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    // Use requestAnimationFrame for smoother animation
    let animationFrameId;
    function animate() {
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
})();

/* -----------------------
   smooth scroll & scrollspy & reveal
   ----------------------- */
(function ui() {
    const links = document.querySelectorAll('a[href^="#"][data-link]');
    const sections = Array.from(links).map(a => {
        const href = a.getAttribute('href');
        return href ? document.querySelector(href) : null;
    }).filter(Boolean); // Filter out nulls if a link's target doesn't exist

    // smooth scroll
    links.forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // scrollspy
    function onScroll() {
        const scrollY = window.scrollY;
        
        // Offset to activate link a bit before the section hits the top
        const offset = scrollY + window.innerHeight * 0.4;
        
        sections.forEach((sec, idx) => {
            const link = links[idx];
            if (!sec || !link) return;
            
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            
            if (offset >= top && offset < bottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check

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

/* -----------------------
   project card cursor glow (optional, can be removed if not desired)
   ----------------------- */
(function cardGlow() {
    document.querySelectorAll('.project').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
        });
    });
})();