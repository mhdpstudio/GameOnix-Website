// App Card Handlers - Based on card-handlers.js structure

// App Card Click Handler
document.addEventListener('click', (e) => {
    const appCard = e.target.closest('.app-card');
    if (!appCard) return;

    const appSlug = appCard.dataset.slug;
    if (!appSlug) return;

    // Navigate to app page
    window.location.href = `app-page.html?app=${encodeURIComponent(appSlug)}`;
});

// App Download Button Handler
document.addEventListener('click', (e) => {
    const downloadBtn = e.target.closest('.app-download-btn');
    if (!downloadBtn) return;

    const appCard = downloadBtn.closest('.app-card');
    const appSlug = appCard?.dataset.slug;
    
    if (appSlug) {
        // Get app data and redirect to download
        fetch("./../../data/json/apps-data.json")
            .then(res => res.json())
            .then(data => {
                const app = data.apps.find(a => a.slug === appSlug);
                if (app) {
                    window.open(app.appLink, '_blank');
                }
            })
            .catch(err => console.error('Error fetching app data:', err));
    }
});

// App More Info Button Handler
document.addEventListener('click', (e) => {
    const moreInfoBtn = e.target.closest('.app-more-info');
    if (!moreInfoBtn) return;

    const appCard = moreInfoBtn.closest('.app-card');
    const appSlug = appCard?.dataset.slug;
    
    if (appSlug) {
        // Navigate to app page
        window.location.href = `app-page.html?app=${encodeURIComponent(appSlug)}`;
    }
});

// App Rating Stars Handler
document.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.app-stars i');
    if (!star) return;

    const starsContainer = star.parentElement;
    const allStars = starsContainer.querySelectorAll('i');
    const currentStarIndex = Array.from(allStars).indexOf(star);

    // Highlight stars up to current star
    allStars.forEach((s, index) => {
        if (index <= currentStarIndex) {
            s.style.color = '#f39c12';
            s.style.transform = 'scale(1.2)';
        } else {
            s.style.color = '#bdc3c7';
            s.style.transform = 'scale(1)';
        }
    });
});

document.addEventListener('mouseout', (e) => {
    const starsContainer = e.target.closest('.app-stars');
    if (!starsContainer) return;

    const allStars = starsContainer.querySelectorAll('i');
    allStars.forEach(s => {
        s.style.color = '#f39c12';
        s.style.transform = 'scale(1)';
    });
});

// App Category Filter Handler (if implemented)
function filterAppsByCategory(category) {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// App Search Handler (if implemented)
function searchApps(query) {
    const appCards = document.querySelectorAll('.app-card');
    const searchTerm = query.toLowerCase();
    
    appCards.forEach(card => {
        const title = card.querySelector('.app-title').textContent.toLowerCase();
        const description = card.querySelector('.app-description').textContent.toLowerCase();
        const category = card.querySelector('.app-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// App Hover Effects
document.addEventListener('mouseover', (e) => {
    const appCard = e.target.closest('.app-card');
    if (!appCard) return;

    // Add subtle glow effect
    appCard.style.boxShadow = '0 15px 30px rgba(105, 92, 254, 0.3)';
    appCard.style.transform = 'translateY(-8px) scale(1.02)';
});

document.addEventListener('mouseout', (e) => {
    const appCard = e.target.closest('.app-card');
    if (!appCard) return;

    // Reset to original state
    appCard.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    appCard.style.transform = 'translateY(0) scale(1)';
});

// App Loading Animation
function createAppSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'app-card skeleton';
    skeleton.innerHTML = `
        <div class="app-icon-container">
            <div class="app-icon" style="background: #f0f0f0; color: #ccc;">
                <i class="fa-solid fa-cube"></i>
            </div>
        </div>
        <div class="app-info">
            <div class="app-title" style="height: 24px; background: #f0f0f0; border-radius: 4px; margin-bottom: 8px;"></div>
            <div class="app-category" style="height: 20px; width: 80px; background: #f0f0f0; border-radius: 20px; margin-bottom: 15px;"></div>
            <div class="app-description" style="height: 60px; background: #f0f0f0; border-radius: 4px; margin-bottom: 20px;"></div>
            <div class="app-actions">
                <button class="app-download-btn" style="background: #f0f0f0; color: #ccc; border: none; cursor: default;">Loading...</button>
                <button class="app-more-info" style="background: #f0f0f0; color: #ccc; border: none; cursor: default;">Info</button>
            </div>
        </div>
    `;
    return skeleton;
}

// App Error Handling
function handleAppError(error) {
    console.error('App error:', error);
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'app-error';
    errorDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
            <h3 style="margin: 0 0 10px 0;">Oops! Something went wrong</h3>
            <p style="margin: 0;">We're having trouble loading the app data. Please try again later.</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
    
    return errorDiv;
}

// App Success Animation
function showAppSuccess(message) {
    const successToast = document.createElement('div');
    successToast.className = 'app-success-toast';
    successToast.innerHTML = `
        <div style="background: #2ecc71; color: white; padding: 15px 20px; border-radius: 8px; position: fixed; bottom: 20px; right: 20px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successToast);
    
    setTimeout(() => {
        successToast.style.opacity = '0';
        setTimeout(() => successToast.remove(), 300);
    }, 3000);
}

// App Share Handler
function shareApp(appSlug) {
    fetch("./../../data/json/apps-data.json")
        .then(res => res.json())
        .then(data => {
            const app = data.apps.find(a => a.slug === appSlug);
            if (app) {
                const shareUrl = `${window.location.origin}/app-page.html?app=${encodeURIComponent(appSlug)}`;
                const shareText = `Check out ${app.title} - ${app.description}`;
                
                if (navigator.share) {
                    navigator.share({
                        title: app.title,
                        text: shareText,
                        url: shareUrl
                    });
                } else {
                    // Fallback for browsers that don't support Web Share API
                    const popup = document.getElementById('sharePopup');
                    const shareLink = document.getElementById('shareLink');
                    const copyBtn = document.getElementById('copyBtn');
                    
                    if (popup && shareLink && copyBtn) {
                        shareLink.value = shareUrl;
                        popup.classList.add('active');
                        
                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(shareUrl);
                            copyBtn.textContent = "Copied ✓";
                            setTimeout(() => copyBtn.textContent = "Copy", 1500);
                        };
                    }
                }
            }
        })
        .catch(err => console.error('Error sharing app:', err));
}

// Initialize app handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('App handlers initialized');
});
