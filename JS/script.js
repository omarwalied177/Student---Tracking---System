document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addTeacherForm");
    const teacherList = document.getElementById("teacherList");
    const notification = createNotificationElement();

    // Add teacher form submission
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        
        if (validateTeacherInput(name, email, subject)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = `
                <span class="btn-text">Adding Teacher</span>
                <span class="btn-icon"><i class="bi bi-arrow-repeat"></i></span>
            `;
            submitBtn.disabled = true;

            // Simulate API call/processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Store teacher data with more structured format
            const teacherData = {
                name,
                email,
                subject,
                dateAdded: new Date().toISOString()
            };
            localStorage.setItem(`teacher_${email}`, JSON.stringify(teacherData));
            
            // Show success notification
            showNotification('Teacher added successfully!', 'success');
            form.reset();
            
            // Refresh teacher list
            displayTeachers();
            
            // Reset button state
            submitBtn.innerHTML = `
                <span class="btn-text">Add Teacher</span>
                <span class="btn-icon"><i class="bi bi-person-plus"></i></span>
            `;
            submitBtn.disabled = false;
        }
    });

    // Display existing teachers on page load
    if (teacherList) {
        displayTeachers();
    }

    // Helper function to display teachers
    function displayTeachers() {
        teacherList.innerHTML = '';
        const teachers = [];
        
        // Get all teacher entries from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('teacher_')) {
                const teacher = JSON.parse(localStorage.getItem(key));
                teachers.push(teacher);
            }
        }
        
        // Sort by date added (newest first)
        teachers.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        // Create list items with enhanced UI
        teachers.forEach(teacher => {
            const li = document.createElement('li');
            li.className = 'teacher-item';
            li.innerHTML = `
                <div class="teacher-info">
                    <i class="bi bi-person-video3"></i>
                    <div>
                        <h5>${teacher.name}</h5>
                        <p>${teacher.subject}</p>
                        <small>${teacher.email}</small>
                    </div>
                </div>
                <div class="teacher-actions">
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-email="${teacher.email}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-email="${teacher.email}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            teacherList.appendChild(li);
        });

        // Add event listeners for action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.currentTarget.getAttribute('data-email');
                editTeacher(email);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.currentTarget.getAttribute('data-email');
                deleteTeacher(email);
            });
        });
    }

    // Teacher input validation
    function validateTeacherInput(name, email, subject) {
        if (!name || !email || !subject) {
            showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (localStorage.getItem(`teacher_${email}`)) {
            showNotification('A teacher with this email already exists', 'error');
            return false;
        }
        
        return true;
    }

    // Edit teacher function
    function editTeacher(email) {
        const teacherData = JSON.parse(localStorage.getItem(`teacher_${email}`));
        if (teacherData) {
            document.getElementById('name').value = teacherData.name;
            document.getElementById('email').value = teacherData.email;
            document.getElementById('subject').value = teacherData.subject;
            
            // Remove the old entry
            localStorage.removeItem(`teacher_${email}`);
            
            // Scroll to form
            document.getElementById('addTeacherForm').scrollIntoView({
                behavior: 'smooth'
            });
            
            showNotification('Teacher data loaded for editing', 'info');
        }
    }

    // Delete teacher function
    function deleteTeacher(email) {
        if (confirm('Are you sure you want to delete this teacher?')) {
            localStorage.removeItem(`teacher_${email}`);
            displayTeachers();
            showNotification('Teacher deleted successfully', 'success');
        }
    }

    // Notification system
    function createNotificationElement() {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification hidden';
        document.body.appendChild(notification);
        return notification;
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} animate__animated animate__fadeInDown`;
        
        setTimeout(() => {
            notification.classList.add('animate__fadeOutUp');
            setTimeout(() => {
                notification.className = 'notification hidden';
            }, 500);
        }, 3000);
    }
});