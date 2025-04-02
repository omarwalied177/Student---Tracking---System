document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addTeacherForm");
    const inputs = form.querySelectorAll("input, select");
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    const teacherImage = document.getElementById("teacherImage");
    const teacherImagePreview = document.getElementById("teacherImagePreview");

    // Preview uploaded image
    teacherImage.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                teacherImagePreview.src = event.target.result;
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

            if (input.type === "text" || input.type === "email" || input.type === "date" || input.type === "number") {
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
            text: "The teacher has been registered successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "var(--accent-color)",
            showCancelButton: true,
            cancelButtonText: "Add Another",
            customClass: {
                popup: "custom-popup",
                confirmButton: "custom-confirm-btn",
                cancelButton: "btn-outline-primary"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "TeacherManagement.html";
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                form.reset();
                teacherImagePreview.src = "../img/default-teacher.png";
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