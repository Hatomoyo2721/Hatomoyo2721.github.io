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
    onScroll();

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
