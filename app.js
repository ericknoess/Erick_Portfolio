/**
 * PORTFOLIO APPLICATION LOGIC - ERICK SÁNCHEZ
 * Architecture: Module Pattern / IIFE
 * Technologies: Vanilla JS (ES6+), GSAP, ScrollTrigger (Video Autoplay Sync)
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
            onComplete: () => {
                initScrollTriggers();
                initVideoObservers(); // Asegura la reproducción de videos al cargar y entrar en vista
            }
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
            const videoEl = layer.querySelector('video');
            if (i === activeIndex) {
                layer.classList.add('active');
                if (videoEl) {
                    playVideoSafely(videoEl);
                }
            } else {
                layer.classList.remove('active');
                if (videoEl) {
                    videoEl.pause();
                }
            }
        });
    };

    // --- 5. MOBILE FALLBACK & VIDEO OBSERVER ---
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

    // Intersection Observer robusto para garantizar reproducción automática de videos móviles cuando entran al viewport
    const initVideoObservers = () => {
        const allVideos = document.querySelectorAll('video');
        
        const observerOptions = {
            root: null,
            threshold: 0.25 // Se activa cuando al menos el 25% del video es visible
        };

        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    playVideoSafely(video);
                } else {
                    video.pause();
                }
            });
        }, observerOptions);

        allVideos.forEach(video => {
            videoObserver.observe(video);
        });
    };

    // Función auxiliar para manejar promesas de reproducción y evitar excepciones del navegador
    const playVideoSafely = (videoElement) => {
        if (!videoElement) return;
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented or interrupted by browser policy:", error);
            });
        }
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