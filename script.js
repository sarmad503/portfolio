/* ===================================
   SARMAD NAJEEB PORTFOLIO
   JavaScript Interactions
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initWorkFilters();
    initVideoModal();
    initContactForm();
    initSmoothScroll();
});

/* ===================================
   CUSTOM CURSOR
   =================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Function to check if cursor should be visible
    function shouldShowCursor() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isLargeScreen = window.innerWidth > 1024;
        const hasHover = window.matchMedia('(hover: hover)').matches;
        return !isTouchDevice && isLargeScreen && hasHover;
    }
    
    // Hide cursor on mobile/touch devices
    function hideCursor() {
        cursor.style.display = 'none';
        cursor.style.visibility = 'hidden';
        follower.style.display = 'none';
        follower.style.visibility = 'hidden';
    }
    
    // Initially hide on mobile
    if (!shouldShowCursor()) {
        hideCursor();
        return;
    }
    
    // Handle resize - hide cursor if window becomes small
    window.addEventListener('resize', () => {
        if (!shouldShowCursor()) {
            hideCursor();
        }
    });
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation loop
    function animateCursor() {
        if (!shouldShowCursor()) {
            hideCursor();
            return;
        }
        
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower follows with delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .work-item, .service-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = 'var(--primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
    });
}

/* ===================================
   NAVIGATION
   =================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Add reveal class to elements
    const animateElements = document.querySelectorAll(
        '.section-header, .about-image, .about-text, .service-card, .work-item, ' +
        '.vortix-content, .contact-info, .contact-form, .highlight-item'
    );
    
    animateElements.forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Stagger animation for grid items (limited delay)
    const staggerContainers = document.querySelectorAll('.services-grid, .work-grid');
    staggerContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            // Cap the delay to prevent slow loading
            item.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
        });
    });
}

/* ===================================
   COUNTER ANIMATION
   =================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ===================================
   WORK FILTERS
   =================================== */
function initWorkFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter items with animation
            workItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ===================================
   VIDEO MODAL
   =================================== */
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalClose = document.getElementById('modalClose');
    const videoContainer = document.getElementById('videoContainer');
    const playBtns = document.querySelectorAll('.play-btn');
    const playlistInfo = document.getElementById('playlistInfo');
    const playlistTitle = document.getElementById('playlistTitle');
    const videoCounter = document.getElementById('videoCounter');
    const prevBtn = document.getElementById('prevVideo');
    const nextBtn = document.getElementById('nextVideo');
    
    let currentPlaylist = null;
    let currentVideoIndex = 0;
    
    if (!modal) return;
    
    function loadVideo(index) {
        if (!currentPlaylist || index < 0 || index >= currentPlaylist.length) return;
        
        currentVideoIndex = index;
        const video = currentPlaylist[currentVideoIndex];
        
        // Update counter and title
        videoCounter.textContent = `${currentVideoIndex + 1} / ${currentPlaylist.length}`;
        playlistTitle.textContent = video.title;
        
        // Load video
        videoContainer.innerHTML = `
            <iframe 
                src="${video.url}" 
                width="100%" 
                height="100%" 
                allowfullscreen
                lazyload
                frameborder="0"
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
        `;
        
        // Update button states
        prevBtn.disabled = currentVideoIndex === 0;
        nextBtn.disabled = currentVideoIndex === currentPlaylist.length - 1;
    }
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const videoUrl = btn.getAttribute('data-video');
            const videoLink = btn.getAttribute('data-video-link');
            const playlistData = btn.getAttribute('data-playlist');
            
            // If it's an external link (like Instagram), open in new tab
            if (videoLink) {
                window.open(videoLink, '_blank');
                return;
            }
            
            // If it's a playlist
            if (playlistData) {
                try {
                    currentPlaylist = JSON.parse(playlistData);
                    currentVideoIndex = 0;
                    playlistInfo.style.display = 'block';
                    loadVideo(0);
                } catch (e) {
                    console.error('Invalid playlist data', e);
                    return;
                }
            }
            // Single video
            else if (videoUrl) {
                currentPlaylist = null;
                playlistInfo.style.display = 'none';
                videoContainer.innerHTML = `
                    <iframe 
                        src="${videoUrl}" 
                        width="100%" 
                        height="100%" 
                        allowfullscreen
                        lazyload
                        frameborder="0"
                        allow="clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                `;
            } else {
                currentPlaylist = null;
                playlistInfo.style.display = 'none';
                videoContainer.innerHTML = `
                    <div class="video-placeholder">
                        <p>Video Coming Soon</p>
                        <span>This video will be added shortly</span>
                    </div>
                `;
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Playlist navigation
    prevBtn.addEventListener('click', () => {
        if (currentPlaylist && currentVideoIndex > 0) {
            loadVideo(currentVideoIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPlaylist && currentVideoIndex < currentPlaylist.length - 1) {
            loadVideo(currentVideoIndex + 1);
        }
    });
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft' && currentPlaylist) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && currentPlaylist) {
                nextBtn.click();
            }
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear the video to stop playback
        videoContainer.innerHTML = '';
        currentPlaylist = null;
        currentVideoIndex = 0;
    }
}

/* ===================================
   CONTACT FORM
   =================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        
        // Animate button
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            form.reset();
        }, 3000);
        
        console.log('Form submitted:', data);
    });
    
    // Floating labels
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   PARALLAX EFFECTS
   =================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/* ===================================
   TILT EFFECT FOR CARDS
   =================================== */
document.querySelectorAll('.service-card, .work-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===================================
   MAGNETIC BUTTONS
   =================================== */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ===================================
   TEXT SCRAMBLE EFFECT
   =================================== */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

/* ===================================
   LOADING ANIMATION
   =================================== */
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});
