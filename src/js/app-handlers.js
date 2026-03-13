// App Card click handlers - IMMEDIATE execution
(function() {
    console.log('🆕 App handlers LOADED');
    
    window.attachAppHandlers = function() {
        const appCards = document.querySelectorAll('.app-card[data-slug]');
        console.log('App cards found:', appCards.length);
        
        appCards.forEach((card, i) => {
            const slug = card.dataset.slug;
            console.log(`App card ${i}: ${slug}`);
            
            // Cursor pointer
            card.style.cursor = 'pointer';
            
            // App icon click
            const appIcon = card.querySelector('.app-icon');
            if (appIcon) {
                appIcon.style.cursor = 'pointer';
                appIcon.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('APP ICON:', slug);
                    window.location.href = `app-page.html?app=${encodeURIComponent(slug)}`;
                };
            }
            
            // Download button click
            const downloadBtn = card.querySelector('.app-download-btn');
            if (downloadBtn) {
                downloadBtn.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('DOWNLOAD BTN:', slug);
                    window.location.href = `app-page.html?app=${encodeURIComponent(slug)}`;
                };
            }
            
            // More Info button click
            const moreInfoBtn = card.querySelector('.app-more-info');
            if (moreInfoBtn) {
                moreInfoBtn.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('MORE INFO:', slug);
                    window.location.href = `app-page.html?app=${encodeURIComponent(slug)}`;
                };
            }
            
            // Card fallback click
            card.onclick = e => {
                if (!e.target.closest('.app-download-btn') && !e.target.closest('.app-more-info')) {
                    console.log('CARD FALLBACK:', slug);
                    window.location.href = `app-page.html?app=${encodeURIComponent(slug)}`;
                }
            };

            // Bug button handler (if exists)
            const bugBtn = card.querySelector('.bug-btn');
            if (bugBtn) {
                bugBtn.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Fetch app data to get version
                    fetch("https://www.gameonix.shop/data/json/apps-data.json")
                        .then(res => res.json())
                        .then(data => {
                            const app = data.apps.find(a => a.slug === slug);
                            const version = app ? app.version : "Unknown";
                            
                            const subject = encodeURIComponent(`Bug Report: ${slug}`);
                            const body = encodeURIComponent(
                                `
App: ${slug}
Version: ${version}
_______________________________________________________________________________________________________

Describe the problem:
`
                            );

                            const gmailURL =
                                `https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`;

                            if (window.electronAPI) {
                                // Electron environment - open in default browser
                                window.electronAPI.openExternal(gmailURL);
                            } else {
                                // Web environment - open in new tab
                                window.open(gmailURL, "_blank");
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching app data:', err);
                            
                            // Fallback to basic bug report without version
                            const subject = encodeURIComponent(`Bug Report: ${slug}`);
                            const body = encodeURIComponent(
                                `
App: ${slug}
Version: Unknown
_______________________________________________________________________________________________________

Describe the problem:
`
                            );

                            const gmailURL =
                                `https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`;

                            if (window.electronAPI) {
                                // Electron environment - open in default browser
                                window.electronAPI.openExternal(gmailURL);
                            } else {
                                // Web environment - open in new tab
                                window.open(gmailURL, "_blank");
                            }
                        });
                };
            }
        });
    };
    
    // Attach immediately + DOMContentLoaded + load
    window.attachAppHandlers();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.attachAppHandlers);
    }
    window.addEventListener('load', window.attachAppHandlers);
    
    // Re-attach after reloads
    setInterval(window.attachAppHandlers, 1000);
    
    console.log('✅ All app card systems ready!');
})();
