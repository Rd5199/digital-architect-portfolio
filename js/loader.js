/**
 * Enhanced Loader for Cosmic Web Development
 * Handles loading screen with space facts and mini-game functionality
 */

class EnhancedLoader {
    constructor(options = {}) {
        this.options = Object.assign({
            timeout: 15000,           // 15 second default timeout
            minLoadingTime: 2000,     // Minimum loading time to show the loader (prevents flash)
            onTimeout: null,          // Callback for timeout
            onLoadComplete: null,     // Callback for load complete
            onProgress: null          // Callback for progress updates
        }, options);
        
        this.loaded = 0;
        this.total = 0;
        this.startTime = 0;
        this.timeoutTimer = null;
        
        // Elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingText = this.loadingScreen ? this.loadingScreen.querySelector('.loading-text') : null;
        
        // Space facts for loading screen
        this.spaceFacts = [
            "The universe is estimated to be about 13.8 billion years old.",
            "There are more stars in the universe than grains of sand on all the beaches on Earth.",
            "A day on Venus is longer than a year on Venus.",
            "A year on Mercury is just 88 Earth days.",
            "The footprints left by astronauts on the moon will likely remain there for at least 100 million years.",
            "The largest crater on the Moon is 1,550 miles (2,500 km) wide.",
            "One million Earths could fit inside the Sun.",
            "The Sun loses up to a billion kilograms a second due to solar winds.",
            "Space is completely silent as there is no atmosphere to carry sound waves."
        ];
    }
    
    /**
     * Start the loader
     */
    start() {
        this.startTime = Date.now();
        
        // Show loading screen
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.style.opacity = '1';
            
            // Display a random space fact
            if (this.loadingText) {
                const randomFact = this.spaceFacts[Math.floor(Math.random() * this.spaceFacts.length)];
                const loadingTitle = document.createElement('h2');
                loadingTitle.textContent = 'Entering Cosmic Web Space';
                
                const loadingFact = document.createElement('p');
                loadingFact.textContent = randomFact;
                
                this.loadingText.innerHTML = '';
                this.loadingText.appendChild(loadingTitle);
                this.loadingText.appendChild(loadingFact);
            }
        }
        
        // Set timeout
        if (this.options.timeout > 0) {
            this.timeoutTimer = setTimeout(() => {
                if (this.options.onTimeout && typeof this.options.onTimeout === 'function') {
                    this.options.onTimeout();
                }
            }, this.options.timeout);
        }
        
        return this;
    }
    
    /**
     * Set total number of assets to load
     */
    setTotal(total) {
        this.total = total;
        return this;
    }
    
    /**
     * Increment loaded assets count
     */
    incrementLoaded() {
        this.loaded++;
        const percent = Math.min(Math.floor((this.loaded / Math.max(this.total, 1)) * 100), 100);
        
        // Update loading text
        if (this.loadingText) {
            const loadingProgress = document.createElement('div');
            loadingProgress.textContent = `Loading: ${percent}%`;
            loadingProgress.style.marginTop = '10px';
            loadingProgress.style.fontSize = '14px';
            loadingProgress.style.opacity = '0.8';
            
            // Replace the previous progress element if it exists
            const existingProgress = this.loadingText.querySelector('div');
            if (existingProgress) {
                this.loadingText.replaceChild(loadingProgress, existingProgress);
            } else {
                this.loadingText.appendChild(loadingProgress);
            }
        }
        
        // Call progress callback
        if (this.options.onProgress && typeof this.options.onProgress === 'function') {
            this.options.onProgress(percent);
        }
        
        // Check if loading is complete
        if (this.loaded >= this.total) {
            this.complete();
        }
        
        return this;
    }
    
    /**
     * Complete the loading process
     */
    complete() {
        // Ensure minimum loading time
        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.options.minLoadingTime - elapsed);
        
        setTimeout(() => {
            // Clear timeout timer
            if (this.timeoutTimer) {
                clearTimeout(this.timeoutTimer);
                this.timeoutTimer = null;
            }
            
            // Hide loading screen
            if (this.loadingScreen) {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }
            
            // Call complete callback
            if (this.options.onLoadComplete && typeof this.options.onLoadComplete === 'function') {
                this.options.onLoadComplete();
            }
        }, remainingTime);
        
        return this;
    }
}

// Make available globally
window.EnhancedLoader = EnhancedLoader; 