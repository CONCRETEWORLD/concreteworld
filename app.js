// Professional Concrete World (Ayaan Hardware) JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effects
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Fade in animation
                if (element.classList.contains('product-card') || 
                    element.classList.contains('brand-item') ||
                    element.classList.contains('service-item') ||
                    element.classList.contains('testimonial-card') ||
                    element.classList.contains('contact-item')) {
                    
                    const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
                    setTimeout(() => {
                        element.classList.add('fade-in');
                    }, delay);
                }
                
                // Counter animation for stats
                if (element.classList.contains('stat-number')) {
                    const target = parseInt(element.dataset.count);
                    if (target && !element.classList.contains('animated')) {
                        element.classList.add('animated');
                        animateCounter(element, target);
                    }
                }
                
                // Section animations
                if (element.classList.contains('section-header')) {
                    element.classList.add('slide-up');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.product-card, .brand-item, .service-item, .testimonial-card, .contact-item, .stat-number, .section-header'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Product card interactions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            if (category === 'consultation') {
                // Scroll to contact form for consultation
                const contactForm = document.querySelector('#contact');
                if (contactForm) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = contactForm.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus on category select
                    setTimeout(() => {
                        const categorySelect = document.getElementById('category');
                        if (categorySelect) {
                            categorySelect.focus();
                            categorySelect.value = category;
                        }
                    }, 800);
                }
            } else {
                // Show interest message
                showNotification(`Interested in ${this.querySelector('.product-title').textContent}? Contact us for more details!`, 'info');
            }
        });
    });

    // Form handling
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('#name').value;
            const phone = formData.get('phone') || this.querySelector('#phone').value;
            const category = formData.get('category') || this.querySelector('#category').value;
            
            // Basic validation
            if (!name || !phone || !category) {
                showNotification('Please fill in all required fields.', 'error');
                highlightEmptyFields();
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Please enter a valid 10-digit phone number.', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Quote request submitted successfully! We will contact you soon.', 'success');
                this.reset();
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }

    function highlightEmptyFields() {
        const requiredFields = quoteForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#8e8e8e';
                }, { once: true });
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: '#2c3e50',
            error: '#dc3545',
            warning: '#d4af37',
            info: '#2c3e50'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            padding: 1rem 1.5rem;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
            border: 2px solid #d4af37;
        `;
        
        document.body.appendChild(notification);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add notification animations
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyles);

    // Button enhancements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);

    // Scroll to top functionality
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #d4af37;
        color: #23272b;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to scroll button
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.background = '#b8991f';
        this.style.transform = 'scale(1.1)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.background = '#d4af37';
        this.style.transform = 'scale(1)';
    });

    // Enhanced form input effects
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-1px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'translateY(0)';
        });

        // Validate on input
        input.addEventListener('input', function() {
            if (this.hasAttribute('required')) {
                if (this.value.trim()) {
                    this.style.borderColor = '#2c3e50';
                } else {
                    this.style.borderColor = '#8e8e8e';
                }
            }
            
            // Phone number formatting
            if (this.type === 'tel') {
                const phoneRegex = /^[6-9]\d{9}$/;
                if (this.value && !phoneRegex.test(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else if (this.value) {
                    this.style.borderColor = '#2c3e50';
                }
            }
            
            // Email validation
            if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#2c3e50';
                }
            }
        });
    });

    // Brand items hover effects
    const brandItems = document.querySelectorAll('.brand-item');
    brandItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add subtle animation to other brand items
            brandItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.style.opacity = '0.7';
                    otherItem.style.transform = 'scale(0.95)';
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            // Reset all brand items
            brandItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
                otherItem.style.transform = 'scale(1)';
            });
        });
    });

    // Keyboard navigation enhancements
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
        
        // Navigate to contact form on Ctrl+M
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Performance monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Concrete World (Ayaan Hardware) loaded in ${loadTime.toFixed(2)}ms`);
        
        // Show welcome message after page load
        setTimeout(() => {
            showNotification('Welcome to Concrete World (Ayaan Hardware)! Contact us for all your building material needs.', 'info');
        }, 2000);
    });

    // Initialize animations for visible elements
    function initializeVisibleElements() {
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const statNumbers = heroStats.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    // Delay animation slightly for better visual effect
                    setTimeout(() => {
                        animateCounter(stat, target);
                    }, 500);
                }
            });
        }
    }

    // Initialize visible elements after a short delay
    setTimeout(initializeVisibleElements, 1000);

    // Add professional touch with company info logging
    console.log('%c🏗️ Concrete World (Ayaan Hardware)', 'color: #d4af37; font-size: 20px; font-weight: bold;');
    console.log('%c5 Years of Excellence since 2020', 'color: #2c3e50; font-size: 14px;');
    console.log('%cAK Plaza, Near Hadibasaveshwara Temple, Bagalkot Road, Aminagad', 'color: #8e8e8e; font-size: 12px;');
    console.log('%cPhone: 8660775309 | Email: concreteworldamingad@gmail.com', 'color: #8e8e8e; font-size: 12px;');

    console.log('Concrete World (Ayaan Hardware) - Professional Building Materials Website Initialized');
});

// Utility function for debouncing
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

// Additional utility functions for business operations
const BusinessUtils = {
    // Format phone number for display
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return phone;
    },
    
    // Generate WhatsApp message
    generateWhatsAppMessage: (name, phone, category, details = '') => {
        let message = `Hello Concrete World (Ayaan Hardware),\n\n`;
        message += `I'm ${name} (${phone}) and I'm interested in ${category}.\n`;
        if (details) {
            message += `\nProject Details: ${details}\n`;
        }
        message += `\nPlease provide more information and pricing.\n\nThank you!`;
        return encodeURIComponent(message);
    },
    
    // Validate business hours (assuming 9 AM - 7 PM)
    isBusinessHours: () => {
        const now = new Date();
        const hours = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Business hours: Monday-Saturday 9 AM - 7 PM
        return (day >= 1 && day <= 6) && (hours >= 9 && hours <= 19);
    },
    
    // Get business status message
    getBusinessStatus: () => {
        if (BusinessUtils.isBusinessHours()) {
            return 'We are currently open! Call us now.';
        } else {
            return 'We are currently closed. We will respond to your message during business hours (9 AM - 7 PM, Mon-Sat).';
        }
    }
};

// Enhanced WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add business status information
            const status = BusinessUtils.getBusinessStatus();
            const originalMessage = 'Hello! I would like to inquire about your building materials and services.';
            const enhancedMessage = `${originalMessage}\n\n${status}`;
            
            // Update the WhatsApp link with enhanced message
            const phoneNumber = '918660775309';
            this.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(enhancedMessage)}`;
        });
    });
}