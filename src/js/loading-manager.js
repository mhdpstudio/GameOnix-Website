// Universal loading manager
(function() {
    'use strict';
    
    // Create loading screen
    if (!document.getElementById('loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div></div>
            <p>Loading...</p>
        `;
        document.body.prepend(loadingScreen);
    }
    
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide function
    const hideLoading = () => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        setTimeout(() => loadingScreen.remove(), 300);
    };
    
    window.addEventListener('load', () => {
        if (['back_forward', 'prerender', 'reload'].includes(performance.getEntriesByType('navigation')[0]?.type || 'navigate')) {
            hideLoading();
            return;
        }
        
        // Video page - wait until video is ready
        if (document.querySelector('#video-container')) {
            // Wait 2s min + video ready
            const minWait = new Promise(r => setTimeout(r, 2000));
            
            Promise.all([
                minWait,
                new Promise((resolve) => {
                    const video = document.querySelector('.main-video');
                    if (video && video.readyState >= 3) {
                        resolve();
                    } else {
                        const handler = () => {
                            document.removeEventListener('video-ready', handler);
                            resolve();
                        };
                        document.addEventListener('video-ready', handler);
                        setTimeout(resolve, 10000); // Max 10s
                    }
                })
            ]).then(hideLoading);
            return;
        }
        
        // Other pages - normal timeout
        setTimeout(hideLoading, 1200);
    });
})();

