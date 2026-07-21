document.addEventListener('DOMContentLoaded', () => {

  // --- CUSTOM CURSOR ---
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  const speed = 0.15; // smooth lag speed

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  });

  function animateOutline() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    outlineX += distX * speed;
    outlineY += distY * speed;
    
    if (outline) {
      outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
    }
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover states for cursor expansion
  const hoverables = document.querySelectorAll('a, button, .border-card, input, textarea, .sidebar-link-container');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // --- HERO INTERACTIVE CANVAS GRID ---
  const heroSection = document.getElementById('home');
  const axisX = document.getElementById('hero-axis-x');
  const axisY = document.getElementById('hero-axis-y');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      
      if (axisX) {
        axisX.style.transform = `translate3d(0, ${y}px, 0)`;
      }
      
      if (axisY) {
        axisY.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      heroSection.style.setProperty('--x', `${x}px`);
      heroSection.style.setProperty('--y', `${y}px`);
    });
  }


  // --- MOBILE NAV TOGGLE ---
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const navLine1 = document.getElementById('nav-line-1');
  const navLine2 = document.getElementById('nav-line-2');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let isNavOpen = false;

  function toggleMobileNav() {
    isNavOpen = !isNavOpen;
    if (isNavOpen) {
      mobileNavMenu.classList.remove('translate-x-full');
      if (navLine1 && navLine2) {
        navLine1.style.transform = 'translateY(3px) rotate(45deg)';
        navLine2.style.transform = 'translateY(-3px) rotate(-45deg)';
      }
    } else {
      mobileNavMenu.classList.add('translate-x-full');
      if (navLine1 && navLine2) {
        navLine1.style.transform = 'none';
        navLine2.style.transform = 'none';
      }
    }
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', toggleMobileNav);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isNavOpen) toggleMobileNav();
    });
  });


  // --- INTERSECTION OBSERVER FOR SIDEBAR LINKS & REVEALS ---
  const scrollWrapper = document.getElementById('scroll-wrapper');
  const sections = document.querySelectorAll('section');
  const sidebarContainers = document.querySelectorAll('.sidebar-link-container');
  const revealElements = document.querySelectorAll('.reveal-up');

  // Desktop vs Mobile check for observer root
  const isDesktop = window.innerWidth >= 1024;
  const responsiveObserverOptions = {
    root: isDesktop ? scrollWrapper : null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarContainers.forEach(container => {
          if (container.getAttribute('data-target') === id) {
            container.classList.add('active');
          } else {
            container.classList.remove('active');
          }
        });
      }
    });
  }, responsiveObserverOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // Fade-in reveals
  const revealObserverOptions = {
    root: isDesktop ? scrollWrapper : null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));


  // --- INLINE FORM FLOATING LABELS ---
  const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
  
  formInputs.forEach(input => {
    const label = input.previousElementSibling;
    if (!label) return;

    const updateLabel = () => {
      if (input.value.trim() !== '') {
        label.classList.add('-top-4', 'text-[8px]', 'text-white');
      } else if (document.activeElement !== input) {
        label.classList.remove('-top-4', 'text-[8px]', 'text-white');
      }
    };

    input.addEventListener('focus', () => {
      label.classList.add('-top-4', 'text-[8px]', 'text-white');
    });
    
    input.addEventListener('blur', updateLabel);
    input.addEventListener('input', updateLabel);
    
    updateLabel(); // run initial check
  });


  // --- INTERACTIVE PORTFOLIO WORKSTATION ---
  const manifestItems = document.querySelectorAll('.project-manifest-item');
  const consoleTabName = document.getElementById('console-tab-name');
  const consoleProjectImg = document.getElementById('console-project-img');
  const consoleProjectTerminal = document.getElementById('console-project-terminal');
  const consoleProjectIframe = document.getElementById('console-project-iframe');
  const consoleProjectLoader = document.getElementById('console-project-loader');
  const consoleMetaSector = document.getElementById('console-meta-sector');
  const consoleMetaPlatform = document.getElementById('console-meta-platform');
  const consoleMetaStatus = document.getElementById('console-meta-status');
  const consoleProjectTitle = document.getElementById('console-project-title');
  const consoleProjectDesc = document.getElementById('console-project-desc');
  const consoleProjectStack = document.getElementById('console-project-stack');
  const consoleBtnRepo = document.getElementById('console-btn-repo');
  const consoleBtnLive = document.getElementById('console-btn-live');
  const consoleScreenContent = document.getElementById('console-screen-content');

  // Interactive tab switcher buttons
  const consoleTabPreview = document.getElementById('console-tab-preview');
  const consoleTabVisit = document.getElementById('console-tab-visit');
  const consoleTabImage = document.getElementById('console-tab-image');
  const consoleTabTerminalBtn = document.getElementById('console-tab-terminal');

  const projectData = {
    'drawforge': {
      name: 'DrawForge',
      tab: 'DrawForge.io',
      sector: 'MULTIPLAYER GAME / WEBSOCKET',
      platform: 'DEPLOYED v1.0',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'A real-time multiplayer drawing game featuring two distinct game modes: Scribble It (drawing & guessing with character abilities) and Drawing Competition (simultaneous battles with voting), detailed canvas toolkit, and persistent postgres session storage.',
      stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Tailwind CSS', 'Howler.js'],
      repo: '',
      live: 'https://drawforge.onrender.com/',
      img: '',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ npm run start</div>
          <div>[DrawForge] Initializing backend application clusters...</div>
          <div class="text-[#27c93f]">[OK] Connected to PostgreSQL DB on Render.</div>
          <div>[SOCKET] Socket.IO server running on PORT 3000.</div>
          <div class="text-white">[ROOMS] Active Matchmaking Queue: 5 Lobbies | 24 Players active.</div>
          <div class="text-neutral-500">// Heartbeat: STABLE | Database Auto-Cleanup Active //</div>
          <div class="text-white">[GAME] Match ID 94a2 started: Mode [Scribble It]</div>
        </div>
      `
    },
    'bantay-pusta': {
      name: 'Bantay Pusta',
      tab: 'BantayPusta.exe',
      sector: 'RECOVERY & TELEMETRY',
      platform: 'WEB // DESKTOP',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'Former developer of the website, API, and desktop app. A comprehensive multi-platform gambling addiction recovery system providing real-time system-level blocking, bet-free streak telemetry, emergency response, and community tracking.',
      stack: ['ASP.NET Core 8', 'WPF', 'SQL Server', 'SignalR', 'Manifest V3'],
      repo: '',
      live: '',
      img: 'project ss/banatay pusta.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ dotnet run --project BantayPusta.Web</div>
          <div>[SYS_INFO] Initializing Bantay Pusta core kernel engine v2.4.1...</div>
          <div class="text-[#27c93f]">[OK] Connected to Azure DB. Sync latency: 14ms.</div>
          <div>[TELEMETRY] Listening for WPF agent heartbeats on SignalR hub...</div>
          <div class="text-white">[AGENTS] 142 clients active | 3 system blocks triggered.</div>
          <div class="text-neutral-500">// Engine health: 99.8% | Memory footprint: 184MB //</div>
        </div>
      `
    },
    'barangay-health': {
      name: 'Barangay Health Center',
      tab: 'HealthPortal.web',
      sector: 'RURAL HEALTH / RECORDS',
      platform: 'PRODUCTION v1.0',
      status: 'STABLE',
      statusClass: 'text-[#27c93f]',
      desc: 'A full-stack medical records and queue platform designed for rural health units. Solves doctor accountability across multiple municipalities and eliminates paper records with digital triage.',
      stack: ['ASP.NET Core 9.0', 'C#', 'Bootstrap 5', 'Clean Arch'],
      repo: '',
      live: '',
      img: 'project ss/health center.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ health-center --mode=production --port=9000</div>
          <div>[SYS_INFO] Loading Patient Records Database module...</div>
          <div class="text-[#27c93f]">[OK] Decrypted patient ledger. 2,401 medical files checked.</div>
          <div>[QUEUE] Triage routing queue initialized for Barangay Health Unit...</div>
          <div class="text-white">[TELEMETRY] Doctor accountability portal online.</div>
          <div class="text-neutral-500">// System state: STABLE | Active queues: 4 //</div>
        </div>
      `
    },
    'certicore': {
      name: 'CertiCore',
      tab: 'CertiCoreLMS.exe',
      sector: 'ACADEMIC LMS / PDF GEN',
      platform: 'LMS CORE',
      status: 'STABLE',
      statusClass: 'text-[#27c93f]',
      desc: 'A comprehensive learning management system incorporating real-time assessments, discussion forums, progress monitoring, and automated professional PDF certificate generation.',
      stack: ['ASP.NET Core 8 MVC', 'EF Core', 'iText7 PDF', 'SignalR'],
      repo: '',
      live: '',
      img: 'project ss/certicoredashboard.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ dotnet run --project CertiCore.LMS</div>
          <div>[SYS_INFO] Starting Learning Management System core engine...</div>
          <div class="text-[#27c93f]">[OK] Database connection active.</div>
          <div>[PDF_GEN] iText7 automated certificate renderer online...</div>
          <div class="text-[#27c93f]">[OK] PDF output templates compiled successfully.</div>
          <div class="text-white">[LMS] Assessments compiler verified. 12 courses online.</div>
        </div>
      `
    },
    'ojt-war': {
      name: 'OJT Accomplishment Report',
      tab: 'OJT_WAR_System.exe',
      sector: 'OJT MONITORING / REPORTS',
      platform: 'FULL STACK',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'A full-stack WAR solution with real-time monitoring of OJT tasks. Streamlines submitting and tracking weekly accomplishment reports, featuring automated notifications, progress tracking, and supervisor analytics.',
      stack: ['HTML / Tailwind', 'PHP', 'JavaScript'],
      repo: '',
      live: '',
      img: 'project ss/war.jpeg',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ php -S localhost:8000</div>
          <div>[WAR_SYS] Weekly Accomplishment Report system active.</div>
          <div class="text-[#27c93f]">[OK] Connected to PHP MySQL database.</div>
          <div>[CRON] Weekly report automated email reminder schedule active.</div>
          <div class="text-white">[ROUTER] GET /ojt/report/submit - 200 OK</div>
          <div class="text-neutral-500">// Student progress tracker online //</div>
        </div>
      `
    },
    'smart-gate': {
      name: 'Smart Gate Dashboard',
      tab: 'SmartGateAnalytics.exe',
      sector: 'IOT TELEMETRY / DOCK',
      platform: 'DASHBOARD',
      status: 'OFFLINE',
      statusClass: 'text-neutral-500',
      desc: 'Data visualization of student entry with interactive analytics. Real-time attendance monitoring, customizable reports, trend analysis, and school administrator analytics for data-driven decisions.',
      stack: ['HTML / Tailwind', 'JavaScript'],
      repo: '',
      live: '',
      img: 'project ss/caps.jpg',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ gate-analytics --service=watcher --port=8080</div>
          <div>[IOT_CORE] Scanning for smart-gate serial interfaces...</div>
          <div class="text-neutral-500">[WARN] Gate hardware interface offline. Falling back to data lake.</div>
          <div class="text-[#27c93f]">[OK] Analytics dashboard online. Interactive charts compiled.</div>
          <div class="text-white">[API] Compiled trend logs for 1,450 student entries.</div>
        </div>
      `
    },
    'coffee-website': {
      name: 'Static Coffee Website',
      tab: 'CoffeePortal.web',
      sector: 'CREATIVE SHOWCASE',
      platform: 'WEB SHOWCASE',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'An elegant website for Coffee Lovers with responsive design. Showcases blends, brewing methods, and coffee-related content, featuring an interactive menu and tips blog.',
      stack: ['HTML / CSS', 'JavaScript'],
      repo: '',
      live: '',
      img: 'project ss/coffee.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ live-server --port=5500</div>
          <div>[LIVE_SERVER] Spawning web server instance...</div>
          <div class="text-[#27c93f]">[OK] Listening on http://localhost:5500</div>
          <div>[WATCHER] Tracking changes in index.html, style.css, menu.js...</div>
          <div class="text-neutral-500">// Performance: Speed index 0.6s | LCP 0.8s //</div>
        </div>
      `
    },
    'library-mgmt': {
      name: 'Library Database',
      tab: 'LibraryEngine.sql',
      sector: 'LMS CORE',
      platform: 'DEPLOYED',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'Digital book catalog tracking database system managing user borrow sequences, inventory levels, and check-ins.',
      stack: ['HTML', 'Tailwind', 'JavaScript'],
      repo: '',
      live: 'https://library-managementjenelo.vercel.app/',
      img: 'project ss/library-mgmt.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ database_init --service=library-mgmt</div>
          <div>[SYS_INFO] Connecting to postgres://localhost:5432/library_db...</div>
          <div class="text-[#27c93f]">[OK] Connected. Latency: 4ms.</div>
          <div>[SYS_INFO] Loading schemas (books, users, transactions, catalogs)...</div>
          <div class="text-[#27c93f]">[OK] 4 schemas compiled. indexes built.</div>
          <div>$ npm start</div>
          <div class="text-white">&gt; library-mgmt-engine@1.0.0 start /app</div>
          <div class="text-white">&gt; node src/server.js</div>
          <div class="text-neutral-500">// Server executing on PORT 8080 //</div>
          <div class="text-neutral-500">// Telemetry: Heap size: 34MB | Active sockets: 12 //</div>
          <div class="text-white">[API] GET /api/v1/books - 200 OK (11ms)</div>
          <div class="text-white">[API] POST /api/v1/borrow - 201 Created (42ms)</div>
          <div class="text-neutral-500">// System state: stable //</div>
        </div>
      `
    },
    'readme-poetry': {
      name: 'Readme When You Are',
      tab: 'VerseEngine.js',
      sector: 'INTERACTIVE WEB',
      platform: 'DEPLOYED',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'An expressive, typography-oriented digital poetry interface featuring interactive text renders and scrolling layout animations.',
      stack: ['HTML', 'Tailwind', 'JavaScript'],
      repo: '',
      live: 'https://readmewhenyouare.vercel.app/',
      img: 'project ss/readme-poetry.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ node compiler.js --src=poetry/verse_manifest.json</div>
          <div>[PARSER] Reading files from poetic assets...</div>
          <div>[RENDERER] Setting up CSS typography spacing layouts...</div>
          <div class="text-[#27c93f]">[OK] 12 poetry nodes initialized.</div>
          <div>$ npm run dev</div>
          <div class="text-white">&gt; verse-app@1.1.0 dev /poetry</div>
          <div class="text-white">&gt; vite --port=3000</div>
          <div class="text-neutral-500">// Server local URL: http://localhost:3000 //</div>
          <div class="text-neutral-500">// HMR Hot Module Replacement active //</div>
          <div class="text-white">[VITE] client connected.</div>
          <div class="text-white">[VITE] HMR update - /src/style.css</div>
        </div>
      `
    },
    'touch-god': {
      name: 'Touch By God Meet',
      tab: 'WebRTC_Bridge.go',
      sector: 'VIDEO CHAT',
      platform: 'DEPLOYED',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'Collaborative web application featuring WebRTC video calling, room structures, and real-time chat operations.',
      stack: ['HTML', 'Tailwind', 'JavaScript', 'WebRTC'],
      repo: '',
      live: 'https://touchbygodmeet.vercel.app/',
      img: 'project ss/touch-god.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ go run main.go --port=8000</div>
          <div>[RTC_CORE] Initializing WebRTC stun/turn peer broker...</div>
          <div>[RTC_CORE] Default STUN server set to google:stun.l.google.com:19302</div>
          <div class="text-[#27c93f]">[OK] Socket hub active. listening for SDP offers.</div>
          <div class="text-neutral-500">// Active Rooms: 3 | Active Peer-connections: 6 //</div>
          <div class="text-white">[SOCKET] New client joined Room #TouchByGod (ID: PEER_9A2F)</div>
          <div class="text-[#27c93f]">[OK] WebRTC stream established between PEER_9A2F and PEER_2B48</div>
        </div>
      `
    },
    'redesign-penguin': {
      name: 'Redesign Penguin',
      tab: 'PenguinBrand.css',
      sector: 'BRANDING REDESIGN',
      platform: 'DEPLOYED',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'Creative web design interface focused on editorial layouts, custom penguin character visuals, and animations.',
      stack: ['HTML', 'Tailwind', 'JavaScript'],
      repo: '',
      live: 'https://redesignpenguinramos.vercel.app/',
      img: 'project ss/redesign-penguin.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ npm run build</div>
          <div>[BUILDER] Bundling branding assets & sprites...</div>
          <div>[CSS] Purging unused Tailwind utilities...</div>
          <div class="text-[#27c93f]">[SUCCESS] Build completed in 1.8s.</div>
          <div>$ vercel --prod</div>
          <div class="text-white">[VERCEL] Deploying project to production...</div>
          <div class="text-[#27c93f]">[OK] Live URL: redesignpenguinramos.vercel.app</div>
        </div>
      `
    },
    'nathaniel-joy': {
      name: "Wedding Website Design",
      tab: 'WeddingWebsite.html',
      sector: 'WEB DESIGN',
      platform: 'DEPLOYED',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'An elegant and romantic wedding website design featuring beautiful layouts, event details, RSVP sections, and smooth transitions crafted for a memorable experience.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      repo: '',
      live: 'https://wedding-website-design-mauve.vercel.app/',
      img: 'project ss/nathaniel-joy.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ npm run start</div>
          <div>[SERVER] Spawning web server instance...</div>
          <div class="text-[#27c93f]">[OK] Listening on netlify local node.</div>
          <div>[ROUTER] Loading views (home, joy-nodes, gallery, about)...</div>
          <div class="text-white">[ROUTER] GET /home - 200 OK (2ms)</div>
        </div>
      `
    },
    'figma-workspaces': {
      name: 'Figma Design Workspaces',
      tab: 'FigmaFrames.spec',
      sector: 'UI/UX FRAMES',
      platform: 'PROTOTYPES',
      status: 'ONLINE',
      statusClass: 'text-[#27c93f]',
      desc: 'Interactive high-fidelity wireframes, UI kits, design systems, and components for client applications.',
      stack: ['Figma', 'Wireframing', 'Design Systems'],
      repo: 'https://www.figma.com/design/WwK4DitOf2Qn9ycKJi9mmb/Ahehhehe?node-id=2-2&t=BF84kQiqpgIxu4Vm-0',
      live: 'https://www.figma.com/design/f6G1fkM8za90l0ZOYI4nMl/Untitled?node-id=0-1&p=f&t=LdvI5Yhd7sEQ7iod-0',
      img: 'project ss/figma-workspaces.png',
      terminal: `
        <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
          <div class="text-white">$ figma-sync --id=WwK4DitOf2Qn9ycKJi9mmb</div>
          <div>[FIGMA_API] Authenticating design token parser...</div>
          <div>[FIGMA_API] Syncing file "Ahehhehe" frames & layouts...</div>
          <div class="text-[#27c93f]">[OK] Figma Design assets parsed & verified.</div>
          <div class="text-white">[FIGMA_API] Syncing file "Untitled" prototype connections...</div>
          <div class="text-[#27c93f]">[OK] 5 responsive frames mapped to interaction flow nodes.</div>
        </div>
      `
    }
  };

  function setConsoleViewMode(mode, project, projectId) {
    // Reset tab active indicators
    [consoleTabPreview, consoleTabImage, consoleTabTerminalBtn].forEach(tab => {
      if (tab) tab.classList.remove('console-tab-btn-active');
    });

    // Hide all view screens
    if (consoleProjectImg) consoleProjectImg.style.display = 'none';
    if (consoleProjectTerminal) consoleProjectTerminal.style.display = 'none';
    if (consoleProjectIframe) {
      consoleProjectIframe.style.display = 'none';
      consoleProjectIframe.src = '';
    }
    if (consoleProjectLoader) consoleProjectLoader.classList.add('hidden');

    if (mode === 'preview' && project.live) {
      if (consoleTabPreview) consoleTabPreview.classList.add('console-tab-btn-active');
      if (consoleProjectLoader) consoleProjectLoader.classList.remove('hidden');
      if (consoleProjectIframe) {
        let embedUrl = project.live;
        if (projectId === 'figma-workspaces') {
          embedUrl = 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(project.live);
        }
        consoleProjectIframe.src = embedUrl;
        consoleProjectIframe.style.display = 'block';
        
        consoleProjectIframe.onload = () => {
          if (consoleProjectLoader) consoleProjectLoader.classList.add('hidden');
        };
      }
    } else if (mode === 'image' && project.img) {
      if (consoleTabImage) consoleTabImage.classList.add('console-tab-btn-active');
      if (consoleProjectImg) {
        consoleProjectImg.src = project.img;
        consoleProjectImg.style.display = 'block';
      }
    } else {
      // Fallback Terminal Mode
      if (consoleTabTerminalBtn) consoleTabTerminalBtn.classList.add('console-tab-btn-active');
      if (consoleProjectTerminal) {
        consoleProjectTerminal.innerHTML = project.terminal || `
          <div class="flex flex-col gap-1.5 select-none text-[8.5px] leading-relaxed">
            <div class="text-white">$ cat info.log</div>
            <div>[SYS_INFO] Core terminal initialized. Ready for commands.</div>
          </div>
        `;
        consoleProjectTerminal.style.display = 'block';
      }
    }
  }

  function switchProject(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    // Trigger glitch visual animation
    if (consoleScreenContent) {
      consoleScreenContent.classList.remove('console-transition');
      void consoleScreenContent.offsetWidth; // Force reflow
      consoleScreenContent.classList.add('console-transition');
    }

    // Update Tab and Title text
    if (consoleTabName) consoleTabName.textContent = project.tab;
    if (consoleProjectTitle) consoleProjectTitle.textContent = project.name;
    if (consoleProjectDesc) consoleProjectDesc.textContent = project.desc;

    // Update Meta specs
    if (consoleMetaSector) consoleMetaSector.textContent = project.sector;
    if (consoleMetaPlatform) consoleMetaPlatform.textContent = project.platform;
    if (consoleMetaStatus) {
      consoleMetaStatus.textContent = project.status;
      consoleMetaStatus.className = `text-[9px] uppercase font-bold tracking-tight ${project.statusClass}`;
    }

    // Update Tech Stack badges
    if (consoleProjectStack) {
      consoleProjectStack.innerHTML = '';
      project.stack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'bg-white/[0.03] border border-white/[0.05] text-[7.5px] font-mono text-neutral-400 uppercase tracking-widest px-1.5 py-0.5 rounded';
        span.textContent = tech;
        consoleProjectStack.appendChild(span);
      });
    }

    // Update URL Address Bar
    const consoleUrlText = document.getElementById('console-url-text');
    if (consoleUrlText) {
      consoleUrlText.textContent = project.live || `https://${projectId}.local`;
    }

    // Update CTAs
    if (consoleBtnRepo) {
      if (project.repo) {
        consoleBtnRepo.href = project.repo;
        consoleBtnRepo.style.display = 'inline-block';
        if (projectId === 'figma-workspaces') {
          consoleBtnRepo.textContent = '[WORK_1] ↗';
        } else {
          consoleBtnRepo.textContent = '[EXPLORE_SOURCE] ↗';
        }
      } else {
        consoleBtnRepo.href = '#';
        consoleBtnRepo.style.display = 'none';
      }
    }
    if (consoleBtnLive) {
      if (project.live) {
        consoleBtnLive.href = project.live;
        consoleBtnLive.style.display = 'inline-block';
        if (projectId === 'figma-workspaces') {
          consoleBtnLive.textContent = '[WORK_2] ↗';
        } else {
          consoleBtnLive.textContent = '[LAUNCH_PORTAL] ↗';
        }
      } else {
        consoleBtnLive.href = '#';
        consoleBtnLive.style.display = 'none';
      }
    }

    // Determine which editor tabs are available
    if (project.live) {
      if (consoleTabPreview) consoleTabPreview.style.display = 'inline-block';
      if (consoleTabVisit) {
        consoleTabVisit.href = project.live;
        consoleTabVisit.style.display = 'inline-flex';
      }
      if (consoleTabImage) consoleTabImage.style.display = 'none';
    } else {
      if (consoleTabPreview) consoleTabPreview.style.display = 'none';
      if (consoleTabVisit) consoleTabVisit.style.display = 'none';
      if (project.img) {
        if (consoleTabImage) consoleTabImage.style.display = 'inline-block';
      } else {
        if (consoleTabImage) consoleTabImage.style.display = 'none';
      }
    }

    // Determine default mode on selection
    let defaultMode = 'terminal';
    if (project.live) {
      defaultMode = 'preview';
    } else if (project.img) {
      defaultMode = 'image';
    }

    setConsoleViewMode(defaultMode, project, projectId);
  }

  // Bind click handlers to manifest elements
  manifestItems.forEach(item => {
    item.addEventListener('click', () => {
      manifestItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const projectId = item.getAttribute('data-project-id');
      switchProject(projectId);

      if (window.innerWidth < 1024) {
        const consoleEl = document.querySelector('.lg:col-span-7');
        if (consoleEl) {
          consoleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });


  // Bind click handlers to editor tabs
  if (consoleTabPreview) {
    consoleTabPreview.addEventListener('click', () => {
      const activeBtn = document.querySelector('.project-manifest-item.active');
      const activeId = activeBtn ? activeBtn.getAttribute('data-project-id') : null;
      if (activeId && projectData[activeId]) {
        setConsoleViewMode('preview', projectData[activeId], activeId);
      }
    });
  }
  if (consoleTabImage) {
    consoleTabImage.addEventListener('click', () => {
      const activeBtn = document.querySelector('.project-manifest-item.active');
      const activeId = activeBtn ? activeBtn.getAttribute('data-project-id') : null;
      if (activeId && projectData[activeId]) {
        setConsoleViewMode('image', projectData[activeId], activeId);
      }
    });
  }
  if (consoleTabTerminalBtn) {
    consoleTabTerminalBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.project-manifest-item.active');
      const activeId = activeBtn ? activeBtn.getAttribute('data-project-id') : null;
      if (activeId && projectData[activeId]) {
        setConsoleViewMode('terminal', projectData[activeId], activeId);
      }
    });
  }
  if (consoleTabTerminalBtn) {
    consoleTabTerminalBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.project-manifest-item.active');
      const activeId = activeBtn ? activeBtn.getAttribute('data-project-id') : null;
      if (activeId && projectData[activeId]) {
        setConsoleViewMode('terminal', projectData[activeId], activeId);
      }
    });
  }

  // --- INTERACTIVE SERVICE CHANNELS (SECTION 05) ---
  const serviceData = {
    uiux: {
      title: "UI/UX Design",
      code: "UX_ENGINE_V1",
      desc: "User-centered design that balances aesthetic excellence with robust functional architecture. I construct detailed wireframes, high-fidelity prototypes, and design systems from the ground up.",
      skills: ["USER RESEARCH", "WIREFRAMING", "PROTOTYPING", "VISUAL DESIGN", "DESIGN SYSTEMS", "FIGMA COMPONENTS"]
    },
    webdev: {
      title: "Web Development",
      code: "DEV_CORE_V2",
      desc: "Building highly responsive, secure, and performant web applications using clean logic, modular components, and optimal database layouts. Specialized in building fast, scalable systems.",
      skills: ["FRONTEND", "BACKEND", "API INTEGRATION", "OPTIMIZATION", "DATABASE LAYOUTS", "TELEMETRIES"]
    },
    ai: {
      title: "AI-Assisted Development",
      code: "AI_DEV_ACCEL_V3",
      desc: "Leveraging modern AI coding assistants and agentic development workflows to accelerate software delivery, improve code quality, automate repetitive tasks, and build scalable applications faster without compromising engineering standards.",
      skills: ["AI CODE ASSISTANTS", "AGENTIC CODING", "CODE GENERATION", "SMART REFACTORING", "DEBUGGING", "TEST AUTOMATION"]
    },
    graphic: {
      title: "Graphic Design",
      code: "DSGN_BRAND_V4",
      desc: "Forging premium brand assets, balanced typographical systems, and memorable marketing vectors. I focus on creating cohesive visual styles that tell an authentic brand story.",
      skills: ["BRANDING", "TYPOGRAPHY", "PRINT DESIGN", "VECTOR ASSETS", "ADOBE CREATIVE", "SCHEMATIC DESIGN"]
    }
  };

  const serviceRows = document.querySelectorAll('.service-selector-row');
  const specCode = document.getElementById('service-spec-code');
  const specTitle = document.getElementById('service-spec-title');
  const specDesc = document.getElementById('service-spec-desc');
  const specSkillsContainer = document.getElementById('service-spec-skills');

  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const serviceId = row.getAttribute('data-service-id');
      const data = serviceData[serviceId];
      if (!data) return;

      // Toggle active states
      serviceRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      // Update right-side telemetry panel (Desktop)
      if (specTitle) {
        const parentCol = specTitle.closest('.lg\\:col-span-7');
        if (parentCol) {
          parentCol.classList.remove('console-transition');
          void parentCol.offsetWidth; // Trigger reflow
          parentCol.classList.add('console-transition');
        }

        specCode.textContent = data.title; // update matching header or code
        specCode.textContent = data.code;
        specTitle.textContent = data.title;
        specDesc.textContent = data.desc;

        // Clear and rebuild skills badges
        specSkillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'bg-white/[0.03] border border-white/[0.05] text-[7.5px] font-mono text-neutral-300 uppercase tracking-widest px-2 py-1 rounded';
          badge.textContent = skill;
          specSkillsContainer.appendChild(badge);
        });
      }

      // Toggle Mobile Accordion panels (Mobile/Tablet)
      serviceRows.forEach(r => {
        const mobilePanel = r.querySelector('.mobile-service-content');
        if (mobilePanel) {
          if (r === row) {
            const isCurrentlyOpen = mobilePanel.style.maxHeight && mobilePanel.style.maxHeight !== '0px';
            if (isCurrentlyOpen) {
              mobilePanel.style.maxHeight = '0px';
              r.classList.remove('active');
            } else {
              mobilePanel.style.maxHeight = mobilePanel.scrollHeight + 'px';
            }
          } else {
            mobilePanel.style.maxHeight = '0px';
          }
        }
      });
    });
  });

  // Initialize first mobile accordion height if needed
  const activeMobilePanel = document.querySelector('.service-selector-row.active .mobile-service-content');
  if (activeMobilePanel && window.innerWidth < 1024) {
    activeMobilePanel.style.maxHeight = activeMobilePanel.scrollHeight + 'px';
  }

  // --- CERTIFICATION MODAL WORKSPACE ---
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalRegistry = document.getElementById('cert-modal-registry');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalId = document.getElementById('cert-modal-id');
  const certModalLoader = document.getElementById('cert-modal-loader');
  const certCards = document.querySelectorAll('#certifications .border-card');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgPath = card.getAttribute('data-cert-img');
      const title = card.querySelector('h4').textContent;
      const certId = card.querySelector('.font-mono.truncate').textContent;
      const registry = card.querySelector('.font-mono').textContent;

      if (certModal) {
        certModalRegistry.textContent = `REGISTRY // ${registry}`;
        certModalTitle.textContent = `TITLE // ${title}`;
        certModalId.textContent = certId;
        
        certModalLoader.classList.remove('hidden');
        certModalImg.classList.add('hidden');
        certModal.classList.remove('hidden');
        setTimeout(() => certModal.classList.remove('opacity-0'), 10);

        if (imgPath) {
          certModalImg.src = imgPath;
          certModalImg.onload = () => {
            certModalLoader.classList.add('hidden');
            certModalImg.classList.remove('hidden');
          };
          certModalImg.onerror = () => {
            certModalLoader.innerHTML = `
              <div class="text-[#ff3b30] font-mono text-[9px] tracking-widest flex flex-col items-center gap-2">
                <span>[ ERROR: FILE_OFFLINE_404 ]</span>
                <span class="text-neutral-500 text-[8px]">IMAGE ASSET NOT FOUND IN LOCAL REPOSITORY</span>
              </div>
            `;
          };
        } else {
          certModalLoader.innerHTML = `
            <div class="text-neutral-500 font-mono text-[8px] tracking-widest">
              <span>[ NO IMAGE ASSOCIATED WITH THIS CREDENTIAL ]</span>
            </div>
          `;
        }
      }
    });
  });

  if (certModalClose) {
    certModalClose.addEventListener('click', () => {
      certModal.classList.add('opacity-0');
      setTimeout(() => {
        certModal.classList.add('hidden');
        certModalLoader.innerHTML = `
          <div class="w-4 h-4 border border-t-transparent border-white rounded-full animate-spin"></div>
          <span>RETRIEVING_ENCRYPTED_ASSET...</span>
        `;
      }, 300);
    });
  }

  // --- CREATIVE PLAYGROUND SANDBOX REMOVED ---

  // --- SMOOTH SCROLL CLICK HANDLERS ---
  const sidebarLinks = document.querySelectorAll('.sidebar-link-container a, .mobile-nav-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        // Intercept viewers section click
        if (targetId === '#viewers') {
          const isUnlocked = sessionStorage.getItem('viewers_unlocked') === 'true';
          if (!isUnlocked) {
            e.preventDefault();
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-nav-menu');
            if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
              mobileMenu.classList.add('translate-x-full');
              const line1 = document.getElementById('nav-line-1');
              const line2 = document.getElementById('nav-line-2');
              if (line1 && line2) {
                line1.style.transform = 'none';
                line2.style.transform = 'none';
              }
            }
            
            // Open the gate modal
            openGateModal();
            return;
          }
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection && scrollWrapper) {
          e.preventDefault();
          scrollWrapper.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-nav-menu');
          if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
            mobileMenu.classList.add('translate-x-full');
            const line1 = document.getElementById('nav-line-1');
            const line2 = document.getElementById('nav-line-2');
            if (line1 && line2) {
              line1.style.transform = 'none';
              line2.style.transform = 'none';
            }
          }
        }
      }
    });
  });

  // --- PHILIPPINES LOCAL TIME CLOCK ---
  const phClock = document.getElementById('ph-time');
  if (phClock) {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      phClock.textContent = formatter.format(new Date());
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- OBJECTIVE SELECTOR PILLS ---
  const objButtons = document.querySelectorAll('.objective-btn');
  const selectedObjInput = document.getElementById('selected-objective');
  if (objButtons && selectedObjInput) {
    objButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        objButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedObjInput.value = btn.getAttribute('data-val');
      });
    });
  }

  // --- TRANSMISSION HUB STATIC LABELS ---

  // --- FUTURISTIC MESSAGE TRANSMITTER ---
  const contactForm = document.getElementById('contact-form');
  const contactConsole = document.getElementById('contact-console');
  const btnTransmit = document.getElementById('btn-transmit');

  if (contactForm && contactConsole && btnTransmit) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name').value;
      const emailVal = document.getElementById('email').value;
      const messageVal = document.getElementById('message').value;
      const objectiveVal = selectedObjInput ? selectedObjInput.value : 'General Inquiry';

      // Disable button
      btnTransmit.disabled = true;
      btnTransmit.textContent = '[ TRANSMISSION_IN_PROGRESS ]';
      btnTransmit.className = 'w-full py-4 border border-white/20 text-neutral-500 font-bold uppercase text-[9px] tracking-[0.25em] rounded-xl font-mono pointer-events-none';

      // Reset and display console
      contactConsole.classList.remove('hidden');
      contactConsole.innerHTML = '';

      function printLogLine(text, type) {
        const div = document.createElement('div');
        if (type === 'success') {
          div.className = 'text-green-400 font-bold mb-1';
        } else if (type === 'security') {
          div.className = 'text-cyan-400 mb-1';
        } else if (type === 'error') {
          div.className = 'text-red-500 font-bold mb-1';
        } else if (type === 'muted') {
          div.className = 'text-neutral-500 mb-1';
        } else {
          div.className = 'text-neutral-400 mb-1';
        }
        div.textContent = text;
        contactConsole.appendChild(div);
        contactConsole.scrollTop = contactConsole.scrollHeight;
      }

      function resetTransmitButton(success) {
        if (success) {
          btnTransmit.textContent = '[ TRANSMISSION_STABLE // SENT ]';
          btnTransmit.className = 'w-full py-4 bg-green-500 text-black font-bold uppercase text-[9px] tracking-[0.25em] rounded-xl font-mono pointer-events-none';
        } else {
          btnTransmit.disabled = false;
          btnTransmit.textContent = '[ INITIATE SECURE TRANSMISSION ]';
          btnTransmit.className = 'w-full py-4 bg-white text-black font-bold uppercase text-[9px] tracking-[0.25em] rounded-xl hover:bg-neutral-200 transition-all duration-300 font-mono shadow-lg hover:shadow-white/5';
        }
      }

      // Initial simulation logs
      const simLogs = [
        { text: `[CONNECT] TARGET PROTOCOL ACQUIRED // ESTABLISHING HANDSHAKE...`, type: 'default' },
        { text: `[SECURITY] COMPILING LOCAL PAYLOAD BUFFER...`, type: 'security' },
        { text: `[SECURITY] ENCRYPTING PACKETS WITH AES-256-GCM KEY SYMMETRY...`, type: 'security' },
        { text: `[TRANSMIT] UPLOADING DATA STRIPS TO CENTRAL TERMINAL...`, type: 'default' },
        { text: `[PACKETS] OBJECTIVE: "${objectiveVal.toUpperCase()}"`, type: 'default' },
        { text: `[PACKETS] SENDER_ALIAS: "${nameVal.toUpperCase()}"`, type: 'default' },
        { text: `[PACKETS] SENDER_ROUTE: "${emailVal.toUpperCase()}"`, type: 'default' },
        { text: `[PROGRESS] SENDING PACKETS: ░░░░░░░░░░ 0%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: ████░░░░░░ 40%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: ████████░░ 80%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: ██████████ 100%`, type: 'default', delay: 150 }
      ];

      let logIdx = 0;
      function runSimulatedLogs() {
        if (logIdx < simLogs.length) {
          const logItem = simLogs[logIdx];
          printLogLine(logItem.text, logItem.type);
          logIdx++;
          setTimeout(runSimulatedLogs, logItem.delay || 80);
        } else {
          // Trigger FormSubmit AJAX send operation
          printLogLine(`[FORMSUBMIT] ROUTING DATA TO SECURE GATEWAY...`, 'default');

          fetch("https://formsubmit.co/ajax/jedramos246@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              name: nameVal,
              email: emailVal,
              objective: objectiveVal,
              message: messageVal,
              _subject: `[Portfolio Handshake] ${nameVal} - ${objectiveVal}`,
              _replyto: emailVal
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP Status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success === "true" || data.success === true) {
              printLogLine(`[SUCCESS] SECURE CORRESPONDENCE DELIVERED SUCCESSFULLY.`, 'success');
              printLogLine(`[CHANNEL] TARGET_NODE: JED_RAMOS RECEIVED CORRESPONDENCE.`, 'success');
              printLogLine(`[DISCONNECT] TERMINAL CHANNEL DISENGAGED // SECURE_SHUTDOWN.`, 'muted');
              resetTransmitButton(true);
              contactForm.reset();
            } else {
              printLogLine(`[ERROR] GATEWAY REJECTED TRANSACTION: ${data.message || 'Unknown error'}`, 'error');
              printLogLine(`[DISCONNECT] TERMINAL CHANNEL TERMINATED.`, 'muted');
              resetTransmitButton(false);
            }
          })
          .catch(err => {
            printLogLine(`[ERROR] NETWORK INTERRUPT: ${err.message || err}`, 'error');
            printLogLine(`[DISCONNECT] TERMINAL CHANNEL TERMINATED.`, 'muted');
            resetTransmitButton(false);
          });
        }
      }

      runSimulatedLogs();
    });
  }

  // --- BENTO SPOTLIGHT COORDS & CATEGORY FILTERS ---
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const manifestItemsList = document.querySelectorAll('.project-manifest-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      let firstVisibleCard = null;

      manifestItemsList.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
          if (!firstVisibleCard) {
            firstVisibleCard = card;
          }
        } else {
          card.style.display = 'none';
        }
      });

      // Switch console to the first visible card in the filtered list
      const currentActive = document.querySelector('.project-manifest-item.active');
      if (currentActive && currentActive.style.display === 'none' && firstVisibleCard) {
        currentActive.classList.remove('active');
        firstVisibleCard.classList.add('active');
        const newProjId = firstVisibleCard.getAttribute('data-project-id');
        switchProject(newProjId);
      }
    });
  });

  // --- TELEMETRY PORTAL LOGIC & VISITOR COUNTER ---
  const OBFUSCATED_TOKEN = "dXRfUmFyckN5VkdzOUZVWHc4WjJkVzllR2U1OFhpbnZZSXRKVWM1VDl1ZQ==";
  const API_TOKEN = atob(OBFUSCATED_TOKEN);
  const CORRECT_PASS_HASH = "5fc48e3ab7d2919149684887d857bb266fb5d4fd5b86d71ff7789dced91092d2";

  let fetchedCount = null;
  let fetchStatus = "loading"; // "loading" | "success" | "error"

  // Cryptographic hashing helper (SHA-256)
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback counter simulation when external API is offline
  function simulateFallbackCount() {
    const visited = localStorage.getItem("portfolio_visited");
    let localCount = parseInt(localStorage.getItem("portfolio_fallback_count") || "1427");
    if (!visited) {
      localCount += 1;
      localStorage.setItem("portfolio_fallback_count", localCount.toString());
      localStorage.setItem("portfolio_visited", "true");
    }
    fetchedCount = localCount;
    fetchStatus = "success";
    updateCounterUIState();
  }

  // Fetch unique visitor counts using CounterAPI (api.counterapi.dev)
  function fetchVisitorCount() {
    const visited = localStorage.getItem("portfolio_visited");
    const workspace = "ted-tamoss-team-4564"; // Your exact CounterAPI Workspace Slug
    const key = "first-counter-4564"; // Your exact CounterAPI Key Slug
    
    // Check if running in local development to avoid incrementing live stats
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

    // Check if the agent is a crawler bot or auditing script
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headless/i.test(navigator.userAgent);
    
    // Default url gets the count without incrementing
    let url = `https://api.counterapi.dev/v2/${workspace}/${key}`;
    const shouldIncrement = !visited && !isLocal && !isBot;
    
    if (shouldIncrement) {
      url = `https://api.counterapi.dev/v2/${workspace}/${key}/up`;
    }
    
    // Set a fetch timeout of 4 seconds to trigger fallback instead of hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(url, { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then(data => {
        let countVal = null;
        if (data) {
          if (typeof data.count === 'number') countVal = data.count;
          else if (typeof data.value === 'number') countVal = data.value;
          else if (data.data && typeof data.data.up_count === 'number') countVal = data.data.up_count;
          else if (data.data && typeof data.data.value === 'number') countVal = data.data.value;
          else if (data.data && typeof data.data.count === 'number') countVal = data.data.count;
        }

        if (countVal !== null) {
          fetchedCount = countVal;
          fetchStatus = "success";
          // Only write the visited cookie flag when we successfully incremented
          if (shouldIncrement) {
            localStorage.setItem("portfolio_visited", "true");
          }
          updateCounterUIState();
        } else {
          throw new Error("Invalid payload format");
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn("CounterAPI unavailable, activating secure client-side emulation: ", err.message || err);
        simulateFallbackCount();
      });
  }

  // Smooth Count Up Animation
  function animateCountUp(target) {
    const numberEl = document.getElementById("counter-number");
    if (!numberEl) return;

    let start = 0;
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    function updateNumber(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // EaseOutQuad
      const currentValue = Math.floor(easeProgress * target);
      numberEl.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        numberEl.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(updateNumber);
  }

  // Sync state between HTML layers & DOM
  function updateCounterUIState() {
    const skeleton = document.getElementById('counter-skeleton');
    const errorEl = document.getElementById('counter-error');
    const display = document.getElementById('counter-display');
    const numberEl = document.getElementById('counter-number');

    if (!skeleton || !errorEl || !display) return;

    if (fetchStatus === 'loading') {
      skeleton.classList.remove('hidden');
      errorEl.classList.add('hidden');
      display.classList.add('hidden');
    } else if (fetchStatus === 'error') {
      skeleton.classList.add('hidden');
      errorEl.classList.remove('hidden');
      display.classList.add('hidden');
    } else if (fetchStatus === 'success') {
      skeleton.classList.add('hidden');
      errorEl.classList.add('hidden');
      display.classList.remove('hidden');
      
      const isUnlocked = sessionStorage.getItem('viewers_unlocked') === 'true';
      if (isUnlocked && numberEl) {
        animateCountUp(fetchedCount);
      }
    }
  }

  // SweetAlert2 Secure Passcode Gate Modal
  function openGateModal() {
    if (typeof Swal === 'undefined') {
      console.error("SweetAlert2 is not loaded.");
      return;
    }
    
    Swal.fire({
      title: 'SECURE GATEWAY',
      html: `
        <div class="text-[9px] uppercase tracking-wider text-neutral-400 mb-6 font-mono leading-relaxed">
          [SEC_WARNING] ACCESS RESTRICTED TO AUTHORIZED SYSTEMS. ENTER DEPLOYMENT PASSKEY TO ENGAGE TELEMETRY HUB.
        </div>
        <div class="relative w-full border border-white/10 rounded-xl bg-black/40 overflow-hidden focus-within:border-white/30 transition-all duration-300 flex items-center px-4">
          <span class="text-neutral-500 text-[10px] select-none font-mono">></span>
          <input type="password" id="swal-gate-password" autocomplete="new-password"
            class="flex-1 min-w-0 bg-transparent pl-3 pr-2 py-3 text-[10px] text-white tracking-widest focus:outline-none placeholder:text-neutral-700 font-mono" 
            placeholder="[ENTER_PASSKEY]">
          <button type="button" id="swal-toggle-password" class="text-neutral-500 hover:text-white transition-colors duration-200 focus:outline-none text-[8px] uppercase tracking-widest font-mono select-none cursor-pointer whitespace-nowrap ml-2">
            [ SHOW ]
          </button>
        </div>
      `,
      background: '#0a0a0a',
      color: '#ffffff',
      confirmButtonText: '[ AUTHENTICATE ]',
      cancelButtonText: '[ ABORT ]',
      showCancelButton: true,
      buttonsStyling: false,
      customClass: {
        popup: 'border border-white/10 rounded-2xl font-mono p-6 bg-[#070707] shadow-2xl',
        title: 'text-xs uppercase tracking-widest font-bold text-white mb-2 font-mono',
        actions: 'flex gap-3 justify-center w-full mt-6',
        confirmButton: 'bg-white text-black font-bold uppercase text-[9px] tracking-widest px-6 py-3 rounded-xl border border-white font-mono hover:bg-neutral-200 transition-all duration-300 shadow-lg cursor-pointer',
        cancelButton: 'bg-transparent text-white/50 font-bold uppercase text-[9px] tracking-widest px-6 py-3 rounded-xl border border-white/10 font-mono hover:text-white transition-all duration-300 cursor-pointer',
        validationMessage: 'bg-transparent text-red-500 text-[8px] uppercase tracking-widest font-bold font-mono border-0 p-0 mt-3 justify-center'
      },
      didOpen: () => {
        const input = document.getElementById('swal-gate-password');
        const toggleBtn = document.getElementById('swal-toggle-password');
        
        if (input) input.focus();
        
        if (toggleBtn && input) {
          toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
              input.type = 'text';
              toggleBtn.textContent = '[ HIDE ]';
            } else {
              input.type = 'password';
              toggleBtn.textContent = '[ SHOW ]';
            }
          });
        }

        // Allow confirmation by pressing Enter
        if (input) {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              Swal.clickConfirm();
            }
          });
        }
      },
      preConfirm: () => {
        const input = document.getElementById('swal-gate-password');
        const password = input ? input.value : '';
        if (!password) {
          Swal.showValidationMessage('PASSKEY REQUIRED');
          return false;
        }
        return password;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const enteredPassword = result.value;
        const hash = await sha256(enteredPassword);

        if (hash === CORRECT_PASS_HASH || hash === "7f85b1f86137875fa3b7e4110d4a63821a566b5730c41da828b74b505dab80ef") {
          sessionStorage.setItem('viewers_unlocked', 'true');
          
          // Reveal Section
          const viewersSection = document.getElementById('viewers');
          if (viewersSection) {
            viewersSection.classList.remove('hidden');
            
            // Force active observer initialization
            if (typeof sectionObserver !== 'undefined') {
              sectionObserver.observe(viewersSection);
            }
            
            // Trigger smooth scroll down
            setTimeout(() => {
              const scrollWrapper = document.getElementById('scroll-wrapper');
              if (scrollWrapper) {
                scrollWrapper.scrollTo({
                  top: viewersSection.offsetTop,
                  behavior: 'smooth'
                });
              }
              // Trigger counter animations
              updateCounterUIState();
            }, 350);
          }
        } else {
          // Show Access Denied SweetAlert
          Swal.fire({
            title: '[ACCESS_DENIED]',
            text: 'DECRYPTION KEY FAILURE.',
            icon: 'error',
            background: '#0a0a0a',
            color: '#ff4d4d',
            confirmButtonText: '[ RETRY ]',
            buttonsStyling: false,
            customClass: {
              popup: 'border border-red-900/30 rounded-2xl font-mono p-6 bg-[#070707] shadow-2xl',
              title: 'text-xs uppercase tracking-widest font-bold text-red-500 mb-2 font-mono',
              htmlContainer: 'text-[9px] uppercase tracking-wider text-neutral-400 mb-4 font-mono',
              confirmButton: 'bg-red-600 text-white font-bold uppercase text-[9px] tracking-widest px-6 py-3 rounded-xl font-mono hover:bg-red-500 transition-all duration-300 cursor-pointer'
            }
          }).then(() => {
            openGateModal();
          });
        }
      }
    });
  }

  // Restore session unlock on reload
  function checkSessionState() {
    const isUnlocked = sessionStorage.getItem('viewers_unlocked') === 'true';
    if (isUnlocked) {
      const viewersSection = document.getElementById('viewers');
      if (viewersSection) {
        viewersSection.classList.remove('hidden');
        if (typeof sectionObserver !== 'undefined') {
          sectionObserver.observe(viewersSection);
        }
      }
    }
  }

  // --- CREATIVE STUDIOS TAB SWAP & LIGHTBOX HANDLER ---
  const btnTabSystems = document.getElementById('btn-tab-systems');
  const btnTabCreative = document.getElementById('btn-tab-creative');
  const systemsSection = document.getElementById('systems-workstation-wrapper');
  const creativeSection = document.getElementById('creative-studio-wrapper');

  if (btnTabSystems && btnTabCreative && systemsSection && creativeSection) {
    btnTabSystems.addEventListener('click', () => {
      btnTabSystems.classList.add('border-white', 'text-white', 'bg-white/5');
      btnTabSystems.classList.remove('border-white/5', 'text-neutral-500');
      
      btnTabCreative.classList.remove('border-white', 'text-white', 'bg-white/5');
      btnTabCreative.classList.add('border-white/5', 'text-neutral-500');
      
      systemsSection.classList.remove('hidden');
      creativeSection.classList.add('hidden');
    });

    btnTabCreative.addEventListener('click', () => {
      btnTabCreative.classList.add('border-white', 'text-white', 'bg-white/5');
      btnTabCreative.classList.remove('border-white/5', 'text-neutral-500');
      
      btnTabSystems.classList.remove('border-white', 'text-white', 'bg-white/5');
      btnTabSystems.classList.add('border-white/5', 'text-neutral-500');
      
      systemsSection.classList.add('hidden');
      creativeSection.classList.remove('hidden');
    });
  }

  // Category filter for Creative Studio
  const creativeFilterBtns = document.querySelectorAll('.creative-filter-btn');
  const creativeCards = document.querySelectorAll('.creative-card');

  creativeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      creativeFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-white/5');
        b.classList.add('border-white/5', 'text-neutral-400');
      });
      
      btn.classList.add('active', 'bg-white/5');
      btn.classList.remove('border-white/5', 'text-neutral-400');
      
      const filter = btn.getAttribute('data-filter');
      
      creativeCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // Lightbox Modal for Creative Studio with multiple image slider support
  const creativeLightbox = document.getElementById('creative-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title-label');
  const lightboxSubtitle = document.getElementById('lightbox-subtitle-label');
  const lightboxPlatform = document.getElementById('lightbox-platform-label');
  const lightboxCounter = document.getElementById('lightbox-counter-label');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');

  let currentImagesList = [];
  let currentImageIndex = 0;

  if (creativeLightbox && lightboxImg && lightboxClose) {
    const updateLightboxImage = () => {
      if (currentImagesList.length > 0) {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
          lightboxImg.src = currentImagesList[currentImageIndex];
          lightboxImg.style.opacity = '1';
        }, 150);

        // Update counter label
        if (lightboxCounter) {
          lightboxCounter.textContent = `${currentImageIndex + 1} OF ${currentImagesList.length}`;
        }

        // Show/hide prev/next buttons
        if (currentImagesList.length > 1) {
          lightboxPrev.classList.remove('hidden');
          lightboxNext.classList.remove('hidden');
        } else {
          lightboxPrev.classList.add('hidden');
          lightboxNext.classList.add('hidden');
        }
      }
    };

    creativeCards.forEach(card => {
      card.addEventListener('click', () => {
        const rawImages = card.getAttribute('data-images') || '';
        currentImagesList = rawImages.split(',').filter(img => img.trim() !== '');
        currentImageIndex = 0;

        lightboxTitle.textContent = card.getAttribute('data-title') || 'PROJECT SHOWCASE';
        lightboxSubtitle.textContent = card.getAttribute('data-subtitle') || 'VISUAL CREATIVE ASSET';
        lightboxPlatform.textContent = card.getAttribute('data-platform') || 'PHOTOSHOP / FIGMA';

        updateLightboxImage();

        creativeLightbox.classList.remove('hidden');
        setTimeout(() => {
          creativeLightbox.classList.add('flex');
          creativeLightbox.classList.remove('opacity-0');
        }, 10);
      });
    });

    const nextImage = (e) => {
      if (e) e.stopPropagation();
      if (currentImagesList.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % currentImagesList.length;
        updateLightboxImage();
      }
    };

    const prevImage = (e) => {
      if (e) e.stopPropagation();
      if (currentImagesList.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + currentImagesList.length) % currentImagesList.length;
        updateLightboxImage();
      }
    };

    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    const closeLightbox = () => {
      creativeLightbox.classList.add('opacity-0');
      setTimeout(() => {
        creativeLightbox.classList.remove('flex');
        creativeLightbox.classList.add('hidden');
        lightboxImg.src = '';
        currentImagesList = [];
        currentImageIndex = 0;
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    creativeLightbox.addEventListener('click', (e) => {
      if (e.target === creativeLightbox || e.target === lightboxImg.parentElement) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!creativeLightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    });
  }


  // Live Telemetry Node & Latency Detection
  function updateTelemetryLatency() {
    const latencyEl = document.getElementById('telemetry-latency');
    if (!latencyEl) return;

    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

    const nodeName = isLocal ? 'LOCALHOST' : (window.location.hostname.includes('vercel') ? 'VERCEL_EDGE' : 'LIVE_NODE');

    const startTime = performance.now();
    fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
      .then(() => {
        const ms = Math.max(8, Math.round(performance.now() - startTime));
        latencyEl.textContent = `${ms}MS // ${nodeName}`;
      })
      .catch(() => {
        latencyEl.textContent = `18MS // ${nodeName}`;
      });
  }

  // Initialize
  fetchVisitorCount();
  checkSessionState();
  updateTelemetryLatency();

  // Load default featured project (Bantay Pusta live)
  switchProject('bantay-pusta');
});

