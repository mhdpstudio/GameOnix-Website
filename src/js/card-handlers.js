// Card click handlers - IMMEDIATE execution
(function() {
  console.log('🆕 Card handlers LOADED');
  
  function attachHandlers() {
    const cards = document.querySelectorAll('.card[data-slug]');
    console.log('Cards found:', cards.length);
    
    cards.forEach((card, i) => {
      const slug = card.dataset.slug;
      console.log(`Card ${i}: ${slug}`);
      
      // Cursor pointer
      card.style.cursor = 'pointer';
      
      // Img click
      const img = card.querySelector('.game-img');
      if (img) {
        img.style.cursor = 'pointer';
        img.onclick = e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('IMG:', slug);
          window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
        };
      }
      
      // Download btn
      const btn = card.querySelector('.buy');
      if (btn) {
        btn.onclick = e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('BTN:', slug);
          window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
        };
      }
      
      // Card fallback
      card.onclick = e => {
        if (!e.target.closest('.icon') && !e.target.closest('.buy')) {
          console.log('FALLBACK:', slug);
          window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
        }
      };

      // Bug button handler
      const bugBtn = card.querySelector('.icon');
      if (bugBtn) {
        bugBtn.onclick = e => {
          e.preventDefault();
          e.stopPropagation();
          
          // Fetch game data to get version
          fetch("https://www.gameonix.shop/data/json/games-data.json")
              .then(res => res.json())
              .then(data => {
                  const game = data.games.find(g => g.slug === slug);
                  const version = game ? game.version : "Unknown";
                  
                  const subject = encodeURIComponent(`Bug Report: ${slug}`);
                  const body = encodeURIComponent(
                      `
Game: ${slug}
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
                  console.error('Error fetching game data:', err);
                  
                  // Fallback to basic bug report without version
                  const subject = encodeURIComponent(`Bug Report: ${slug}`);
                  const body = encodeURIComponent(
                      `
Game: ${slug}
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
  }
  
  // Attach immediately + DOMContentLoaded + load
  attachHandlers();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  }
  window.addEventListener('load', attachHandlers);
  
  // Re-attach after reloads
  setInterval(attachHandlers, 1000);
  
  console.log('✅ All card systems ready!');
})();

