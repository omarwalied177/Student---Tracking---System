document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll("input, select");
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const studentImage = document.getElementById("studentImage");
    const studentImagePreview = document.getElementById("studentImagePreview");

    // Toggle password visibility
    togglePassword.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.innerHTML = type === "password" ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });

    // Preview uploaded image
    studentImage.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                studentImagePreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form validation
    form.addEventListener("submit", function (event) {
        let isValid = true;

        // Validate all inputs
        inputs.forEach((input) => {
            const feedback = input.nextElementSibling; 
            if (!feedback || !feedback.classList.contains("invalid-feedback")) return;

            if (input.type === "text" || input.type === "email" || input.type === "date") {
                if (!input.value.trim()) {
                    showError(input, "This field is required.");
                    isValid = false;
                } else {
                    removeError(input);
                }
            }

            if (input.type === "tel") {
                if (!phoneRegex.test(input.value.trim())) {
                    showError(input, "Phone number must be 11 digits and start with 010, 011, 012, or 015.");
                    isValid = false;
                } else {
                    removeError(input);
                }
            }

            if (input.id === "password") {
                if (!passwordRegex.test(input.value.trim())) {
                    showError(input, "Password must be at least 6 characters long, containing letters, numbers, and a special character.");
                    isValid = false;
                } else {
                    removeError(input);
                }
            }

            if (input.tagName === "SELECT") {
                if (!input.value) {
                    showError(input, "Please select an option.");
                    isValid = false;
                } else {
                    removeError(input);
                }
            }
        });

        // Validate gender selection
        const genderInputs = document.querySelectorAll("input[name='gender']");
        const genderFeedback = document.querySelector("input[name='gender']").closest(".mb-3").querySelector(".invalid-feedback");

        if (![...genderInputs].some((input) => input.checked)) {
            showError(genderInputs[0], "Please select a gender.", genderFeedback);
            isValid = false;
        } else {
            removeError(genderInputs[0], genderFeedback);
        }

        if (!isValid) {
            event.preventDefault(); 
            return;
        }

        event.preventDefault();
        
        // Show success message
        Swal.fire({
            title: "Success!",
            text: "The student has been registered successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "var(--primary-color)",
            showCancelButton: true,
            cancelButtonText: "Add Another",
            customClass: {
                popup: "custom-popup",
                confirmButton: "custom-confirm-btn",
                cancelButton: "btn-outline-primary"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "StudentManagement.html";
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                form.reset();
                studentImagePreview.src = "../img/default-student.png";
            }
        });
    });

    function showError(input, message, feedbackElement = null) {
        const feedback = feedbackElement || input.nextElementSibling;
        input.classList.add("is-invalid");
        feedback.textContent = message;
        feedback.style.display = "block";
    }

    function removeError(input, feedbackElement = null) {
        const feedback = feedbackElement || input.nextElementSibling;
        input.classList.remove("is-invalid");
        feedback.style.display = "none";
    }
});