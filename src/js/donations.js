const donationPopup = document.getElementById("donation-popup");
const donationTitle = document.getElementById("donation-title");
const donationInput = document.getElementById("donation-input");
const donationCopy = document.getElementById("donation-copy");
const donationClose = document.getElementById("donation-close");

function openDonationPopup(title, value) {
    donationPopup.classList.add("active");
    donationTitle.textContent = title;
    donationInput.value = value;
}

// Copy
donationCopy.addEventListener("click", () => {
    donationInput.select();
    document.execCommand("copy");
    donationCopy.textContent = "Copied!";
    setTimeout(() => donationCopy.textContent = "Copy", 1500);
});

// Close
donationClose.addEventListener("click", () => {
    donationPopup.classList.remove("active");
});

// click outside to close
donationPopup.addEventListener("click", (e) => {
    if (e.target === donationPopup) {
        donationPopup.classList.remove("active");
    }
});

function openLink(url) {
    window.open(url, "_blank");
}