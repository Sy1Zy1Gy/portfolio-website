/**
 * Portfolio Website JavaScript
 * Features: Dark mode toggle, smooth scrolling, animations, carousel interactions, and interactive elements
 * 
 * Main Features:
 * - Dark/Light theme switching with smooth animations
 * - Smooth scrolling navigation with active link highlighting
 * - Interactive carousels with keyboard and touch support
 * - Scroll-triggered animations and effects
 * - Performance optimizations and accessibility features
 */

// ===== GLOBAL VARIABLES =====
// Core DOM elements used throughout the application
const darkModeToggle = document.getElementById('darkModeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const body = document.body;
const navbar = document.querySelector('.navbar');

// ===== DARK MODE FUNCTIONALITY =====
/**
 * Manages the website's dark/light theme functionality
 * Handles theme persistence, system preference detection, and smooth transitions
 */
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    /**
     * Retrieves the stored theme preference from localStorage
     * @returns {string|null} The stored theme or null if not set
     */
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    /**
     * Detects the user's system theme preference
     * @returns {string} 'dark' or 'light' based on system preference
     */
    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Sets the theme and updates the UI accordingly
     * @param {string} theme - The theme to set ('dark' or 'light')
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateToggleState();
    }

    /**
     * Updates the visual state of the theme toggle switch
     * Synchronizes the toggle state with the current theme and updates accessibility attributes
     */
    updateToggleState() {
        if (this.currentTheme === 'dark') {
            darkModeToggle.checked = true;
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            darkModeToggle.checked = false;
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    /**
     * Toggles between dark and light themes
     * Includes visual feedback animation for enhanced user experience
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add enhanced visual feedback with ripple effect
        this.addToggleAnimation();
    }
    
    /**
     * Adds visual feedback animation when theme is toggled
     * Creates scale animation and ripple effect for enhanced user interaction
     */
    addToggleAnimation() {
        const toggleLabel = document.querySelector('.theme-toggle-label');
        
        // Apply scale animation for tactile feedback
        toggleLabel.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleLabel.style.transform = 'scale(1)';
        }, 150);
        
        // Create ripple effect for visual feedback
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: var(--shadow-medium);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 60px;
            height: 60px;
            margin-left: -30px;
            margin-top: -30px;
        `;
        
        toggleLabel.style.position = 'relative';
        toggleLabel.appendChild(ripple);
        
        // Clean up ripple element after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Initializes the theme manager
     * Sets up event listeners and applies the initial theme
     */
    init() {
        this.setTheme(this.currentTheme);
        
        // Set up toggle switch event listener for manual theme changes
        darkModeToggle.addEventListener('change', () => this.toggleTheme());
        
        // Listen for system theme preference changes
        // Only applies if user hasn't manually set a preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== SMOOTH SCROLLING NAVIGATION =====
/**
 * Handles smooth scrolling behavior for navigation links
 * Provides enhanced user experience with smooth transitions between sections
 */
class SmoothScroll {
    constructor() {
        this.init();
    }

    /**
     * Initializes smooth scrolling for all anchor links
     * Sets up event listeners for navigation and handles mobile menu closure
     */
    init() {
        // Handle all anchor links that point to page sections
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    // Calculate scroll position accounting for fixed navbar height
                    const offsetTop = target.offsetTop - 80;
                    
                    // Perform smooth scroll to target section
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Auto-close mobile navigation menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
}

// ===== NAVBAR SCROLL EFFECTS =====
/**
 * Manages navbar behavior during scroll events
 * Handles visual effects and active link highlighting based on scroll position
 */
class NavbarEffects {
    constructor() {
        this.lastScrollTop = 0;
        this.init();
    }

    /**
     * Initializes scroll event listeners for navbar effects
     */
    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    /**
     * Handles all scroll-related navbar effects
     * Updates navbar shadow and active navigation links
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add subtle shadow to navbar when user scrolls down
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 20px var(--shadow-light)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        // Update which navigation link is highlighted as active
        this.updateActiveNavLink();
        
        this.lastScrollTop = scrollTop;
    }

    /**
     * Updates the active state of navigation links based on current scroll position
     * Highlights the link corresponding to the currently visible section
     */
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        
        // Determine which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar height
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active state for navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
/**
 * Manages scroll-triggered animations using Intersection Observer API
 * Provides smooth fade-in effects for elements as they enter the viewport
 */
class ScrollAnimations {
    constructor() {
        // Configuration for intersection observer
        this.observerOptions = {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Start animation 50px before element enters viewport
        };
        this.init();
    }

    /**
     * Initializes the intersection observer and sets up animation triggers
     * Uses modern Intersection Observer API for better performance than scroll events
     */
    init() {
        // Create intersection observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class when element enters viewport
                    entry.target.classList.add('fade-in-up');
                    // Stop observing this element to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Select all elements that should have scroll animations
        const animatedElements = document.querySelectorAll(
            '.project-card, .contact-item, .certificate-card, #about .col-lg-6, #projects h2, #certificates h2, #contact h2'
        );
        
        // Start observing each element for intersection
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// ===== CERTIFICATE CAROUSEL INTERACTIONS =====
class CertificateCarouselEffects {
    constructor() {
        this.carousel = null;
        this.init();
    }

    init() {
        const carouselElement = document.getElementById('certificatesCarousel');
        
        if (carouselElement) {
            // Initialize Bootstrap carousel with auto-slide enabled
            this.carousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000, // Auto-advance every 5 seconds
                wrap: true,
                keyboard: true,
                pause: false, // Don't pause on hover to maintain auto-slide
                ride: 'carousel'
            });
            
            // Start the carousel cycling
            this.carousel.cycle();
            
            // Add keyboard navigation
            this.addKeyboardNavigation(carouselElement);
            
            // Add smooth transition effects
            this.addTransitionEffects(carouselElement);
            
            // Add horizontal line indicators functionality
            this.addHorizontalIndicators(carouselElement);
            
            // Add modal functionality
            this.addModalFunctionality();
        }
    }
    
    addKeyboardNavigation(carouselElement) {
        document.addEventListener('keydown', (e) => {
            if (this.carousel) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.carousel.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.carousel.next();
                        break;
                }
            }
        });
    }
    
    // Hover effects removed to maintain auto-slide functionality
    
    addTransitionEffects(carouselElement) {
        carouselElement.addEventListener('slide.bs.carousel', (e) => {
            const activeItem = e.target.querySelector('.carousel-item.active');
            const nextItem = e.relatedTarget;
            
            if (activeItem) {
                activeItem.style.transition = 'transform 0.6s ease-in-out';
            }
            
            if (nextItem) {
                nextItem.style.transition = 'transform 0.6s ease-in-out';
            }
        });
    }
    
    addHorizontalIndicators(carouselElement) {
        const indicators = document.querySelectorAll('.indicator-line');
        
        if (indicators.length > 0) {
            // Add click event listeners to indicators
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    if (this.carousel) {
                        this.carousel.to(index);
                    }
                });
                
                // Add keyboard support for indicators
                indicator.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (this.carousel) {
                            this.carousel.to(index);
                        }
                    }
                });
            });
            
            // Update active indicator when carousel slides
            carouselElement.addEventListener('slid.bs.carousel', (e) => {
                const activeIndex = Array.from(e.target.querySelectorAll('.carousel-item')).indexOf(e.target.querySelector('.carousel-item.active'));
                
                // Remove active class from all indicators
                indicators.forEach(indicator => indicator.classList.remove('active'));
                
                // Add active class to current indicator
                if (indicators[activeIndex]) {
                    indicators[activeIndex].classList.add('active');
                }
            });
            
            // Set initial active indicator
            const activeCarouselItem = carouselElement.querySelector('.carousel-item.active');
            if (activeCarouselItem) {
                const activeIndex = Array.from(carouselElement.querySelectorAll('.carousel-item')).indexOf(activeCarouselItem);
                if (indicators[activeIndex]) {
                    indicators[activeIndex].classList.add('active');
                }
            }
        }
    }
    
    addModalFunctionality() {
        const certificateCards = document.querySelectorAll('.certificate-card');
        const modal = document.getElementById('certificateModal');
        const modalImage = document.getElementById('modalCertificateImage');
        const modalTitle = document.getElementById('modalCertificateTitle');
        const modalIssuer = document.getElementById('modalCertificateIssuer');
        const modalDate = document.getElementById('modalCertificateDate');
        
        if (certificateCards.length > 0 && modal) {
            certificateCards.forEach(card => {
                // Remove any existing Bootstrap modal attributes to prevent conflicts
                card.removeAttribute('data-bs-toggle');
                card.removeAttribute('data-bs-target');
                
                // Function to open modal with certificate data
                const openCertificateModal = (e) => {
                    // Prevent event bubbling and default behavior
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Temporarily pause carousel auto-slide
                    if (this.carousel) {
                        this.carousel.pause();
                    }
                    
                    // Get certificate data from data attributes
                    const certificateImage = card.dataset.certificate;
                    const title = card.dataset.title;
                    const issuer = card.dataset.issuer;
                    const date = card.dataset.date;
                    
                    // Update modal content
                    if (modalImage && certificateImage) {
                        modalImage.src = `assets/${certificateImage}`;
                        modalImage.alt = title;
                    }
                    
                    if (modalTitle && title) {
                        modalTitle.textContent = title;
                    }
                    
                    if (modalIssuer && issuer) {
                        modalIssuer.textContent = `Issued by: ${issuer}`;
                    }
                    
                    if (modalDate && date) {
                        modalDate.textContent = `Completed: ${date}`;
                    }
                    
                    // Show the modal
                    const bootstrapModal = new bootstrap.Modal(modal);
                    bootstrapModal.show();
                };
                
                // Add click event listener with proper event handling
                card.addEventListener('click', openCertificateModal, { capture: true });
                
                // Add keyboard event listener for accessibility
                card.addEventListener('keydown', (e) => {
                    // Activate on Enter or Space key
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        openCertificateModal(e);
                    }
                });
                
                // Add visual feedback for keyboard focus
                card.addEventListener('focus', () => {
                    card.style.outline = '2px solid var(--primary-color)';
                });
                
                card.addEventListener('blur', () => {
                    card.style.outline = 'none';
                });
            });
            
            // Resume carousel when modal is closed
            modal.addEventListener('hidden.bs.modal', () => {
                if (modalImage) modalImage.src = '';
                if (modalTitle) modalTitle.textContent = '';
                if (modalIssuer) modalIssuer.textContent = '';
                if (modalDate) modalDate.textContent = '';
                
                // Resume carousel auto-slide
                if (this.carousel) {
                    this.carousel.cycle();
                }
            });
        }
    }
}

// ===== PROJECT CARD INTERACTIONS =====
/**
 * Handles interactive effects for project cards
 * Provides hover animations and click feedback for enhanced user experience
 */
class ProjectCardEffects {
    constructor() {
        this.init();
    }

    /**
     * Initializes hover and click effects for all project cards
     * Sets up smooth animations and ripple effects for buttons
     */
    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Add smooth hover animation with lift effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add ripple effect to all buttons within the card
            const buttons = card.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.createRippleEffect(e, button);
                });
            });
        });
    }

    /**
     * Creates a ripple effect animation on button click
     * @param {Event} event - The click event
     * @param {Element} element - The button element to add ripple to
     */
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // Calculate ripple position relative to click point
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // Style the ripple element
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: var(--shadow-light);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Prepare element for ripple effect
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Clean up ripple element after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===== CONTACT INTERACTIONS =====
/**
 * Handles interactive features for contact section
 * Provides click tracking and copy-to-clipboard functionality
 */
class ContactInteractions {
    constructor() {
        this.init();
    }

    /**
     * Initializes contact interaction features
     * Sets up click tracking and email copy functionality
     */
    init() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const link = item.querySelector('a');
            
            if (link) {
                // Track contact method usage for analytics
                link.addEventListener('click', () => {
                    const contactType = item.querySelector('h5').textContent;
                    console.log(`Contact clicked: ${contactType}`);
                    
                    // Analytics tracking can be added here
                    // gtag('event', 'contact_click', { contact_type: contactType });
                });
                
                // Enable double-click to copy email addresses
                if (link.href.startsWith('mailto:')) {
                    item.addEventListener('dblclick', () => {
                        const email = link.href.replace('mailto:', '');
                        this.copyToClipboard(email);
                        this.showCopyNotification(item);
                    });
                }
            }
        });
    }

    /**
     * Copies text to clipboard using modern API with fallback
     * @param {string} text - The text to copy to clipboard
     */
    copyToClipboard(text) {
        if (navigator.clipboard) {
            // Use modern Clipboard API if available
            navigator.clipboard.writeText(text);
        } else {
            // Fallback method for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    /**
     * Shows a temporary notification when text is copied
     * @param {Element} element - The element to show notification above
     */
    showCopyNotification(element) {
        const notification = document.createElement('div');
        notification.textContent = 'Email copied to clipboard!';
        notification.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        element.style.position = 'relative';
        element.appendChild(notification);
        
        // Fade in notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove notification after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src*="placeholder"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // In a real implementation, you would replace placeholder URLs with actual image URLs
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    preloadResources() {
        // Preload important fonts or images
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        // link.href = 'path/to/important-font.woff2';
        // document.head.appendChild(link);
    }
}

// ===== KEYBOARD NAVIGATION =====
class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Toggle dark mode with Ctrl/Cmd + D
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                darkModeToggle.checked = !darkModeToggle.checked;
                darkModeToggle.dispatchEvent(new Event('change'));
            }
            
            // Navigate sections with arrow keys when focused on nav
            if (document.activeElement.classList.contains('nav-link')) {
                const navLinks = Array.from(document.querySelectorAll('.nav-link'));
                const currentIndex = navLinks.indexOf(document.activeElement);
                
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
                    navLinks[prevIndex].focus();
                }
            }
        });
    }
}

// ===== PROJECTS CAROUSEL =====
class ProjectsCarousel {
    constructor() {
        this.carousel = null;
        this.init();
    }

    init() {
        const carouselElement = document.getElementById('projectsCarousel');
        
        if (carouselElement) {
            // Initialize Bootstrap carousel
            this.carousel = new bootstrap.Carousel(carouselElement, {
                interval: 4000, // Auto-advance every 4 seconds
                wrap: true,
                keyboard: true,
                pause: 'hover',
                ride: 'carousel'
            });
            
            // Add touch/swipe support
            this.addSwipeSupport(carouselElement);
            
            // Add keyboard navigation
            this.addKeyboardNavigation(carouselElement);
            
            // Add responsive behavior
            this.addResponsiveBehavior(carouselElement);
        }
    }
    
    addSwipeSupport(carouselElement) {
        let startX = 0;
        let endX = 0;
        
        carouselElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselElement.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Mouse support for desktop
        let isMouseDown = false;
        
        carouselElement.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
        });
        
        carouselElement.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                endX = e.clientX;
                this.handleSwipe();
                isMouseDown = false;
            }
        });
        
        carouselElement.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
    }
    
    handleSwipe() {
        const threshold = 50; // Minimum distance for swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.carousel.next();
            } else {
                // Swipe right - previous slide
                this.carousel.prev();
            }
        }
    }
    
    addKeyboardNavigation(carouselElement) {
        carouselElement.addEventListener('keydown', (e) => {
            if (this.carousel) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.carousel.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.carousel.next();
                        break;
                }
            }
        });
    }
    
    addResponsiveBehavior(carouselElement) {
        // Adjust carousel behavior based on screen size
        const updateCarouselBehavior = () => {
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // Faster transitions on mobile
                this.carousel.dispose();
                this.carousel = new bootstrap.Carousel(carouselElement, {
                    interval: 3000,
                    wrap: true,
                    keyboard: false,
                    pause: false,
                    ride: 'carousel'
                });
            } else {
                // Standard behavior on desktop
                this.carousel.dispose();
                this.carousel = new bootstrap.Carousel(carouselElement, {
                    interval: 4000,
                    wrap: true,
                    keyboard: true,
                    pause: 'hover',
                    ride: 'carousel'
                });
            }
        };
        
        // Update on resize
        window.addEventListener('resize', debounce(updateCarouselBehavior, 250));
    }
}

// ===== APPLICATION INITIALIZATION =====
/**
 * Initializes all website components when DOM is fully loaded
 * Sets up error handling and performance monitoring
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all interactive components in order of dependency
        new ThemeManager();
        new SmoothScroll();
        new NavbarEffects();
        new ScrollAnimations();
        new CertificateCarouselEffects();
        new ProjectsCarousel();
        new ProjectCardEffects();
        new ContactInteractions();
        new PerformanceOptimizer();
        new KeyboardNavigation();
        
        // Add CSS for ripple animation effects
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .loaded {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Set up global error handling for better debugging
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
        
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }
        
        // Show page after everything is loaded
        document.body.style.opacity = '1';
        
        // Confirm successful initialization
        console.log('Portfolio website initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize website components:', error);
    }
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        SmoothScroll,
        NavbarEffects,
        ScrollAnimations,
        CertificateCarouselEffects,
        ProjectCardEffects,
        ContactInteractions,
        PerformanceOptimizer,
        KeyboardNavigation
    };
}