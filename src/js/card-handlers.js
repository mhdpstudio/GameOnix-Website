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

