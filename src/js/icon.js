(function () {
    // قائمة بالمسارات المحتملة للوصول لفولدر الـ assets من أي مكان في الموقع
    const potentialPaths = [
        'assets/images/logo.png',         // لو الصفحة في الـ root
        '../assets/images/logo.png',      // لو الصفحة جوه فولدر واحد (زي صفحاتك الحالية)
        '../../assets/images/logo.png',   // لو الصفحة جوه فولدرين
        '../../../assets/images/logo.png' // للاحتياط
    ];

    // وظيفة للتحقق من وجود الصورة وتعيينها كـ Favicon
    async function setFavicon() {
        for (const path of potentialPaths) {
            try {
                const response = await fetch(path, { method: 'HEAD' });
                if (response.ok) {
                    // إذا وجد المسار الصحيح، قم بإنشاء الـ link tag
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = path;
                    link.type = 'image/png';
                    console.log('Favicon set from: ' + path);
                    break; // توقف بمجرد إيجاد المسار الصح
                }
            } catch (e) {
                // استمر في البحث في المسار التالي
            }
        }
    }

    setFavicon();
})();