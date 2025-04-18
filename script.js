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
        heroTitle: "Master STEM Concepts with <span class='logo-text'>EngiCards</span>",
        heroSubtitle: "The ultimate flashcard app designed specifically for students in Science, Technology, Engineering, and Mathematics",
        downloadNow: "Download Now",
        // Features section
        keyFeatures: "Key Features",
        feature1Title: "Scientific Flashcards",
        feature1Desc: "Display complex formulas and equations beautifully with built-in LaTeX support.",
        feature2Title: "LaTeX OCR Feature",
        feature2Desc: "Snap a photo of printed or handwritten formulas and convert them instantly to LaTeX.",
        feature3Title: "Cards by Topic",
        feature3Desc: "Keep your study material organized with custom decks for different subjects or topics.",
        feature4Title: "Review Sessions",
        feature4Desc: "Engage with your cards through smooth animations, visual feedback, and gestures.",
        feature5Title: "Community Decks",
        feature5Desc: "Explore and use flashcard decks created and shared by other EngiCards users.",
        feature6Title: "Instant Sharing",
        feature6Desc: "Easily share your decks with friends or classmates via a QR code or a direct link.",
        // Demo Section
        seeInAction: "See It in Action",
        // Try it section
        tryItOut: "Try It Out",
        front: "FRONT",
        back: "BACK",
        questionPlaceholder: "Use $...$ for inline LaTeX, like $F_g$.",
        answerPlaceholder: "Use $$...$$ for LaTeX blocks: $$ F = G \\frac{m_1 m_2}{r^2} $$",
        previewCard: "Preview Card",
        edit: "Edit",
        flip: "Flip",
        // Download Section
        downloadTitle: "Download EngiCards",
        // Footer translations
        footerFeatures: "Features",
        footerDemo: "Demo",
        footerTryIt: "Try It",
        footerDownload: "Download",
        copyright: "© 2025 Zouhair Fakhoury"
    },
    fr: {
        features: "Fonctionnalités",
        demo: "Démo",
        tryIt: "Essayer",
        download: "Télécharger",
        heroTitle: "Maîtrisez les Concepts de STEM avec <span class='logo-text'>EngiCards</span>",
        heroSubtitle: "L'application de cartes mémoire ultime conçue spécifiquement pour les étudiants en science, technologie, ingénierie et mathématiques",
        downloadNow: "Télécharger",
        // Features section
        keyFeatures: "Fonctionnalités Clés",
        feature1Title: "Cartes mémoire scientifiques",
        feature1Desc: "Affichez magnifiquement des formules et équations complexes grâce au support LaTeX intégré.",
        feature2Title: "OCR LaTeX",
        feature2Desc: "Prenez une photo de formules imprimées ou manuscrites et convertissez-les instantanément en LaTeX.",
        feature3Title: "Cartes par Sujet",
        feature3Desc: "Organisez votre matériel d'étude avec des paquets personnalisés par matière ou sujet.",
        feature4Title: "Sessions de Révision",
        feature4Desc: "Interagissez avec vos cartes grâce à des animations fluides, des retours visuels et des gestes.",
        feature5Title: "Paquets Communautaires",
        feature5Desc: "Explorez et utilisez des paquets de cartes mémoire créés et partagés par d'autres utilisateurs d'EngiCards.",
        feature6Title: "Partage Instantané",
        feature6Desc: "Partagez facilement vos paquets avec des amis ou camarades via un code QR ou un lien direct.",
        // Demo Section
        seeInAction: "Voir en Action",
        // Try it section
        tryItOut: "Essayez-le",
        front: "RECTO",
        back: "VERSO",
        questionPlaceholder: "Utilisez $...$ pour LaTeX en ligne, comme $F_g$.",
        answerPlaceholder: "Utilisez $$...$$ pour les blocs de LaTeX : $$F = G \\frac{m_1 m_2}{r^2}$$",
        previewCard: "Aperçu",
        edit: "Modifier",
        flip: "Retourner",
        // Download Section
        downloadTitle: "Télécharger EngiCards",
        // Footer translations
        footerFeatures: "Fonctionnalités",
        footerDemo: "Démo",
        footerTryIt: "Essayer",
        footerDownload: "Télécharger",
        copyright: "© 2025 Zouhair Fakhoury"
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
    const safeUpdateText = (selector, text, isHTML = false, attribute = null) => {
        const element = document.querySelector(selector);
        if (element) {
            if (attribute) {
                element.setAttribute(attribute, text);
            } else if (isHTML) {
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
        safeUpdateText('nav a[href="#features"]', t.features);
        safeUpdateText('nav a[href="#demo"]', t.demo);
        safeUpdateText('nav a[href="#try"]', t.tryIt);
        safeUpdateAll('.download-btn', t.download);
        
        // Update hero section
        safeUpdateText('.hero h1', t.heroTitle, true);
        safeUpdateText('.hero p', t.heroSubtitle);
        safeUpdateText('.cta-button', t.downloadNow);
        
        // Update features section
        safeUpdateText('#features h2', t.keyFeatures);
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length >= 6) { // Ensure enough cards exist (now 6)
            featureCards[0].querySelector('h3').textContent = t.feature1Title;
            featureCards[0].querySelector('p').textContent = t.feature1Desc;
            featureCards[1].querySelector('h3').textContent = t.feature2Title;
            featureCards[1].querySelector('p').textContent = t.feature2Desc;
            featureCards[2].querySelector('h3').textContent = t.feature3Title;
            featureCards[2].querySelector('p').textContent = t.feature3Desc;
            featureCards[3].querySelector('h3').textContent = t.feature4Title;
            featureCards[3].querySelector('p').textContent = t.feature4Desc;
            featureCards[4].querySelector('h3').textContent = t.feature5Title;
            featureCards[4].querySelector('p').textContent = t.feature5Desc;
            featureCards[5].querySelector('h3').textContent = t.feature6Title;
            featureCards[5].querySelector('p').textContent = t.feature6Desc;
        } else {
            console.warn('Not enough feature cards found to update all translations.');
        }
        
        // Update Demo section
        safeUpdateText('#demo h2', t.seeInAction);
        
        // Update try it section
        safeUpdateText('#try h2', t.tryItOut);
        safeUpdateText('.editor-column:first-child .column-header', t.front);
        safeUpdateText('.editor-column:last-child .column-header', t.back);
        safeUpdateText('#front-input', t.questionPlaceholder, false, 'placeholder');
        safeUpdateText('#back-input', t.answerPlaceholder, false, 'placeholder');
        safeUpdateText('.preview-btn span', t.previewCard); // Assuming preview text is in a span now
        safeUpdateText('.edit-btn span', t.edit);          // Assuming edit text is in a span now
        safeUpdateText('.flip-btn span', t.flip);          // Assuming flip text is in a span now
        
        // Update Download section
        safeUpdateText('#download h2', t.downloadTitle);
        
        // Update footer links
        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks) {
            safeUpdateText('.footer-links a[href="#features"]', t.footerFeatures);
            safeUpdateText('.footer-links a[href="#demo"]', t.footerDemo);
            safeUpdateText('.footer-links a[href="#try"]', t.footerTryIt);
            safeUpdateText('.footer-links a[href="#download"]', t.footerDownload);
        }
        
        // Update copyright text - Target only the text node part
        const copyrightP = document.querySelector('.footer-bottom p');
        if (copyrightP) {
            // Find the text node containing the copyright info
            const textNode = Array.from(copyrightP.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('©'));
            if(textNode) {
                textNode.textContent = ` ${t.copyright} | `;
            } else {
                 // Fallback if text node isn't found as expected
                 const splitText = copyrightP.innerHTML.split('|');
                 if(splitText.length > 1) { 
                    copyrightP.innerHTML = `${t.copyright} |${splitText[1]}`;
                 }
            }
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
    const dotsContainer = document.querySelector('.carousel-dots'); // Get dots container

    let currentIndex = 0;
    let autoplayInterval;

    // Create dots
    const createDots = () => {
        dotsContainer.innerHTML = ''; // Clear existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button'); // Use button for accessibility
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlidePosition();
                updateDots();
                startAutoplay(); // Reset timer on manual navigation
            });
            dotsContainer.appendChild(dot);
        });
    };

    // Update dots function
    const updateDots = () => {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    // Update slide position
    const updateSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        updateDots(); // Update dots when slide position changes
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
        updateDots(); // Ensure dots update after swipe
        startAutoplay();
    });
    
    // Initial setup
    createDots();
    updateSlidePosition(); // This will call updateDots initially
    startAutoplay();
});
