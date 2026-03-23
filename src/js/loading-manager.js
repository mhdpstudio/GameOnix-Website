// Universal loading manager - handles all pages
(function() {
    'use strict';
    
    // Create loading screen if not exists
    if (!document.getElementById('loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div></div>
            <p>Loading...</p>
        `;
        document.body.prepend(loadingScreen);
    }
    
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;
        
        const navEntry = performance.getEntriesByType('navigation')[0];
        const navType = navEntry?.type || 'navigate';
        
        if (['back_forward', 'prerender', 'reload'].includes(navType)) {
            // Cached navigation - fast hide
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            setTimeout(() => loadingScreen.remove(), 200);
            return;
        }
        
        // Fresh load - check resources
        let timeout = 400;
        
        // Check images
        if (document.images.length > 0) {
            const loadingImages = Array.from(document.images).some(img => !img.complete);
            if (loadingImages) timeout = 1200;
        }
        
        // Check dynamic content
        const dynamicContainers = document.querySelectorAll('#games-container, #apps-grid, #search-results, #news-grid');
        const emptyContainers = Array.from(dynamicContainers).every(el => !el.children.length);
        if (emptyContainers) timeout = Math.max(timeout, 800);
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            setTimeout(() => loadingScreen.remove(), 300);
        }, timeout);
    });
    
})();


