// This script modifies the showcase.html file to better handle missing 3D models
// by ensuring the fallback models are used immediately

document.addEventListener('DOMContentLoaded', function() {
    // Immediately show model info panel
    document.getElementById('model-info').classList.add('visible');
    
    // Force fallback model creation since we don't have actual GLB files
    if (typeof createFallbackModel === 'function') {
        const modelButtons = document.querySelectorAll('.model-btn');
        const activeButton = document.querySelector('.model-btn.active');
        const activeModelType = activeButton.getAttribute('data-model');
        
        // Create fallback model for the active model type
        setTimeout(() => {
            // Hide loading screen
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
            
            // Try to trigger fallback creation
            if (window.scene && window.currentModel === null) {
                createFallbackModel(activeModelType);
                updateModelInfo(activeModelType);
            }
        }, 1500);
    }
}); 