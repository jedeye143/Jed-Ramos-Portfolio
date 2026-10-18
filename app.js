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

  // --- HERO LIVE TIME TELEMETRY ---
  const heroLiveTime = document.getElementById('hero-live-time');
  if (heroLiveTime) {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      heroLiveTime.textContent = now.toLocaleTimeString('en-GB', options) + ' PHT';
    };
    updateTime();
    setInterval(updateTime, 1000);
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



  // --- FEATURED WORK SECTION (WORKSTATION DECK DESIGN) ---

  const projectData = {
    'bantay-pusta': {
      name: 'Bantay Pusta',
      tab: 'BANTAYPUSTA.EXE',
      sector: 'ANTI-ILLEGAL GAMBLING SYSTEM',
      deckCategory: 'WEB APPLICATION',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Full-Stack Developer',
      year: '2024',
      platform: 'Web // Desktop',
      desc: 'Former developer of the website, API, and desktop app. A comprehensive multi-platform gambling addiction recovery system providing real-time system-level blocking, bet-free streak telemetry, emergency response, and community tracking.',
      stack: ['ASP.NET Core 8', 'WPF', 'SQL Server', 'SignalR', 'Manifest V3'],
      repo: '',
      live: '',
      img: 'project ss/banatay pusta.png',
    },
    'nathaniel-joy': {
      name: 'Wedding Website Design',
      tab: 'WEDDINGDESIGN.IO',
      sector: 'EDITORIAL WEDDING WEB DESIGN',
      deckCategory: 'WEB EXPERIENCE',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Web Designer & Dev',
      year: '2024',
      platform: 'Production Web App',
      desc: 'An elegant and romantic wedding website design featuring beautiful layouts, event details, RSVP sections, and smooth transitions crafted for a memorable experience.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      repo: '',
      live: 'https://wedding-website-design-mauve.vercel.app/',
      img: '', // No accurate screenshot — auto-embeds live site via iframe
    },
    'anns-store': {
      name: "Ann's Store",
      tab: 'ANNS-STORE.ONLINE',
      sector: 'E-COMMERCE & GROCERY DELIVERY',
      deckCategory: 'WEB APPLICATION',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Full-Stack Developer',
      year: '2024',
      platform: 'Production Web App',
      desc: 'Quick & Simple Fresh Store Reservation and Order Management. A responsive e-commerce web platform for fresh groceries, meats, fruits, and essentials with real-time order tracking, rider logistics, and automated checkout.',
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      repo: '',
      live: 'https://anns-store-delivery.vercel.app/',
      img: 'project ss/anns-store.png',
    },
    'drawforge': {
      name: 'DrawForge',
      tab: 'DRAWFORGE.IO',
      sector: 'MULTIPLAYER GAME / WEBSOCKET',
      deckCategory: 'REAL-TIME APPLICATION',
      status: 'Online',
      statusClass: 'online',
      role: 'Lead Game Engineer',
      year: '2024',
      platform: 'Cloud Web Platform',
      desc: 'A real-time multiplayer drawing game featuring two distinct game modes: Scribble It (drawing & guessing with character abilities) and Drawing Competition (simultaneous battles with voting), detailed canvas toolkit, and persistent postgres session storage.',
      stack: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Tailwind CSS', 'Howler.js'],
      repo: '',
      live: 'https://drawforge.onrender.com/',
      img: 'project ss/drawforge.png',
    },
    'dawson-gallery': {
      name: 'Dawson Wells Gallery',
      tab: 'DAWSONGALLERY.ART',
      sector: 'MODERN & CONTEMPORARY ART GALLERY',
      deckCategory: 'WEB EXPERIENCE',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Full-Stack Developer',
      year: '2024',
      platform: 'Production Web App',
      desc: 'Premier international gallery platform specializing in Modern and Contemporary Art across photography, oil paintings, drawings, ceramics, and prints with curated exhibition showcases and artist profiles.',
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      repo: '',
      live: 'https://dawsongallery.vercel.app/',
      img: 'project ss/dawson-gallery.jpg',
    },
    'touch-god': {
      name: 'Touch By God Meet',
      tab: 'TOUCHBYGOD.RTC',
      sector: 'COLLABORATIVE VIDEO PLATFORM',
      deckCategory: 'COMMUNICATION SUITE',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'WebRTC Engineer',
      year: '2024',
      platform: 'WebRTC / Cloud Node',
      desc: 'Collaborative web application featuring WebRTC video calling, room structures, and real-time chat operations with ultra-low latency peer connections.',
      stack: ['HTML', 'Tailwind', 'JavaScript', 'WebRTC', 'PeerJS'],
      repo: '',
      live: 'https://touchbygodmeet.vercel.app/',
      img: 'project ss/touch-god.png',
    },
    'smart-gate': {
      name: 'Smart Gate',
      tab: 'SMARTGATE.IOT',
      sector: 'IOT ATTENDANCE ANALYTICS',
      deckCategory: 'EMBEDDED TELEMETRY',
      status: 'Offline',
      statusClass: 'offline',
      role: 'IoT & Telemetry Dev',
      year: '2023',
      platform: 'Hardware + Dashboard',
      desc: 'Data visualization of student entry with interactive analytics. Real-time attendance monitoring, customizable reports, trend analysis, and school administrator analytics for data-driven decisions.',
      stack: ['HTML / Tailwind', 'JavaScript', 'Chart.js', 'IoT Hardware'],
      repo: '',
      live: '',
      img: 'project ss/caps.jpg',
    },
    'barangay-health': {
      name: 'Barangay Health Center',
      tab: 'HEALTHCENTER.MED',
      sector: 'MEDICAL RECORDS PLATFORM',
      deckCategory: 'ENTERPRISE SYSTEM',
      status: 'Stable',
      statusClass: 'stable',
      role: 'Backend & Architecture',
      year: '2024',
      platform: 'Enterprise Web System',
      desc: 'A full-stack medical records and queue platform designed for rural health units. Solves doctor accountability across multiple municipalities and eliminates paper records with digital triage.',
      stack: ['ASP.NET Core 9.0', 'C#', 'Bootstrap 5', 'Clean Architecture', 'SQL Server'],
      repo: '',
      live: '',
      img: 'project ss/health center.png',
    },
    'certicore': {
      name: 'CertiCore LMS',
      tab: 'CERTICORE.LMS',
      sector: 'LEARNING MANAGEMENT SYSTEM',
      deckCategory: 'ENTERPRISE PORTAL',
      status: 'Stable',
      statusClass: 'stable',
      role: 'Full-Stack Developer',
      year: '2024',
      platform: 'Web Application',
      desc: 'A comprehensive learning management system incorporating real-time assessments, discussion forums, progress monitoring, and automated professional PDF certificate generation.',
      stack: ['ASP.NET Core 8 MVC', 'EF Core', 'iText7 PDF', 'SignalR'],
      repo: '',
      live: '',
      img: 'project ss/certicoredashboard.png',
    },
    'ojt-war': {
      name: 'OJT Accomplishment Report',
      tab: 'OJTWAR.PORTAL',
      sector: 'MONITORING & REPORTS SYSTEM',
      deckCategory: 'MANAGEMENT PLATFORM',
      status: 'Online',
      statusClass: 'online',
      role: 'Frontend & Database',
      year: '2023',
      platform: 'Web Application',
      desc: 'A full-stack WAR solution with real-time monitoring of OJT tasks. Streamlines submitting and tracking weekly accomplishment reports, featuring automated notifications, progress tracking, and supervisor analytics.',
      stack: ['HTML / Tailwind', 'PHP', 'JavaScript', 'MySQL'],
      repo: '',
      live: '',
      img: 'project ss/war.jpeg',
    },
    'redesign-penguin': {
      name: 'Redesign Penguin',
      tab: 'PENGUINBRAND.DSGN',
      sector: 'BRANDING & WEB REDESIGN',
      deckCategory: 'EDITORIAL DESIGN',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'UI/UX & Brand Designer',
      year: '2024',
      platform: 'Vercel Edge',
      desc: 'Creative web design interface focused on editorial layouts, custom penguin character visuals, and smooth interactive animations.',
      stack: ['HTML', 'Tailwind', 'JavaScript', 'Vector Art'],
      repo: '',
      live: 'https://redesignpenguinramos.vercel.app/',
      img: 'project ss/redesign-penguin.png',
    },
    'coffee-website': {
      name: 'Static Coffee Website',
      tab: 'COFFEESHOWCASE.WEB',
      sector: 'CREATIVE SHOWCASE',
      deckCategory: 'RESPONSIVE WEB',
      status: 'Online',
      statusClass: 'online',
      role: 'UI Designer & Dev',
      year: '2023',
      platform: 'Responsive Web',
      desc: 'An elegant website for Coffee Lovers with responsive design. Showcases blends, brewing methods, and coffee-related content, featuring an interactive menu and tips blog.',
      stack: ['HTML / CSS', 'JavaScript', 'Modern UI'],
      repo: '',
      live: '',
      img: 'project ss/coffee.png',
    },
    'library-mgmt': {
      name: 'Library Database',
      tab: 'LIBRARYSYS.CAT',
      sector: 'CATALOG MANAGEMENT SYSTEM',
      deckCategory: 'DATABASE SUITE',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Full-Stack Developer',
      year: '2023',
      platform: 'Web Application',
      desc: 'Digital book catalog tracking database system managing user borrow sequences, inventory levels, and check-ins with fast search and filtering.',
      stack: ['HTML', 'Tailwind', 'JavaScript', 'Database'],
      repo: '',
      live: 'https://library-managementjenelo.vercel.app/',
      img: 'project ss/library-mgmt.png',
    },
    'readme-poetry': {
      name: 'Readme When You Are',
      tab: 'POETRYREAD.EXP',
      sector: 'INTERACTIVE WEB EXPERIENCE',
      deckCategory: 'CREATIVE DIGITAL ART',
      status: 'Deployed',
      statusClass: 'deployed',
      role: 'Creative Developer',
      year: '2023',
      platform: 'Interactive Web',
      desc: 'An expressive, typography-oriented digital poetry interface featuring interactive text renders and scrolling layout animations.',
      stack: ['HTML', 'Tailwind', 'JavaScript', 'Typography'],
      repo: '',
      live: 'https://readmewhenyouare.vercel.app/',
      img: 'project ss/readme-poetry.png',
    },
    'figma-workspaces': {
      name: 'Figma Design Workspaces',
      tab: 'FIGMAFRAMES.DSGN',
      sector: 'UI/UX FRAMES & KITS',
      deckCategory: 'DESIGN SYSTEMS',
      status: 'Figma',
      statusClass: 'figma',
      role: 'Lead Product Designer',
      year: '2024',
      platform: 'Figma Prototypes',
      desc: 'Interactive high-fidelity wireframes, UI kits, design systems, and components for client applications with responsive auto-layout frames.',
      stack: ['Figma', 'Wireframing', 'Design Systems', 'Prototyping'],
      repo: 'https://www.figma.com/design/WwK4DitOf2Qn9ycKJi9mmb/Ahehhehe?node-id=2-2&t=BF84kQiqpgIxu4Vm-0',
      live: 'https://www.figma.com/design/f6G1fkM8za90l0ZOYI4nMl/Untitled?node-id=0-1&p=f&t=LdvI5Yhd7sEQ7iod-0',
      img: 'project ss/figma-workspaces.png',
    },
  };

  // DOM elements for Workstation Deck
  const pwDetailImg        = document.getElementById('pw-detail-img');
  const pwDetailIframe     = document.getElementById('pw-detail-iframe');
  const pwIframeLoader     = document.getElementById('pw-iframe-loader');
  const pwDetailVignette   = document.getElementById('pw-detail-vignette');
  const pwToggleLiveBtn    = document.getElementById('pw-toggle-live-btn');
  const pwToggleLiveText   = document.getElementById('pw-toggle-live-text');
  const pwDetailLiveBadge  = document.getElementById('pw-detail-live-badge');

  const pwDeckTab          = document.getElementById('pw-deck-tab');
  const pwDeckCategory     = document.getElementById('pw-deck-category');
  const pwDeckStatus       = document.getElementById('pw-deck-status');

  const pwDetailTitle      = document.getElementById('pw-detail-title');
  const pwDetailSector     = document.getElementById('pw-detail-sector');
  const pwDetailDesc       = document.getElementById('pw-detail-desc');
  const pwDetailStack      = document.getElementById('pw-detail-stack');

  const pwDetailRole       = document.getElementById('pw-detail-role');
  const pwDetailYear       = document.getElementById('pw-detail-year');
  const pwDetailPlatform   = document.getElementById('pw-detail-platform');
  const pwDetailBtnIcon    = document.getElementById('pw-detail-btn-icon');

  const pwDetailBtnLive    = document.getElementById('pw-detail-btn-live');
  const pwDetailBtnRepo    = document.getElementById('pw-detail-btn-repo');
  const pwDetailNoLink     = document.getElementById('pw-detail-no-link');

  const pwPageCurr         = document.getElementById('pw-page-curr');
  const pwPageTotal        = document.getElementById('pw-page-total');
  const pwPageRange        = document.getElementById('pw-page-range');
  const pwPageDots         = document.getElementById('pw-page-dots');
  const pwPrevBtn          = document.getElementById('pw-prev-btn');
  const pwNextBtn          = document.getElementById('pw-next-btn');

  const pwVisibleCount     = document.getElementById('pw-visible-count');

  const pwProjectRows      = document.querySelectorAll('.pw-project-row');
  const projectFilterBtns  = document.querySelectorAll('.project-filter-btn');

  // --- 6-ITEM PAGINATION STATE ---
  const PAGE_SIZE = 6;
  let currentFilteredRows = [...pwProjectRows];
  let currentPage = 1;
  let currentActiveProjectId = 'bantay-pusta';
  let isLiveModeActive = false;

  function renderPage(page) {
    const totalPages = Math.ceil(currentFilteredRows.length / PAGE_SIZE) || 1;
    currentPage = Math.min(Math.max(1, page), totalPages);

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;

    // Hide all rows
    pwProjectRows.forEach(row => row.classList.add('hidden-page'));

    // Show only the 6 rows on this page
    currentFilteredRows.forEach((row, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        row.classList.remove('hidden-page');
      }
    });

    // Update pagination labels
    if (pwPageCurr) pwPageCurr.textContent = String(currentPage).padStart(2, '0');
    if (pwPageTotal) pwPageTotal.textContent = String(totalPages).padStart(2, '0');
    if (pwPageRange) {
      const from = currentFilteredRows.length > 0 ? startIdx + 1 : 0;
      const to = Math.min(endIdx, currentFilteredRows.length);
      pwPageRange.textContent = `${from}-${to} of ${currentFilteredRows.length}`;
    }
    if (pwVisibleCount) {
      pwVisibleCount.textContent = `${currentFilteredRows.length} Items`;
    }

    // Prev / Next button states
    if (pwPrevBtn) {
      pwPrevBtn.disabled = (currentPage <= 1);
      pwPrevBtn.style.opacity = (currentPage <= 1) ? '0.3' : '1';
      pwPrevBtn.style.pointerEvents = (currentPage <= 1) ? 'none' : 'auto';
    }
    if (pwNextBtn) {
      pwNextBtn.disabled = (currentPage >= totalPages);
      pwNextBtn.style.opacity = (currentPage >= totalPages) ? '0.3' : '1';
      pwNextBtn.style.pointerEvents = (currentPage >= totalPages) ? 'none' : 'auto';
    }

    // Render interactive page dots
    if (pwPageDots) {
      pwPageDots.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `pw-page-dot ${i === currentPage ? 'active' : ''}`;
        dot.title = `Go to page ${i}`;
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          renderPage(i);
          const firstOnPage = currentFilteredRows[(i - 1) * PAGE_SIZE];
          if (firstOnPage) firstOnPage.click();
        });
        pwPageDots.appendChild(dot);
      }
    }
  }

  // --- SHOWCASE DECK SWITCHER ---
  function switchProjectNew(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    currentActiveProjectId = projectId;
    isLiveModeActive = false;

    // Reset iframe
    if (pwDetailIframe) {
      pwDetailIframe.src = '';
      pwDetailIframe.classList.add('hidden');
    }
    if (pwIframeLoader) pwIframeLoader.classList.add('hidden');

    const hasImg = Boolean(project.img && project.img.trim() !== '');
    const hasLive = Boolean(project.live && project.live.trim() !== '');
    const hasRepo = Boolean(project.repo && project.repo.trim() !== '');

    // Image / Live accuracy: if there is no image, use the live website!
    if (hasImg) {
      // Show screenshot
      if (pwDetailIframe) {
        pwDetailIframe.classList.add('hidden');
        pwDetailIframe.style.display = 'none';
        pwDetailIframe.src = '';
      }
      if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
      if (pwDetailVignette) {
        pwDetailVignette.classList.remove('hidden');
        pwDetailVignette.style.display = 'block';
      }
      if (pwDetailImg) {
        pwDetailImg.classList.remove('hidden');
        pwDetailImg.style.display = 'block';
        pwDetailImg.style.opacity = '0';
        pwDetailImg.style.transform = 'scale(0.97)';
        pwDetailImg.onerror = () => {
          if (hasLive) {
            pwDetailImg.classList.add('hidden');
            pwDetailImg.style.display = 'none';
            if (pwDetailVignette) pwDetailVignette.style.display = 'none';
            if (pwDetailIframe) {
              let embedUrl = project.live;
              if (projectId === 'figma-workspaces') {
                embedUrl = 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(project.live);
              }
              if (pwIframeLoader) pwIframeLoader.classList.remove('hidden');
              pwDetailIframe.src = embedUrl;
              pwDetailIframe.classList.remove('hidden');
              pwDetailIframe.style.display = 'block';
              pwDetailIframe.onload = () => {
                if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
              };
            }
          }
        };
        setTimeout(() => {
          pwDetailImg.src = project.img;
          pwDetailImg.style.opacity = '1';
          pwDetailImg.style.transform = 'scale(1)';
        }, 150);
      }

      // If project ALSO has live link, allow user to toggle Live View
      if (pwToggleLiveBtn) {
        if (hasLive) {
          pwToggleLiveBtn.classList.remove('hidden');
          pwToggleLiveBtn.classList.add('inline-flex');
          if (pwToggleLiveText) pwToggleLiveText.textContent = 'Live View';
        } else {
          pwToggleLiveBtn.classList.remove('inline-flex');
          pwToggleLiveBtn.classList.add('hidden');
        }
      }
    } else if (hasLive) {
      // NO IMAGE: Automatically use the live embed!
      if (pwDetailImg) {
        pwDetailImg.classList.add('hidden');
        pwDetailImg.style.display = 'none';
      }
      if (pwDetailVignette) {
        pwDetailVignette.classList.add('hidden');
        pwDetailVignette.style.display = 'none';
      }
      if (pwDetailIframe) {
        let embedUrl = project.live;
        if (projectId === 'figma-workspaces') {
          embedUrl = 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(project.live);
        }
        if (pwIframeLoader) pwIframeLoader.classList.remove('hidden');
        pwDetailIframe.src = embedUrl;
        pwDetailIframe.classList.remove('hidden');
        pwDetailIframe.style.display = 'block';
        pwDetailIframe.onload = () => {
          if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
        };
      }
      if (pwToggleLiveBtn) {
        pwToggleLiveBtn.classList.remove('inline-flex');
        pwToggleLiveBtn.classList.add('hidden');
      }
    } else {
      // Neither image nor live
      if (pwDetailImg) {
        pwDetailImg.classList.add('hidden');
        pwDetailImg.style.display = 'none';
      }
      if (pwDetailIframe) {
        pwDetailIframe.classList.add('hidden');
        pwDetailIframe.style.display = 'none';
        pwDetailIframe.src = '';
      }
      if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
      if (pwToggleLiveBtn) pwToggleLiveBtn.classList.add('hidden');
      if (pwDetailVignette) pwDetailVignette.classList.add('hidden');
    }

    // Top window bar
    if (pwDeckTab) pwDeckTab.textContent = project.tab || (project.name.toUpperCase() + '.SYS');
    if (pwDeckCategory) pwDeckCategory.textContent = project.deckCategory || 'WEB APPLICATION';
    if (pwDeckStatus) {
      pwDeckStatus.className = `pw-status-pill ${project.statusClass} text-[9px] px-2.5 py-0.5 rounded-full`;
      pwDeckStatus.innerHTML = `<span class="pw-status-dot"></span>${project.status}`;
    }

    // Main detail text
    if (pwDetailTitle)  pwDetailTitle.textContent  = project.name;
    if (pwDetailSector) pwDetailSector.textContent = project.sector;
    if (pwDetailDesc)   pwDetailDesc.textContent   = project.desc;

    // Stack pills
    if (pwDetailStack) {
      pwDetailStack.innerHTML = '';
      project.stack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'pw-stack-tag';
        span.textContent = tech;
        pwDetailStack.appendChild(span);
      });
    }

    // Bottom Specs Strip
    if (pwDetailRole)     pwDetailRole.textContent = project.role || 'Full-Stack Developer';
    if (pwDetailYear)     pwDetailYear.textContent = project.year || '2024';
    if (pwDetailPlatform) pwDetailPlatform.textContent = project.platform || 'Web Application';

    // Direct launch icon button
    const primaryLink = project.live || project.repo || '#';
    if (pwDetailBtnIcon) {
      pwDetailBtnIcon.href = primaryLink;
      pwDetailBtnIcon.style.opacity = (hasLive || hasRepo) ? '1' : '0.3';
      pwDetailBtnIcon.style.pointerEvents = (hasLive || hasRepo) ? 'auto' : 'none';
    }

    // Primary CTA button
    if (pwDetailBtnLive) {
      if (hasLive) {
        pwDetailBtnLive.href = project.live;
        pwDetailBtnLive.classList.remove('hidden');
        pwDetailBtnLive.classList.add('inline-flex');
        const btnLabel = pwDetailBtnLive.querySelector('span:nth-child(2)');
        if (btnLabel) btnLabel.textContent = projectId === 'figma-workspaces' ? 'View Prototype' : 'View Project';
      } else {
        pwDetailBtnLive.classList.remove('inline-flex');
        pwDetailBtnLive.classList.add('hidden');
      }
    }

    // Secondary repo/source button
    if (pwDetailBtnRepo) {
      if (hasRepo) {
        pwDetailBtnRepo.href = project.repo;
        pwDetailBtnRepo.classList.remove('hidden');
        pwDetailBtnRepo.classList.add('inline-flex');
        const repoLabel = pwDetailBtnRepo.querySelector('span:nth-child(1)');
        if (repoLabel) repoLabel.textContent = projectId === 'figma-workspaces' ? 'Figma File' : 'Source';
      } else {
        pwDetailBtnRepo.classList.remove('inline-flex');
        pwDetailBtnRepo.classList.add('hidden');
      }
    }

    // Internal notice
    if (pwDetailNoLink) {
      pwDetailNoLink.style.display = (!hasLive && !hasRepo) ? 'inline-block' : 'none';
    }

    // Corner external link shortcut
    if (pwDetailLiveBadge) {
      if (hasLive) {
        pwDetailLiveBadge.href = project.live;
        pwDetailLiveBadge.classList.remove('hidden');
        pwDetailLiveBadge.classList.add('flex');
      } else {
        pwDetailLiveBadge.classList.remove('flex');
        pwDetailLiveBadge.classList.add('hidden');
      }
    }
  }

  // --- LIVE VIEW TOGGLE BUTTON LISTENER ---
  if (pwToggleLiveBtn) {
    pwToggleLiveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const project = projectData[currentActiveProjectId];
      if (!project || !project.live) return;

      if (!isLiveModeActive) {
        // Switch to Live Iframe View
        isLiveModeActive = true;
        if (pwDetailImg) pwDetailImg.classList.add('hidden');
        if (pwDetailVignette) pwDetailVignette.classList.add('hidden');
        if (pwDetailIframe) {
          let embedUrl = project.live;
          if (currentActiveProjectId === 'figma-workspaces') {
            embedUrl = 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(project.live);
          }
          if (pwIframeLoader) pwIframeLoader.classList.remove('hidden');
          pwDetailIframe.src = embedUrl;
          pwDetailIframe.classList.remove('hidden');
          pwDetailIframe.onload = () => {
            if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
          };
        }
        if (pwToggleLiveText) pwToggleLiveText.textContent = 'Screenshot';
      } else {
        // Switch back to Screenshot View
        isLiveModeActive = false;
        if (pwDetailIframe) {
          pwDetailIframe.classList.add('hidden');
          pwDetailIframe.src = '';
        }
        if (pwIframeLoader) pwIframeLoader.classList.add('hidden');
        if (pwDetailImg) {
          pwDetailImg.classList.remove('hidden');
          pwDetailImg.style.opacity = '1';
        }
        if (pwDetailVignette) pwDetailVignette.classList.remove('hidden');
        if (pwToggleLiveText) pwToggleLiveText.textContent = 'Live View';
      }
    });
  }

  // --- PROJECT ROWS CLICK LISTENER ---
  pwProjectRows.forEach(row => {
    row.addEventListener('click', () => {
      pwProjectRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      const projectId = row.getAttribute('data-project-id');
      switchProjectNew(projectId);

      // Smooth scroll to showcase deck on mobile
      if (window.innerWidth < 1024) {
        const deck = document.getElementById('pw-detail-img');
        if (deck) deck.closest('.lg\\:col-span-7')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // --- PAGER PREV / NEXT BUTTONS ---
  if (pwPrevBtn) {
    pwPrevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        renderPage(currentPage - 1);
        const firstOnPage = currentFilteredRows[(currentPage - 1) * PAGE_SIZE];
        if (firstOnPage) firstOnPage.click();
      }
    });
  }

  if (pwNextBtn) {
    pwNextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(currentFilteredRows.length / PAGE_SIZE) || 1;
      if (currentPage < totalPages) {
        renderPage(currentPage + 1);
        const firstOnPage = currentFilteredRows[(currentPage - 1) * PAGE_SIZE];
        if (firstOnPage) firstOnPage.click();
      }
    });
  }

  // --- FILTER PILLS LISTENER ---
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      // Filter rows
      currentFilteredRows = [...pwProjectRows].filter(row => {
        const cat = row.getAttribute('data-category');
        return (filter === 'all' || cat === filter);
      });

      // Render page 1 of filtered set
      renderPage(1);

      // Auto-select first row on page 1
      if (currentFilteredRows.length > 0) {
        currentFilteredRows[0].click();
      }
    });
  });

  // Initialize Page 1 and default project
  renderPage(1);
  switchProjectNew('bantay-pusta');

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
        { text: `[PROGRESS] SENDING PACKETS: â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘ 0%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: â–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘ 40%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘ 80%`, type: 'default', delay: 150 },
        { text: `[PROGRESS] SENDING PACKETS: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ 100%`, type: 'default', delay: 150 }
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
      btnTabSystems.classList.add('active', 'text-white', 'bg-white/10');
      btnTabSystems.classList.remove('text-neutral-500');
      
      btnTabCreative.classList.remove('active', 'text-white', 'bg-white/10');
      btnTabCreative.classList.add('text-neutral-500');
      
      systemsSection.classList.remove('hidden');
      systemsSection.classList.add('flex');
      creativeSection.classList.add('hidden');
      creativeSection.classList.remove('flex');
    });

    btnTabCreative.addEventListener('click', () => {
      btnTabCreative.classList.add('active', 'text-white', 'bg-white/10');
      btnTabCreative.classList.remove('text-neutral-500');
      
      btnTabSystems.classList.remove('active', 'text-white', 'bg-white/10');
      btnTabSystems.classList.add('text-neutral-500');
      
      systemsSection.classList.add('hidden');
      systemsSection.classList.remove('flex');
      creativeSection.classList.remove('hidden');
      creativeSection.classList.add('flex');
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
});

