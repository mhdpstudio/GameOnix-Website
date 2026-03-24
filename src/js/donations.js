const donationPopup = document.getElementById("donation-popup");
const donationTitle = document.getElementById("donation-title");

// single
const donationInput = document.getElementById("donation-input");
const donationCopy = document.getElementById("donation-copy");

// bank
const ibanInput = document.getElementById("donation-iban");
const swiftInput = document.getElementById("donation-swift");
const bankInputs = document.getElementById("bank-inputs");
const singleInput = document.getElementById("single-input");

const copyIban = document.getElementById("copy-iban");
const copySwift = document.getElementById("copy-swift");

const donationClose = document.getElementById("donation-close");


// ✅ popup عادي (حالة واحدة)
function openDonationPopup(title, value) {
    donationPopup.classList.add("active");
    donationTitle.textContent = title;

    singleInput.style.display = "flex";
    bankInputs.style.display = "none";

    donationInput.value = value;
}


// ✅ popup البنك (IBAN + SWIFT)
function openBankPopup(title, data) {
    donationPopup.classList.add("active");
    donationTitle.textContent = title;

    singleInput.style.display = "none";
    bankInputs.style.display = "block";

    ibanInput.value = data.iban;
    swiftInput.value = data.swift;
}


// Copy single
donationCopy.addEventListener("click", () => {
    donationInput.select();
    document.execCommand("copy");
    donationCopy.textContent = "Copied!";
    setTimeout(() => donationCopy.textContent = "Copy", 1500);
});

// Copy IBAN
copyIban.addEventListener("click", () => {
    ibanInput.select();
    document.execCommand("copy");
    copyIban.textContent = "Copied!";
    setTimeout(() => copyIban.textContent = "Copy IBAN", 1500);
});

// Copy SWIFT
copySwift.addEventListener("click", () => {
    swiftInput.select();
    document.execCommand("copy");
    copySwift.textContent = "Copied!";
    setTimeout(() => copySwift.textContent = "Copy SWIFT", 1500);
});


// Close
donationClose.addEventListener("click", () => {
    donationPopup.classList.remove("active");
});

// click outside
donationPopup.addEventListener("click", (e) => {
    if (e.target === donationPopup) {
        donationPopup.classList.remove("active");
    }
});

function openLink(url) {
    window.open(url, "_blank");
}