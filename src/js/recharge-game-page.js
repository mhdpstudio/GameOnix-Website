(function () {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("game");

    let data = [];
    let selectedPack = null;
    let currentGame = null;
    let packsMap = {};

    const modal = document.getElementById("successModal");
    const closeModal = document.getElementById("closeModal");

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

    async function loadGame() {
        try {
            const res = await fetch("../../data/json/recharge.json");
            data = await res.json();

            const game = data.find(g => g.id === gameId);
            if (!game) return;

            currentGame = game;

            // reset map
            packsMap = {};

            game.packs.forEach(p => {
                packsMap[p.title.trim()] = p;
            });

            document.getElementById("gameTitle").textContent = game.name;
            document.getElementById("gameImage").src = game.image;

            const container = document.getElementById("packsContainer");

            container.innerHTML = game.packs.map((pack) => `
                <div class="pack-btn" data-pack="${pack.title}">
                    <span>${pack.title}</span>
                    <small>${pack.type}</small>
                </div>
            `).join("");

            const packButtons = document.querySelectorAll(".pack-btn");

            packButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    selectPack(btn.dataset.pack.trim(), btn);
                });
            });

            // ✅ FIX: ensure DOM is ready before auto select
            setTimeout(() => {
                if (packButtons.length > 0) {
                    selectPack(
                        packButtons[0].dataset.pack.trim(),
                        packButtons[0]
                    );
                }
            }, 0);

            createForm(container, game.name);

        } catch (err) {
            console.error("Error loading game data:", err);
        }
    }

    function selectPack(packTitle, element) {
        selectedPack = packTitle;

        document.querySelectorAll(".pack-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        element.classList.add("active");

        const pack = packsMap[packTitle];

        const amountEl = document.getElementById("selectedAmount");
        const priceEl = document.getElementById("selectedPrice");

        if (!pack) {
            console.warn("Pack not found:", packTitle);
            return;
        }

        if (amountEl) amountEl.textContent = pack.title + " " +pack.type || "-";
        if (priceEl) {
            const price = pack.price ?? 0;
            const oldPrice = pack.oldPrice ?? pack.originalPrice;

            if (oldPrice && oldPrice > price) {
                priceEl.innerHTML = `
            <span class="old-price">${oldPrice} EGP</span>
            <span class="new-price">${price} EGP</span>
        `;
            } else {
                priceEl.innerHTML = `<span class="new-price">${price} EGP</span>`;
            }
        }
    }

    function createForm(parent, gameName) {
        const form = document.createElement("form");
        form.className = "checkout-form";

        form.innerHTML = `
            <h3 class="form-title">
                <i class="fa-solid fa-circle-info"></i> Checkout Details
            </h3>

            <!-- INFO BOX -->
            <div class="selected-info">
                <div class="info-box">
                    <span class="label">Amount</span>
                    <span class="value" id="selectedAmount">-</span>
                </div>

                <div class="info-box">
                    <span class="label">Price</span>
                    <span class="value" id="selectedPrice">-</span>
                </div>
            </div>

            <div class="row">
                <input name="firstName" type="text" placeholder="First Name" required />
                <input name="lastName" type="text" placeholder="Last Name" required />
            </div>

            <div class="row">
                <input name="phone" type="tel" placeholder="Phone Number" required />
                <input name="email" type="email" placeholder="Email Address" required />
            </div>

            <input name="gameId" type="text" class="game-id" placeholder="Your Game ID" required />

            <textarea name="details" placeholder="Additional Details..."></textarea>

            <button type="submit" class="submit-btn">
                <i class="fa-solid fa-paper-plane"></i> Submit
            </button>
        `;

        parent.appendChild(form);
        initPopup();

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector(".submit-btn");
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "TRANSMITTING...";
            submitBtn.disabled = true;

            const formData = new URLSearchParams();
            formData.append("firstName", form.firstName.value);
            formData.append("lastName", form.lastName.value);
            formData.append("phone", form.phone.value);
            formData.append("email", form.email.value);
            formData.append("gameIdField", form.gameId.value);
            formData.append("details", form.details.value);
            formData.append("selectedPack", selectedPack);
            formData.append("gameName", gameName);
            formData.append("orderId", "ORD-" + Date.now());

            try {
                await fetch(
                    "https://script.google.com/macros/s/AKfycbyh0j-RcL8aMYQNgZ9jAbRSbTz3XrKg_4G7Wgktm2prMbJdkQZd-0TWSC-tPKxz-8wL/exec",
                    {
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: formData.toString()
                    }
                );

                if (modal) {
                    modal.classList.add("active");
                    document.body.style.overflow = "hidden";
                }

                form.reset();

                // reset UI labels after submit
                const amountEl = document.getElementById("selectedAmount");
                const priceEl = document.getElementById("selectedPrice");

                if (amountEl) amountEl.textContent = "-";
                if (priceEl) priceEl.textContent = "-";

            } catch (error) {
                console.error("Submission Error:", error);
                alert("Connection Error! Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    loadGame();

})();