document.addEventListener("DOMContentLoaded", function () {
    // Get teacher ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = urlParams.get('id');
    
    // DOM elements
    const form = document.getElementById("editTeacherForm");
    const teacherImage = document.getElementById("teacherImage");
    const teacherImagePreview = document.getElementById("teacherImagePreview");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmDeleteCheckbox = document.getElementById("confirmDelete");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));
    
    // Validation patterns
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Sample teacher data (replace with API call in real implementation)
    const teacherData = {
        id: teacherId,
        name: "Ali Hassan",
        email: "ali@teacher.com",
        phone: "01098765432",
        status: "Active",
        photo: "https://randomuser.me/api/portraits/men/2.jpg",
        subjects: ["Math", "Physics"],
        dob: "1985-03-15",
        gender: "Male",
        qualification: "PhD in Mathematics",
        experience: 12,
        joiningDate: "2015-08-20",
        salary: 15000,
        address1: "456 Faculty Street",
        address2: "Building 3, Apartment 5",
        city: "Cairo",
        postalCode: "54321"
    };
    
    // Initialize the form
    function initForm() {
        loadTeacherData();
        setupImagePreview();
        setupSubjects();
        setupFormValidation();
        setupDeleteConfirmation();
    }
    
    // Load teacher data into form
    function loadTeacherData() {
        if (!teacherData) return;
        
        // Basic information
        document.getElementById("teacherName").value = teacherData.name;
        document.getElementById("teacherEmail").value = teacherData.email;
        document.getElementById("teacherPhone").value = teacherData.phone;
        document.getElementById("status").value = teacherData.status;
        teacherImagePreview.src = teacherData.photo;
        document.getElementById("dob").value = teacherData.dob;
        document.querySelector(`input[name="gender"][value="${teacherData.gender}"]`).checked = true;
        
        // Professional information
        document.getElementById("qualification").value = teacherData.qualification;
        document.getElementById("experience").value = teacherData.experience;
        document.getElementById("joiningDate").value = teacherData.joiningDate;
        document.getElementById("salary").value = teacherData.salary;
        
        // Address information
        document.getElementById("address1").value = teacherData.address1;
        document.getElementById("address2").value = teacherData.address2 || "";
        document.getElementById("city").value = teacherData.city;
        document.getElementById("postalCode").value = teacherData.postalCode || "";
    }
    
    // Setup image preview functionality
    function setupImagePreview() {
        teacherImage.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    teacherImagePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Setup subjects management
    function setupSubjects() {
        const selectedSubjects = document.getElementById('selectedSubjects');
        const subjectInput = document.getElementById('subjectInput');
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        const subjectTags = document.querySelectorAll('.subject-tag');
        const hiddenSubjectsInput = document.getElementById('subjects');
        
        // Load existing subjects
        if (teacherData.subjects && teacherData.subjects.length > 0) {
            teacherData.subjects.forEach(subject => {
                addSubjectTag(subject);
            });
        }
        
        // Add subject from input
        addSubjectBtn.addEventListener('click', addSubjectFromInput);
        subjectInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addSubjectFromInput();
                e.preventDefault();
            }
        });
        
        // Add subject from suggestions
        subjectTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const subject = tag.getAttribute('data-subject');
                if (!isSubjectSelected(subject)) {
                    addSubjectTag(subject);
                }
            });
        });
        
        function addSubjectFromInput() {
            const subject = subjectInput.value.trim();
            if (subject && !isSubjectSelected(subject)) {
                addSubjectTag(subject);
                subjectInput.value = '';
            }
        }
        
        function addSubjectTag(subject) {
            const tag = document.createElement('span');
            tag.className = 'subject-tag selected';
            tag.innerHTML = `
                ${getSubjectDisplayName(subject)}
                <i class="bi bi-x"></i>
            `;
            
            tag.querySelector('.bi-x').addEventListener('click', () => {
                tag.remove();
                updateHiddenSubjects();
            });
            
            selectedSubjects.appendChild(tag);
            updateHiddenSubjects();
        }
        
        function isSubjectSelected(subject) {
            const currentSubjects = Array.from(selectedSubjects.querySelectorAll('.subject-tag'))
                .map(tag => tag.textContent.trim().replace(/\s×$/, ''));
            return currentSubjects.includes(getSubjectDisplayName(subject));
        }
        
        function getSubjectDisplayName(subjectValue) {
            const subjectMap = {
                'Math': 'Mathematics',
                'Science': 'Science',
                'English': 'English',
                'History': 'History',
                'Arabic': 'Arabic',
                'Physics': 'Physics',
                'Chemistry': 'Chemistry'
            };
            return subjectMap[subjectValue] || subjectValue;
        }
        
        function updateHiddenSubjects() {
            const subjects = Array.from(selectedSubjects.querySelectorAll('.subject-tag'))
                .map(tag => {
                    const text = tag.textContent.trim().replace(/\s×$/, '');
                    // Reverse lookup to get the value from display name
                    for (const [value, name] of Object.entries({
                        'Math': 'Mathematics',
                        'Science': 'Science',
                        'English': 'English',
                        'History': 'History',
                        'Arabic': 'Arabic',
                        'Physics': 'Physics',
                        'Chemistry': 'Chemistry'
                    })) {
                        if (text === name) return value;
                    }
                    return text;
                });
            
            hiddenSubjectsInput.value = subjects.join(',');
        }
    }
    
    // Setup form validation
    function setupFormValidation() {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            let isValid = validateForm();
            
            if (isValid) {
                // In a real app, this would submit to an API
                Swal.fire({
                    title: "Success!",
                    text: "Teacher information updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#0d6efd"
                }).then(() => {
                    window.location.href = "ShowTeacher.html";
                });
            }
        });
    }
    
    // Validate all form fields
    function validateForm() {
        let isValid = true;
        
        // Validate required text fields
        const requiredFields = [
            "teacherName", "teacherEmail", "teacherPhone", "dob",
            "qualification", "experience", "joiningDate", "salary",
            "address1", "city"
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                markAsInvalid(field);
                isValid = false;
            } else {
                markAsValid(field);
            }
        });
        
        // Validate phone number
        const phoneField = document.getElementById("teacherPhone");
        if (!phoneRegex.test(phoneField.value.trim())) {
            markAsInvalid(phoneField);
            isValid = false;
        } else {
            markAsValid(phoneField);
        }
        
        // Validate email
        const emailField = document.getElementById("teacherEmail");
        if (!emailRegex.test(emailField.value.trim())) {
            markAsInvalid(emailField);
            isValid = false;
        } else {
            markAsValid(emailField);
        }
        
        // Validate gender
        const genderSelected = document.querySelector("input[name='gender']:checked");
        if (!genderSelected) {
            document.querySelector("input[name='gender']").closest(".mb-3").querySelector(".invalid-feedback").style.display = "block";
            isValid = false;
        } else {
            document.querySelector("input[name='gender']").closest(".mb-3").querySelector(".invalid-feedback").style.display = "none";
        }
        
        // Validate subjects
        const subjectsField = document.getElementById('subjects');
        if (!subjectsField.value) {
            document.querySelector('.subjects-container').classList.add('is-invalid');
            isValid = false;
        } else {
            document.querySelector('.subjects-container').classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    function markAsInvalid(field) {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
    }
    
    function markAsValid(field) {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
    }
    
    // Setup delete confirmation
    function setupDeleteConfirmation() {
        deleteBtn.addEventListener("click", () => deleteConfirmationModal.show());
        
        confirmDeleteCheckbox.addEventListener("change", () => {
            confirmDeleteBtn.disabled = !confirmDeleteCheckbox.checked;
        });
        
        confirmDeleteBtn.addEventListener("click", () => {
            // In a real app, this would call an API to delete the teacher
            Swal.fire({
                title: "Deleted!",
                text: "The teacher record has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#0d6efd"
            }).then(() => {
                deleteConfirmationModal.hide();
                window.location.href = "ShowTeacher.html";
            });
        });
        
        cancelBtn.addEventListener("click", () => {
            window.location.href = "ShowTeacher.html";
        });
    }
    
    // Initialize the form
    initForm();
});