const slots = document.querySelectorAll(".ad-slot");

const adScriptSrc = "https://pl29012271.profitablecpmratenetwork.com/46/77/cf/4677cfadbef65ba094336c75655ba39b.js";
const adKey = "95ccbecea9239e3ff672f846ce4d1fc1";

function loadAd(slot) {
    const s1 = document.createElement("script");
    s1.src = adScriptSrc;

    const s2 = document.createElement("script");
    s2.innerHTML = `
        window.atOptions = {
            key: "${adKey}",
            format: "iframe",
            height: 90,
            width: 728,
            params: {}
        };
    `;

    const s3 = document.createElement("script");
    s3.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;

    slot.appendChild(s2);
    slot.appendChild(s1);
    slot.appendChild(s3);
}

// ⏱️ مهم جدًا: فرق وقت بين كل إعلان
slots.forEach((slot, i) => {
    setTimeout(() => {
        loadAd(slot);
    }, i * 1500); // 1.5 ثانية بين كل إعلان
});