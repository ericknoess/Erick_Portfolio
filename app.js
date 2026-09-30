/**
 * PORTFOLIO APPLICATION LOGIC - ERICK SÁNCHEZ
 * Architecture: Module Pattern / IIFE
 * Technologies: Vanilla JS (ES6+), GSAP, ScrollTrigger (Mobile-Aware)
 */

const PortfolioApp = (() => {
    
    // --- 1. CONFIGURATION & SELECTORS ---
    const config = {
        selectors: {
            loader: '#boot-loader',
            progressBar: '.progress-bar-fill',
            projectCards: '.project-card-item',
            mediaLayers: '.media-layer',
            mediaPinContainer: '#media-container',
            projectsSection: '#projects'
        }
    };

    // --- 2. BOOT SEQUENCE & INTRO ANIMATIONS ---
    const initBootSequence = () => {
        const tl = gsap.timeline({
            onComplete: initScrollTriggers
        });

        tl.to(config.selectors.progressBar, {
            width: '100%',
            duration: 1.2,
            ease: "expo.inOut"
        })
        .to(config.selectors.loader, {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut"
        })
        .from('.main-nav', {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.3")
        .from('.hero-title .line-reveal', {
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out"
        }, "-=0.4")
        .from('.hero-description, .hero-cta', {
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6");
    };

    // --- 3. RESPONSIVE SCROLLTRIGGER SYSTEM ---
    const initScrollTriggers = () => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.matchMedia({
            // DESKTOP: Activa pinning y sincronización de capas flotantes
            "(min-width: 961px)": function() {
                setupProjectPinning();
            },
            // MOBILE / TABLET: Flujo natural sin pin ni bloqueos
            "(max-width: 960px)": function() {
                setupMobileProjects();
            }
        });

        const animatedSections = document.querySelectorAll('.about-section, .arch-section, .contact-section');
        animatedSections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    };

    // --- 4. PROJECT PINNING & VIDEO SYNC (DESKTOP) ---
    const setupProjectPinning = () => {
        const cards = gsap.utils.toArray(config.selectors.projectCards);
        const layers = document.querySelectorAll(config.selectors.mediaLayers);

        if (!cards.length || !layers.length) return;

        ScrollTrigger.create({
            trigger: config.selectors.projectsSection,
            start: "top top",
            end: "bottom bottom",
            pin: config.selectors.mediaPinContainer,
            pinSpacing: false
        });

        cards.forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: "top center",
                end: "bottom center",
                onEnter: () => updateActiveMedia(index, cards, layers),
                onEnterBack: () => updateActiveMedia(index, cards, layers)
            });
        });
    };

    const updateActiveMedia = (activeIndex, cards, layers) => {
        cards.forEach((card, i) => {
            card.classList.toggle('is-active', i === activeIndex);
        });

        layers.forEach((layer, i) => {
            if (i === activeIndex) {
                layer.classList.add('active');
                const videoEl = layer.querySelector('video');
                if (videoEl && videoEl.paused) {
                    videoEl.play().catch(err => console.log("Autoplay restriction handled:", err));
                }
            } else {
                layer.classList.remove('active');
            }
        });
    };

    // --- 5. MOBILE FALLBACK (INTERACCIÓN FLUIDA) ---
    const setupMobileProjects = () => {
        const cards = gsap.utils.toArray(config.selectors.projectCards);
        cards.forEach(card => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                toggleClass: "is-active"
            });
        });
    };

    // --- PUBLIC INITIALIZATION API ---
    return {
        init: () => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBootSequence);
            } else {
                initBootSequence();
            }
        }
    };

})();

PortfolioApp.init();