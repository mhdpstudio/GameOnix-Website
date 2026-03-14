// Add popup functionality to app-page.html
document.addEventListener('DOMContentLoaded', () => {
  const shareBtn = document.querySelector('.share-btn');
  const bugBtn = document.querySelector('.bug-btn');
  const popup = document.getElementById('sharePopup');
  const shareLink = document.getElementById('shareLink');
  const copyBtn = document.getElementById('copyBtn');
  const closeBtn = document.querySelector('.close-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      shareLink.value = window.location.href;
      popup.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
    });
  }

  if (popup) {
    popup.addEventListener('click', e => {
      if (e.target === popup) popup.classList.remove('active');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shareLink.value).then(() => {
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => copyBtn.textContent = 'Copy', 1500);
      });
    });
  }

  if (bugBtn) {
    bugBtn.addEventListener('click', () => {
      const appTitle = document.querySelector('.game-name')?.textContent || 'Unknown App';
      const subject = encodeURIComponent(`Bug Report: ${appTitle}`);
      const body = encodeURIComponent(`
App: ${appTitle}
Page: ${window.location.href}

Describe the problem:
`);
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`, '_blank');
    });
  }
});
