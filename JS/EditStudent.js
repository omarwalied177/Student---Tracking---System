document.addEventListener("DOMContentLoaded", function () {
    // Get student ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    
    // DOM elements
    const form = document.getElementById("editStudentForm");
    const studentImage = document.getElementById("studentImage");
    const studentImagePreview = document.getElementById("studentImagePreview");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmDeleteCheckbox = document.getElementById("confirmDelete");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));
    
    // Validation patterns
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    
    // Sample student data (in a real app, this would come from an API)
    const studentData = {
        id: studentId,
        name: "Ahmed Mohamed",
        email: "ahmed@student.com",
        phone: "01012345678",
        status: "Active",
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        grade: "Grade 1",
        dob: "2005-06-12",
        gender: "Male",
        parentName: "Mohamed Ali",
        parentEmail: "mohamed@parent.com",
        parentPhone: "01123456789",
        relationship: "Father",
        address1: "123 School Street",
        address2: "Apartment 4B",
        city: "Cairo",
        postalCode: "12345"
    };
    
    // Load student data into form
    function loadStudentData() {
        if (studentData) {
            document.getElementById("studentName").value = studentData.name;
            document.getElementById("studentEmail").value = studentData.email;
            document.getElementById("studentPhone").value = studentData.phone;
            document.getElementById("status").value = studentData.status;
            studentImagePreview.src = studentData.photo;
            document.getElementById("grade").value = studentData.grade;
            document.getElementById("dob").value = studentData.dob;
            document.querySelector(`input[name="gender"][value="${studentData.gender}"]`).checked = true;
            document.getElementById("parentName").value = studentData.parentName;
            document.getElementById("parentEmail").value = studentData.parentEmail;
            document.getElementById("parentPhone").value = studentData.parentPhone;
            document.getElementById("relationship").value = studentData.relationship;
            document.getElementById("address1").value = studentData.address1;
            document.getElementById("address2").value = studentData.address2 || "";
            document.getElementById("city").value = studentData.city;
            document.getElementById("postalCode").value = studentData.postalCode || "";
        }
    }
    
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
        event.preventDefault();
        
        let isValid = true;
        
        // Validate required fields
        const requiredFields = [
            "studentName", "studentEmail", "studentPhone", "grade", 
            "dob", "parentName", "parentEmail", "parentPhone", 
            "relationship", "address1", "city"
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add("is-invalid");
                isValid = false;
            } else {
                field.classList.remove("is-invalid");
            }
        });
        
        // Validate phone numbers
        const phoneFields = ["studentPhone", "parentPhone"];
        phoneFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!phoneRegex.test(field.value.trim())) {
                field.classList.add("is-invalid");
                isValid = false;
            } else {
                field.classList.remove("is-invalid");
            }
        });
        
        // Validate email
        const email = document.getElementById("studentEmail");
        if (!email.value.includes("@") || !email.value.includes(".")) {
            email.classList.add("is-invalid");
            isValid = false;
        } else {
            email.classList.remove("is-invalid");
        }
        
        // Validate gender
        const genderSelected = document.querySelector("input[name='gender']:checked");
        if (!genderSelected) {
            document.querySelector("input[name='gender']").closest(".mb-3").querySelector(".invalid-feedback").style.display = "block";
            isValid = false;
        } else {
            document.querySelector("input[name='gender']").closest(".mb-3").querySelector(".invalid-feedback").style.display = "none";
        }
        
        if (isValid) {
            // In a real app, this would submit to an API
            Swal.fire({
                title: "Success!",
                text: "Student information updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "var(--primary-color)"
            }).then(() => {
                window.location.href = "ShowStudent.html";
            });
        }
    });
    
    // Delete student confirmation
    deleteBtn.addEventListener("click", function() {
        deleteConfirmationModal.show();
    });
    
    // Enable/disable delete button based on checkbox
    confirmDeleteCheckbox.addEventListener("change", function() {
        confirmDeleteBtn.disabled = !this.checked;
    });
    
    // Confirm delete action
    confirmDeleteBtn.addEventListener("click", function() {
        // In a real app, this would call an API to delete the student
        Swal.fire({
            title: "Deleted!",
            text: "The student record has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "var(--primary-color)"
        }).then(() => {
            deleteConfirmationModal.hide();
            window.location.href = "ShowStudent.html";
        });
    });
    
    // Cancel button
    cancelBtn.addEventListener("click", function() {
        window.location.href = "ShowStudent.html";
    });
    
    // Initialize the form with student data
    loadStudentData();
});