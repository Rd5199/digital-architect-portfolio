/**
 * Enhanced Navigation for Cosmic Web Development
 * Handles section navigation and UI hints
 */

class EnhancedNavigation {
    constructor(options = {}) {
        this.options = Object.assign({
            sections: [],
            onSectionChange: null,
            hintDuration: 3000
        }, options);
        
        this.currentSection = 0;
        this.isNavigating = false;
        
        // Initialize navigation elements
        this.initNavigation();
        
        // Add event listeners for keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
    }
    
    /**
     * Initialize navigation elements
     */
    initNavigation() {
        // Create section navigation buttons if they don't exist
        if (document.querySelector('.section-nav') === null && this.options.sections.length > 0) {
            const nav = document.createElement('div');
            nav.className = 'section-nav';
            
            this.options.sections.forEach((section, index) => {
                const btn = document.createElement('button');
                btn.className = `section-nav-btn ${index === 0 ? 'active' : ''}`;
                btn.setAttribute('data-section', index);
                btn.setAttribute('aria-label', `Navigate to ${section.name}`);
                
                btn.addEventListener('click', () => {
                    this.navigateToSection(index);
                });
                
                nav.appendChild(btn);
            });
            
            document.body.appendChild(nav);
        }
    }
    
    /**
     * Navigate to specified section
     */
    navigateToSection(index) {
        if (this.isNavigating || index === this.currentSection) return;
        
        if (index < 0 || index >= this.options.sections.length) {
            console.warn(`Section index ${index} is out of bounds`);
            return;
        }
        
        this.isNavigating = true;
        const prevSection = this.currentSection;
        this.currentSection = index;
        
        // Update navigation buttons
        document.querySelectorAll('.section-nav-btn').forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Call section change callback
        if (this.options.onSectionChange && typeof this.options.onSectionChange === 'function') {
            this.options.onSectionChange(index, prevSection);
        }
        
        // Allow navigation again after a short delay
        setTimeout(() => {
            this.isNavigating = false;
        }, 1000);
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeyNavigation(e) {
        // ArrowDown, PageDown, Space - next section
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            if (this.currentSection < this.options.sections.length - 1) {
                this.navigateToSection(this.currentSection + 1);
                e.preventDefault();
            }
        }
        
        // ArrowUp, PageUp - previous section
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (this.currentSection > 0) {
                this.navigateToSection(this.currentSection - 1);
                e.preventDefault();
            }
        }
        
        // Home - first section
        if (e.key === 'Home') {
            this.navigateToSection(0);
            e.preventDefault();
        }
        
        // End - last section
        if (e.key === 'End') {
            this.navigateToSection(this.options.sections.length - 1);
            e.preventDefault();
        }
    }
    
    /**
     * Show a context hint to the user
     */
    showContextHint(message, position = {}) {
        // Create hint element if it doesn't exist
        let hint = document.querySelector('.context-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'context-hint';
            document.body.appendChild(hint);
        }
        
        // Set message and position
        hint.textContent = message;
        
        if (position.x !== undefined && position.y !== undefined) {
            hint.style.left = `${position.x}px`;
            hint.style.top = `${position.y}px`;
        }
        
        // Show hint
        hint.classList.add('visible');
        
        // Hide after duration
        setTimeout(() => {
            hint.classList.remove('visible');
        }, this.options.hintDuration);
    }
}

// Make available globally
window.EnhancedNavigation = EnhancedNavigation; 