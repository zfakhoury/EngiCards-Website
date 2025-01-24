// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Initialize theme
    setTheme(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
    });

    // Add preview button event listener
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            enterPreview();
        });
    }

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // Initialize language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('language') || 'en';
    initializeLanguage(savedLang);
    
    // Setup language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const currentLangSpan = langToggle.querySelector('.current-lang');
        
        // Set initial language display
        currentLangSpan.textContent = savedLang.toUpperCase();
        
        // Update initial content
        updateContent(savedLang);
        
        // Add click handler with debugging
        langToggle.addEventListener('click', () => {
            const currentLang = currentLangSpan.textContent.toLowerCase();
            console.log('Current language:', currentLang); // Debug log
            
            const newLang = currentLang === 'en' ? 'fr' : 'en';
            console.log('Switching to:', newLang); // Debug log
            
            // Update button text first
            currentLangSpan.textContent = newLang.toUpperCase();
            
            // Then switch the language
            setLanguage(newLang);
        });
    }
});

// Card flip functionality
let isFlipped = false;

function flipCard() {
    const card = document.getElementById('flashcard');
    isFlipped = !isFlipped;
    card.classList.toggle('flipped');
}

// Add card functionality
function addCard() {
    const frontInput = document.getElementById('front-input');
    const backInput = document.getElementById('back-input');
    const frontContent = document.getElementById('front-content');
    const backContent = document.getElementById('back-content');

    if (frontInput.value && backInput.value) {
        // Remove empty state messages
        frontContent.querySelector('.empty-state')?.remove();
        backContent.querySelector('.empty-state')?.remove();

        // Update content
        frontContent.innerHTML = frontInput.value;
        backContent.innerHTML = backInput.value;
        
        // Render LaTeX
        MathJax.typesetPromise([frontContent, backContent]).then(() => {
            console.log('LaTeX rendered successfully');
        }).catch((err) => {
            console.error('Error rendering LaTeX:', err);
        });

        // Clear inputs
        frontInput.value = '';
        backInput.value = '';

        // Show success message
        showToast('Card added successfully!');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});


// Add loading spinner styles
const style = document.createElement('style');
style.textContent = `
    .processing-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Add these functions
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });

    // Preview mode
    document.getElementById('preview-btn').addEventListener('click', enterPreview);
});

// Preview card functionality
document.addEventListener('DOMContentLoaded', () => {
    const previewBtn = document.getElementById('preview-btn');
    const previewCard = document.getElementById('preview-card');
    
    previewBtn.addEventListener('click', enterPreview);
    previewCard.addEventListener('click', () => {
        previewCard.classList.toggle('flipped');
    });
});

function enterPreview() {
    const frontContent = document.getElementById('front-input').value;
    const backContent = document.getElementById('back-input').value;
    
    if (!frontContent && !backContent) {
        return;
    }

    const editorContainer = document.querySelector('.editor-container');
    const previewContainer = document.querySelector('.preview-container');
    const previewFrontContent = document.getElementById('preview-front-content');
    const previewBackContent = document.getElementById('preview-back-content');

    // Update content
    previewFrontContent.innerHTML = frontContent;
    previewBackContent.innerHTML = backContent;

    // Fade out editor
    editorContainer.style.opacity = '0';
    
    setTimeout(() => {
        editorContainer.style.display = 'none';
        previewContainer.style.display = 'flex';
        
        // Force reflow
        void previewContainer.offsetWidth;
        
        // Fade in preview
        previewContainer.style.opacity = '1';
        
        // Render LaTeX if needed
        if (window.MathJax) {
            MathJax.typesetPromise([previewFrontContent, previewBackContent]).catch(console.error);
        }
    }, 300);
}

function exitPreview() {
    const editorContainer = document.querySelector('.editor-container');
    const previewContainer = document.querySelector('.preview-container');
    const previewCard = document.getElementById('preview-card');

    // Reset card state
    previewCard.classList.remove('flipped');
    
    // Fade out preview
    previewContainer.style.opacity = '0';
    
    setTimeout(() => {
        previewContainer.style.display = 'none';
        editorContainer.style.display = 'block';
        
        // Force reflow
        void editorContainer.offsetWidth;
        
        // Fade in editor
        editorContainer.style.opacity = '1';
    }, 300);
}

function flipPreviewCard() {
    const card = document.getElementById('preview-card');
    card.classList.toggle('flipped');
    
    // Preserve the current position while flipping
    const transform = card.style.transform;
    if (transform) {
        const [translate] = transform.match(/translate3d\([^)]+\)/) || [''];
        card.style.transform = `${translate} rotateY(${card.classList.contains('flipped') ? '180deg' : '0deg'})`;
    }
}

// Add auto-resize for textareas
document.addEventListener('DOMContentLoaded', () => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});

// Consolidate all DOMContentLoaded event listeners into one
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Preview card functionality
    const previewBtn = document.getElementById('preview-btn');
    const previewCard = document.getElementById('preview-card');
    
    if (previewBtn && previewCard) {
        previewBtn.addEventListener('click', enterPreview);
        previewCard.addEventListener('click', () => {
            previewCard.classList.toggle('flipped');
        });
    }

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});

// Add translations object
const translations = {
    en: {
        features: "Features",
        demo: "Demo",
        tryIt: "Try It",
        download: "Download",
        heroTitle: "Master Engineering Concepts with EngiCards",
        heroSubtitle: "The ultimate flashcard app designed specifically for engineering students",
        downloadNow: "Download Now",
        // Features section
        keyFeatures: "Key Features",
        feature1Title: "Handwriting to LaTeX",
        feature1Desc: "Convert your handwritten equations to perfect LaTeX with just a photo",
        feature2Title: "Smart Review System",
        feature2Desc: "Track your progress and focus on cards you need to practice more",
        feature3Title: "Organized Decks",
        feature3Desc: "Keep your cards organized by subject with customizable decks",
        feature4Title: "Dark Mode",
        feature4Desc: "Study comfortably day or night with automatic dark mode",
        // Try it section
        tryItOut: "Try It Out",
        front: "FRONT",
        back: "BACK",
        questionPlaceholder: "Question...",
        answerPlaceholder: "Answer...",
        previewCard: "Preview Card",
        edit: "Edit",
        flip: "Flip",
        // Add footer translations
        footerFeatures: "Features",
        footerDemo: "Demo",
        footerTryIt: "Try It",
        footerDownload: "Download",
        copyright: "© 2024 EngiCards. All rights reserved."
    },
    fr: {
        features: "Fonctionnalités",
        demo: "Démo",
        tryIt: "Essayer",
        download: "Télécharger",
        heroTitle: "Maîtrisez les Concepts d'Ingénierie avec EngiCards",
        heroSubtitle: "L'application de cartes mémoire ultime conçue spécifiquement pour les étudiants en ingénierie",
        downloadNow: "Télécharger",
        // Features section
        keyFeatures: "Fonctionnalités Clés",
        feature1Title: "Écriture vers LaTeX",
        feature1Desc: "Convertissez vos équations manuscrites en LaTeX parfait avec une simple photo",
        feature2Title: "Système de Révision Intelligent",
        feature2Desc: "Suivez vos progrès et concentrez-vous sur les cartes à réviser",
        feature3Title: "Paquets Organisés",
        feature3Desc: "Gardez vos cartes organisées par matière avec des paquets personnalisables",
        feature4Title: "Mode Sombre",
        feature4Desc: "Étudiez confortablement jour et nuit avec le mode sombre automatique",
        // Try it section
        tryItOut: "Essayez-le",
        front: "RECTO",
        back: "VERSO",
        questionPlaceholder: "Question...",
        answerPlaceholder: "Réponse...",
        previewCard: "Aperçu",
        edit: "Modifier",
        flip: "Retourner",
        // Add footer translations
        footerFeatures: "Fonctionnalités",
        footerDemo: "Démo",
        footerTryIt: "Essayer",
        footerDownload: "Télécharger",
        copyright: "© 2024 EngiCards. Tous droits réservés."
    }
};

// Add language switcher functionality
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Translation not found for language: ${lang}`);
        return;
    }
    
    try {
        // Add fade out effect
        const elements = document.querySelectorAll('h1, h2, h3, p, a, button, span, .column-header');
        elements.forEach(el => el.classList.add('translating'));
        
        // Wait for fade out, then update content
        setTimeout(() => {
            localStorage.setItem('language', lang);
            updateContent(lang);
            
            // Remove fade effect after content update
            setTimeout(() => {
                elements.forEach(el => el.classList.remove('translating'));
            }, 50);
        }, 300);
        
    } catch (error) {
        console.error('Error setting language:', error);
    }
}

function updateContent(lang) {
    const t = translations[lang];
    
    // Helper function to safely update text content
    const safeUpdateText = (selector, text, isHTML = false) => {
        const element = document.querySelector(selector);
        if (element) {
            if (isHTML) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        } else {
            console.warn(`Element not found: ${selector}`);
        }
    };
    
    // Helper function to safely update multiple elements
    const safeUpdateAll = (selector, text) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(el => el.textContent = text);
        } else {
            console.warn(`No elements found: ${selector}`);
        }
    };

    try {
        // Update navigation
        safeUpdateText('a[href="#features"]', t.features);
        safeUpdateText('a[href="#demo"]', t.demo);
        safeUpdateText('a[href="#try"]', t.tryIt);
        safeUpdateAll('.download-btn', t.download);
        
        // Update hero section
        safeUpdateText('.hero h1', t.heroTitle);
        safeUpdateText('.hero p', t.heroSubtitle);
        safeUpdateText('.cta-button', t.downloadNow);
        
        // Update features section
        safeUpdateText('#features h2', t.keyFeatures);
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards[0].querySelector('h3').textContent = t.feature1Title;
        featureCards[0].querySelector('p').textContent = t.feature1Desc;
        featureCards[1].querySelector('h3').textContent = t.feature2Title;
        featureCards[1].querySelector('p').textContent = t.feature2Desc;
        featureCards[2].querySelector('h3').textContent = t.feature3Title;
        featureCards[2].querySelector('p').textContent = t.feature3Desc;
        featureCards[3].querySelector('h3').textContent = t.feature4Title;
        featureCards[3].querySelector('p').textContent = t.feature4Desc;
        
        // Update try it section
        safeUpdateText('#try h2', t.tryItOut);
        safeUpdateText('.column-header:first-child', t.front);
        safeUpdateText('.column-header:last-child', t.back);
        safeUpdateText('#front-input', t.questionPlaceholder);
        safeUpdateText('#back-input', t.answerPlaceholder);
        safeUpdateText('.preview-btn', `<i class="fas fa-eye"></i>${t.previewCard}`, true);
        safeUpdateText('.edit-btn', `<i class="fas fa-edit"></i>${t.edit}`, true);
        safeUpdateText('.flip-btn', `<i class="fas fa-sync-alt"></i>${t.flip}`, true);
        
        // Update footer links
        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks) {
            safeUpdateText('a[href="#features"]', t.footerFeatures);
            safeUpdateText('a[href="#demo"]', t.footerDemo);
            safeUpdateText('a[href="#try"]', t.footerTryIt);
            safeUpdateText('a[href="#download"]', t.footerDownload);
        }
        
        // Update copyright text
        const copyrightText = document.querySelector('.footer-bottom p');
        if (copyrightText) {
            copyrightText.textContent = t.copyright;
        }
        
        // Update download section title
        const downloadTitle = document.querySelector('#download h2');
        if (downloadTitle) {
            downloadTitle.textContent = t.download;
        }
    } catch (error) {
        console.error('Error updating content:', error);
    }
}

// Add new function to handle initial language setup
function initializeLanguage(lang) {
    // Update the language toggle button text
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    
    // Update all translated content
    updateContent(lang);
}

// Update carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // Update slide position
    const updateSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Reset progress bar animation
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = 'progressFill 4s linear';
    };
    
    // Next slide function
    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    };
    
    // Previous slide function
    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
    };
    
    // Start autoplay
    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 4000);
    };
    
    // Stop autoplay
    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    };
    
    // Event listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
    });
    
    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
    });
    
    // Handle mouse interactions
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    
    // Handle touch interactions
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    });
    
    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    });
    
    // Start autoplay initially
    startAutoplay();
});
