// Apps Page JavaScript - Dynamic App Card Generation

// Load Apps Data and Generate Cards
document.addEventListener('DOMContentLoaded', () => {
    loadApps();
});

async function loadApps() {
    const appsGrid = document.getElementById('apps-grid');
    
    try {
        // Show loading skeletons
        showLoadingSkeletons(appsGrid);
        
        // Fetch apps data
        const response = await fetch("./../../data/json/apps-data.json");
        const data = await response.json();
        
        // Hide loading skeletons
        appsGrid.innerHTML = '';
        
        // Generate app cards
        if (data.apps && data.apps.length > 0) {
            data.apps.forEach(app => {
                const appCard = createAppCard(app);
                appsGrid.appendChild(appCard);
            });
        } else {
            showNoAppsMessage(appsGrid);
        }
        
    } catch (error) {
        console.error('Error loading apps:', error);
        appsGrid.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'app-error';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                <h3 style="margin: 0 0 10px 0;">Failed to load apps</h3>
                <p style="margin: 0;">Please check your internet connection and try again.</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        appsGrid.appendChild(errorDiv);
    }
}

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = `app-card ${app.category.toLowerCase()}`;
    card.dataset.slug = app.slug;
    card.dataset.category = app.category.toLowerCase();
    
    // Generate star rating HTML
    const starsHTML = generateStars(app.rating);
    
    card.innerHTML = `
        <div class="app-icon-container">
            <div class="app-icon">
                <span class="material-symbols-rounded">${app.appTypeIcon}</span>
            </div>
        </div>
        
        <div class="app-info">
            <h3 class="app-title">${app.title}</h3>
            <span class="app-category">${app.category}</span>
            
            <div class="app-rating">
                <div class="app-stars">
                    ${starsHTML}
                </div>
                <span class="app-rating-text">${app.rating}/5</span>
            </div>
            
            <p class="app-description">${app.description}</p>
            
            <div class="app-meta">
                <span><i class="fa-solid fa-code-branch"></i> ${app.version}</span>
                <span><i class="fa-solid fa-database"></i> ${app.size}</span>
            </div>
            
            <div class="app-actions">
                <button class="app-download-btn">
                    <i class="fa-solid fa-download"></i>
                    Download
                </button>
                <button class="app-more-info">
                    <i class="fa-solid fa-info-circle"></i>
                    More Info
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    // Half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    // Empty stars to complete 5
    const totalStars = 5;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

function showLoadingSkeletons(container) {
    container.innerHTML = '';
    
    // Create 6 skeleton cards
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'app-card skeleton';
        skeleton.innerHTML = `
            <div class="app-icon-container">
                <div class="app-icon" style="background: linear-gradient(135deg, #f0f0f0, #e0e0e0);">
                    <span class="material-symbols-rounded">apps</span>
                </div>
            </div>
            <div class="app-info">
                <div class="app-title skeleton-line" style="height: 24px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                <div class="app-category skeleton-line" style="height: 20px; width: 80px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 15px;"></div>
                
                <div class="app-rating skeleton-line" style="height: 16px; width: 60%; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 15px;"></div>
                
                <div class="app-description skeleton-line" style="height: 60px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 20px;"></div>
                
                <div class="app-meta" style="margin-bottom: 15px;">
                    <div class="skeleton-line" style="height: 14px; width: 60px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                    <div class="skeleton-line" style="height: 14px; width: 50px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                </div>
                
                <div class="app-actions">
                    <button class="app-download-btn" style="background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; color: transparent; border: none; cursor: default;">
                        Loading...
                    </button>
                    <button class="app-more-info" style="background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; color: transparent; border: none; cursor: default;">
                        Info
                    </button>
                </div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function showNoAppsMessage(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
            <i class="fa-solid fa-box-open" style="font-size: 48px; color: #bdc3c7; margin-bottom: 20px;"></i>
            <h3 style="margin: 0 0 10px 0;">No apps available</h3>
            <p style="margin: 0;">We're working on adding more applications. Please check back soon!</p>
        </div>
    `;
}

// Add shimmer animation for loading skeletons
const style = document.createElement('style');
style.textContent = `
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    .skeleton-line {
        border-radius: 4px;
        margin-bottom: 10px;
    }
    
    .app-card.skeleton {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Category filter functionality
function setupCategoryFilters() {
    const categories = ['all', 'productivity', 'creative', 'entertainment', 'utilities', 'education', 'communication'];
    
    // Create filter buttons if they don't exist
    const existingFilters = document.querySelector('.app-filters');
    if (!existingFilters) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'app-filters';
        filtersContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        `;
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'app-filter-btn';
            button.dataset.category = category;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.style.cssText = `
                padding: 8px 16px;
                border: 1px solid var(--color-border-hr);
                background: var(--color-bg-secondary);
                color: var(--color-text-primary);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            `;
            
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.app-filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                // Filter apps
                filterAppsByCategory(category);
            });
            
            filtersContainer.appendChild(button);
        });
        
        // Add filters above the apps grid
        const appsHeader = document.querySelector('.app-page-header');
        if (appsHeader) {
            appsHeader.parentNode.insertBefore(filtersContainer, appsHeader.nextSibling);
        }
    }
}

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupCategoryFilters();
    loadApps();
});
