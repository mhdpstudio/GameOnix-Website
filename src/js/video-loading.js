// Video page dedicated loading manager
(function() {
    'use strict';
    
    // Create video-specific loading screen
    if (!document.getElementById('video-loading')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'video-loading';
        loadingScreen.innerHTML = `
            <div class="video-loader-spinner"></div>
            <div class="video-loader-text">Loading video...</div>
            <div class="video-loader-progress">
                <div class="video-loader-progress-fill"></div>
            </div>
        `;
        document.body.appendChild(loadingScreen);
    }
    
    const loadingScreen = document.getElementById('video-loading');
    
    // Hide loading with smooth animation
    const hideLoading = () => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 600);
    };
    
    // Video ready events
    const events = ['video-ready', 'sidebar-ready'];
    
    let readyCount = 0;
    
    events.forEach(eventName => {
        document.addEventListener(eventName, () => {
            readyCount++;
            const progress = Math.min(readyCount / events.length * 100, 100);
            loadingScreen.querySelector('.video-loader-progress-fill').style.width = progress + '%';
            
            if (readyCount >= events.length || progress >= 100) {
                setTimeout(hideLoading, 800); // Final delay
            }
        }, { once: true });
    });
    
    // Fallback timeout (12s max)
    setTimeout(() => {
        readyCount = events.length;
        hideLoading();
    }, 12000);
    
    console.log('Video loading manager active - waiting for content...');
})();

