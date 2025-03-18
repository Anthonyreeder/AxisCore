document.addEventListener('DOMContentLoaded', function() {
    // Theme definitions with expanded properties
    const themes = {
        'navy-gold': {
            '--primary': '#001F3F',
            '--primary-dark': '#00172D',
            '--primary-light': '#0A4B91',
            '--accent': '#CA9E2B', 
            '--accent-dark': '#A17D1A',
            '--accent-light': '#E4B94C',
            '--primary-gradient': 'linear-gradient(135deg, #001F3F, #0A4B91)',
            '--accent-gradient': 'linear-gradient(135deg, #CA9E2B, #E4B94C)',
            '--text-primary': '#1E293B',
            '--text-secondary': '#475569',
            '--background': '#FFFFFF',
            '--background-alt': '#F8FAFC',
            '--success': '#22C55E'
        },
        'monochromatic': {
            '--primary': '#001F3F',
            '--primary-dark': '#00172D',
            '--primary-light': '#0A4B91',
            '--accent': '#4F86C6',
            '--accent-dark': '#2C6CB2',
            '--accent-light': '#75A2D9',
            '--primary-gradient': 'linear-gradient(135deg, #001F3F, #0A4B91)',
            '--accent-gradient': 'linear-gradient(135deg, #4F86C6, #75A2D9)',
            '--text-primary': '#1E293B',
            '--text-secondary': '#475569',
            '--background': '#FFFFFF',
            '--background-alt': '#F8FAFC',
            '--success': '#22C55E'
        },
        'navy-teal': {
            '--primary': '#001F3F',
            '--primary-dark': '#00172D',
            '--primary-light': '#0A4B91',
            '--accent': '#008B8B',
            '--accent-dark': '#006666',
            '--accent-light': '#00ADAD',
            '--primary-gradient': 'linear-gradient(135deg, #001F3F, #0A4B91)',
            '--accent-gradient': 'linear-gradient(135deg, #008B8B, #00ADAD)',
            '--text-primary': '#1E293B',
            '--text-secondary': '#475569',
            '--background': '#FFFFFF',
            '--background-alt': '#F8FAFC',
            '--success': '#22C55E'
        }
    };
    
    // Theme switcher functionality
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeOptions = document.querySelectorAll('.theme-option');
    const root = document.documentElement;
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
        
        // Mark the saved theme as active
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            }
        });
    }
    
    // Toggle theme switcher on click
    document.querySelector('.theme-switcher-toggle').addEventListener('click', function() {
        themeSwitcher.classList.toggle('active');
    });
    
    // Apply theme when option is clicked
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Apply the selected theme
            applyTheme(selectedTheme);
            
            // Save selection to localStorage
            localStorage.setItem('selectedTheme', selectedTheme);
        });
    });
    
    // Function to apply theme
    function applyTheme(themeName) {
        const theme = themes[themeName];
        
        // Apply each CSS variable from the theme
        Object.keys(theme).forEach(variable => {
            root.style.setProperty(variable, theme[variable]);
        });
        
        // Update hero section background if it exists
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            // Get the current background image
            const computedStyle = window.getComputedStyle(heroSection);
            const currentBg = computedStyle.backgroundImage;
            
            // Extract the URL part
            const bgImageMatch = currentBg.match(/url\(['"]?(.*?)['"]?\)/);
            if (bgImageMatch && bgImageMatch[1]) {
                const bgImageUrl = bgImageMatch[1];
                
                // Apply the gradient with the current image
                heroSection.style.backgroundImage = `linear-gradient(135deg, 
                    rgba(${hexToRgb(theme['--primary'])}, 0.85), 
                    rgba(${hexToRgb(theme['--primary-light'])}, 0.7)
                ), url('${bgImageUrl}')`;
            }
        }

        // Ensure text colors are consistently applied to key elements
        const textElements = {
            '.hero-content h1': { color: 'white' }, // Hero title is white on dark background
            '.hero-subtitle': { color: 'rgba(255, 255, 255, 0.9)' }, // Subtitle is slightly transparent white
            'h2, h3, h4': { color: 'var(--text-primary)' },
            'p': { color: 'var(--text-secondary)' },
            '.success-metric .metric-value': { color: 'var(--primary)' },
            '.key-results-title': { color: 'var(--success)' }
        };

        // Apply fixed text colors to ensure visibility
        Object.keys(textElements).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                Object.keys(textElements[selector]).forEach(prop => {
                    el.style[prop] = textElements[selector][prop];
                });
            });
        });
    }
    
    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    }
}); 