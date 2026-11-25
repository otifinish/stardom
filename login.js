
// Get the registration form
const registerForm = document.getElementById("registerForm");

// Check if the registration form exists
if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get the user's details
        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check that all fields are filled
        if (!fullname || !email || !phone || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Check password length
        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }

        // Check whether passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Registration form validated successfully!");

        // We will connect this to a secure registration service later.
    });
}
