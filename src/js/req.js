document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.game-form');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // منع الريلود والانتقال لصفحة تانية

            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = "TRANSMITTING...";
            submitBtn.disabled = true;

            const formData = new FormData(this);

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // فتح الـ Popup ومسح الفورم
                    modal.classList.add('active');
                    this.reset();
                } else {
                    alert('Error: Submission failed.');
                }
            } catch (error) {
                alert('Connection Error!');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // إغلاق الـ Popup
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
});