(function () {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("game");
    const packTitle = params.get("pack");

    // رابط السكريبت الخاص بك (تأكد من تحديثه دائماً بعد أي Deploy جديد)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyh0j-RcL8aMYQNgZ9jAbRSbTz3XrKg_4G7Wgktm2prMbJdkQZd-0TWSC-tPKxz-8wL/exec";

    const modal = document.getElementById("successModal");
    const closeModal = document.getElementById("closeModal");

    // تهيئة الـ Popup
    function initPopup() {
        if (!modal || !closeModal) return;

        closeModal.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }

    async function loadPack() {
        try {
            const res = await fetch("../../data/json/recharge.json");
            const data = await res.json();

            const game = data.find(g => g.id === gameId);
            if (!game) return;

            const pack = game.packs.find(p => p.title === packTitle);
            if (!pack) return;

            // تحديث واجهة العرض
            if (document.getElementById("gameName")) {
                document.getElementById("gameName").textContent = game.name;
            }
            if (document.getElementById("packImage")) {
                document.getElementById("packImage").src = pack.img;
            }

            // منطق عرض السعر
            const priceBox = document.getElementById("priceBox");
            if (priceBox) {
                const price = pack.price ?? 0;
                const oldPrice = pack.oldPrice ?? pack.originalPrice;

                if (oldPrice && oldPrice > price) {
                    priceBox.innerHTML = `
                        <span class="old-price">${oldPrice} EGP</span>
                        <span class="new-price">${price} EGP</span>
                    `;
                } else {
                    priceBox.innerHTML = `<span class="new-price">${price} EGP</span>`;
                }
            }

            createForm(game.name, pack);
        } catch (err) {
            console.error("Error loading data:", err);
        }
    }

    function createForm(gameName, pack) {
        const container = document.getElementById("formContainer");
        if (!container) return;

        const price = pack.price ?? 0;
        const oldPrice = pack.oldPrice ?? pack.originalPrice;

        const priceHTML = (oldPrice && oldPrice > price)
            ? `<span class="old-price">${oldPrice} EGP</span> <span class="new-price">${price} EGP</span>`
            : `<span class="new-price">${price} EGP</span>`;

        const form = document.createElement("form");
        form.className = "checkout-form";

        form.innerHTML = `
            <div class="selected-info">
                <div class="info-box">
                    <span class="label">Amount</span>
                    <span class="value" id="selectedAmount">${pack.title} ${pack.type}</span>
                </div>

                <div class="info-box">
                    <span class="label">Price</span>
                    <span class="value" id="selectedPrice">${priceHTML}</span>
                </div>
            </div>

            <div class="row">
                <input name="firstName" type="text" placeholder="First Name" required>
                <input name="lastName" type="text" placeholder="Last Name" required>
            </div>

            <div class="row">
                <input name="phone" type="tel" placeholder="Phone Number" required>
                <input name="email" type="email" placeholder="Email Address" required>
            </div>

            <input name="gameId" type="text" placeholder="Game ID" required>
            <textarea id="details" name="details" placeholder="Additional Details"></textarea>

            <button type="submit" class="submit-btn">
                <i class="fa-solid fa-paper-plane"></i> Submit
            </button>
        `;

        container.appendChild(form);
        initPopup(); // تفعيل إغلاق البوب اب بعد إنشاء الفورم

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // منع الريلود

            const btn = form.querySelector(".submit-btn");
            const oldContent = btn.innerHTML;

            btn.innerHTML = "TRANSMITTING...";
            btn.disabled = true;

            // تجميع البيانات بصيغة URLSearchParams لضمان وصول الإيميل
            const formData = new URLSearchParams();
            formData.append("firstName", form.firstName.value);
            formData.append("lastName", form.lastName.value);
            formData.append("phone", form.phone.value);
            formData.append("email", form.email.value);
            formData.append("gameIdField", form.gameId.value); // الاسم المتوافق مع سكريبت جوجل
            formData.append("details", form.details.value);
            formData.append("gameName", gameName);
            formData.append("selectedPack", pack.title); // الاسم المتوافق مع السكريبت
            formData.append("orderId", "ORD-" + Date.now());

            try {
                await fetch(SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors", // مهم جداً مع جوجل سكريبت
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString()
                });

                // فتح الـ Popup بنجاح
                if (modal) {
                    modal.classList.add("active");
                    document.body.style.overflow = "hidden";
                }

                form.reset();

            } catch (err) {
                console.error("Fetch Error:", err);
                alert("Connection Error! Please try again.");
            } finally {
                btn.innerHTML = oldContent;
                btn.disabled = false;
            }
        });
    }

    loadPack();
})();