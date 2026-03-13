// Apps Page - Dynamic App Card Generation
(function() {
    console.log('🆕 Apps Page LOADED');
    
    const appsGrid = document.getElementById('apps-grid');
    
    // Function to get category class based on app category
    function getCategoryClass(category) {
        const categoryMap = {
            'Productivity': 'productivity',
            'Creative': 'creative', 
            'Entertainment': 'entertainment',
            'Utilities': 'utilities',
            'Education': 'education'
        };
        
        return categoryMap[category] || 'productivity'; // Default to productivity
    }
    
    // Function to generate star rating HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fa-solid fa-star"></i>';
            } else if (i === fullStars && hasHalf) {
                stars += '<i class="fa-solid fa-star-half-stroke"></i>';
            } else {
                stars += '<i class="fa-regular fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Function to create app card HTML
    function createAppCard(app) {
        return `
            <div class="app-card ${getCategoryClass(app.category)}" data-slug="${app.slug}">
                <div class="app-icon-container">
                    <div class="app-icon">
                        <i class="${app.appTypeIcon}"></i>
                    </div>
                </div>
                <div class="app-info">
                    <h3 class="app-title">${app.title}</h3>
                    <span class="app-category">${app.category}</span>
                    <p class="app-description">${app.description}</p>
                    
                    <div class="app-rating">
                        <div class="app-stars">
                            ${generateStars(app.rating)}
                        </div>
                        <span class="app-rating-text">${app.rating}/5</span>
                    </div>

                    <div class="app-meta">
                        <span><i class="fa-solid fa-download"></i> ${app.downloads}</span>
                        <span><i class="fa-solid fa-file"></i> ${app.size}</span>
                    </div>

                    <div class="app-actions">
                        <button class="app-download-btn">
                            <i class="fa-solid fa-download"></i>
                            Download
                        </button>
                        <button class="app-more-info">More Info</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to load and display apps
    async function loadApps() {
        try {
            const response = await fetch('https://www.gameonix.shop/data/json/apps-data.json');
            const data = await response.json();
            
            if (!appsGrid) {
                console.error('Apps grid container not found');
                return;
            }
            
            // Clear existing content
            appsGrid.innerHTML = '';
            
            // Generate cards for all apps
            data.apps.forEach(app => {
                const cardHTML = createAppCard(app);
                appsGrid.innerHTML += cardHTML;
            });
            
            console.log(`✅ Loaded ${data.apps.length} apps`);
            
            // Re-attach handlers after DOM update
            if (window.attachAppHandlers) {
                window.attachAppHandlers();
            }
            
        } catch (error) {
            console.error('Error loading apps:', error);
            appsGrid.innerHTML = '<div class="no-results"><p>Error loading apps. Please try again later.</p></div>';
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadApps);
    } else {
        loadApps();
    }
    
    // Expose function globally for re-use
    window.loadApps = loadApps;
    
    console.log('✅ Apps page system ready!');
})();