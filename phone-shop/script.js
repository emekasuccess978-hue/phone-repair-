
const repairForm = document.getElementById("repairForm");
const message = document.getElementById("message");

// Replace this with your WhatsApp number.
// Include your country code without the + sign.
// Example format for Nigeria: 2348012345678
const whatsappNumber = "2349049465038";

repairForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const phoneName = document.getElementById("phoneName").value.trim();
    const modelNumber = document.getElementById("modelNumber").value.trim();
    const problem = document.getElementById("problem").value;
    const problemTime = document.getElementById("problemTime").value;
    const details = document.getElementById("details").value.trim();

    if (!phoneName || !modelNumber || !problem || !problemTime) {
        message.textContent = "Please fill in all required fields.";
        message.style.color = "red";
        return;
    }

    const repairMessage =
        "NEW PHONE REPAIR REQUEST\n\n" +
        "Phone Name: " + phoneName + "\n" +
        "Model Number: " + modelNumber + "\n" +
        "Problem: " + problem + "\n" +
        "Additional Details: " + (details || "Not provided");

    const whatsappURL =
        "https://wa.me/" + whatsappNumber +
        "?text=" + encodeURIComponent(repairMessage);

    window.open(whatsappURL, "_blank");

    message.textContent =
        "WhatsApp opened! Please send the repair request there.";
    message.style.color = "green";
});
// IMAGE SLIDER

let slideIndex = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

// Display a particular slide
function showSlide(index) {

    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    // Add active class to selected slide
    slides[index].classList.add("active");
    dots[index].classList.add("active");
}

// Move to previous or next slide
function changeSlide(direction) {

    slideIndex += direction;

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    showSlide(slideIndex);
}

// Go directly to a selected slide
function currentSlide(index) {

    slideIndex = index;
    showSlide(slideIndex);
}

// Automatically change images every 4 seconds
setInterval(function() {

    changeSlide(1);

}, 4000);