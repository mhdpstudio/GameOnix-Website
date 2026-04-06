const sliderTrack = document.querySelector(".slides"); // الحاوية الأساسية
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let current = 0;
let interval;

// إنشاء النقاط (Dots) برمجياً
slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateSlider() {
    // التحريك عن طريق الـ transform بناءً على الـ index الحالي
    // بنضرب رقم السلايد الحالي في 100 عشان يتحرك المسافة المطلوبة
    sliderTrack.style.transform = `translateX(-${current * 100}%)`;

    // تحديث النقاط النشطة فقط
    dots.forEach((d, i) => {
        d.classList.toggle("active", i === current);
    });
}

function goToSlide(index) {
    current = index;
    updateSlider();
    resetAuto();
}

function nextSlide() {
    current = (current + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAuto();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAuto();
});

// التشغيل التلقائي كل 6 ثواني
function startAuto() {
    interval = setInterval(() => {
        nextSlide();
    }, 6000);
}

function resetAuto() {
    clearInterval(interval);
    startAuto();
}

// ابدأ التشغيل عند تحميل الصفحة
startAuto();