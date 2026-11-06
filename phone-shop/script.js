
const repairForm = document.getElementById("repairForm");
const message = document.getElementById("message");

// Your WhatsApp number 
const whatsappNumber = "2349049465038";

if (repairForm) {
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
            "Problem Started: " + problemTime + "\n" +
            "Additional Details: " + (details || "Not provided");

        const whatsappURL =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(repairMessage);

        window.open(whatsappURL, "_blank");

        message.textContent =
            "WhatsApp opened! Please send the repair request there.";
        message.style.color = "green";
    });
}
