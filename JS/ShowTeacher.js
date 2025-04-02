document.addEventListener("DOMContentLoaded", function () {
    // Sample teacher data
    const teachers = [
        { 
            id: 1,
            name: "Mohamed Ali", 
            email: "mohamed@teacher.com", 
            phone: "01012345678", 
            subject: "Mathematics", 
            experience: 5, 
            qualification: "MSc in Mathematics", 
            address: "123 School St, Cairo", 
            birthDate: "1985-06-12", 
            gender: "Male", 
            photo: "https://randomuser.me/api/portraits/men/1.jpg",
            status: "Active"
        },
        { 
            id: 2,
            name: "Fatima Khaled", 
            email: "fatima@teacher.com", 
            phone: "01098765432", 
            subject: "Science", 
            experience: 8, 
            qualification: "PhD in Physics", 
            address: "456 Education Ave, Giza", 
            birthDate: "1980-09-20", 
            gender: "Female", 
            photo: "https://randomuser.me/api/portraits/women/2.jpg",
            status: "Active"
        },
        { 
            id: 3,
            name: "John Smith", 
            email: "john@teacher.com", 
            phone: "01122334455", 
            subject: "English", 
            experience: 3, 
            qualification: "MA in English Literature", 
            address: "789 Learning Blvd, Alexandria", 
            birthDate: "1990-05-15", 
            gender: "Male", 
            photo: "https://randomuser.me/api/portraits/men/3.jpg",
            status: "Inactive"
        },
        { 
            id: 4,
            name: "Sarah Johnson", 
            email: "sarah@teacher.com", 
            phone: "01555667788", 
            subject: "History", 
            experience: 10, 
            qualification: "PhD in History", 
            address: "321 Knowledge Rd, Mansoura", 
            birthDate: "1978-08-10", 
            gender: "Female", 
            photo: "https://randomuser.me/api/portraits/women/4.jpg",
            status: "Active"
        }
    ];

    // DOM elements
    const teacherTableBody = document.getElementById("teacherTableBody");
    const subjectFilter = document.getElementById("subjectFilter");
    const genderFilter = document.getElementById("genderFilter");
    const sortBy = document.getElementById("sortBy");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const exportBtn = document.getElementById("exportBtn");
    const teacherDetailModal = new bootstrap.Modal(document.getElementById("teacherDetailModal"));
    const teacherDetailContent = document.getElementById("teacherDetailContent");

    // Display teachers in the table
    function displayTeachers(filteredTeachers = teachers) {
        teacherTableBody.innerHTML = "";
        
        filteredTeachers.forEach(teacher => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${teacher.photo}" class="teacher-img" alt="${teacher.name}"></td>
                <td>${teacher.name}</td>
                <td>${teacher.email}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience} years</td>
                <td><span class="status-badge status-${teacher.status.toLowerCase()}">${teacher.status}</span></td>
                <td>
                    <button class="action-btn view-btn" title="View" onclick="viewTeacherDetails(${teacher.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <a href="EditTeacher.html?id=${teacher.id}" class="action-btn edit-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="action-btn delete-btn" title="Delete" onclick="deleteTeacher(${teacher.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            teacherTableBody.appendChild(row);
        });
    }

    // Filter teachers based on selected filters
    function filterTeachers() {
        const subject = subjectFilter.value;
        const gender = genderFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filtered = teachers.filter(teacher => {
            return (subject === "all" || teacher.subject === subject) &&
                   (gender === "all" || teacher.gender === gender) &&
                   (teacher.name.toLowerCase().includes(searchTerm) || 
                   teacher.email.toLowerCase().includes(searchTerm) || 
                   teacher.subject.toLowerCase().includes(searchTerm));
        });
        
        // Sort teachers
        const sortValue = sortBy.value;
        filtered.sort((a, b) => {
            switch (sortValue) {
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "experience_asc":
                    return a.experience - b.experience;
                case "experience_desc":
                    return b.experience - a.experience;
                default:
                    return 0;
            }
        });
        
        displayTeachers(filtered);
    }

    // View teacher details
    window.viewTeacherDetails = function(id) {
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            teacherDetailContent.innerHTML = `
                <div class="text-center mb-4">
                    <img src="${teacher.photo}" class="teacher-detail-img" alt="${teacher.name}">
                    <h4 style="color: black;">${teacher.name}</h4>
                    <p class="text-muted">${teacher.subject} • ${teacher.experience} years experience</p>
                </div>
                
                <div class="row" style="color:black;">
                    <div class="col-md-6">
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Email:</span> ${teacher.email}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Phone:</span> ${teacher.phone}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Date of Birth:</span> ${formatDate(teacher.birthDate)}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Gender:</span> ${teacher.gender}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Status:</span> <span class="status-badge status-${teacher.status.toLowerCase()}">${teacher.status}</span></p>
                    </div>
                    <div class="col-md-6">
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Qualification:</span> ${teacher.qualification}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Years of Experience:</span> ${teacher.experience}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Address:</span> ${teacher.address}</p>
                    </div>
                </div>
            `;
            teacherDetailModal.show();
        }
    };

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    // Delete button
    window.deleteTeacher = function(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Find the index of the student to delete
                const index = teachers.findIndex(student => student.id === id);
                if (index !== -1) {
                    // Remove the student from the array
                    teachers.splice(index, 1);
                    // Refresh the table
                    filterTeachers();
                }
                Swal.fire(
                    'Deleted!',
                    'Teacher has been deleted.',
                    'success'
                );
            }
        });
    };
    // Enhanced export functionality
    exportBtn.addEventListener("click", function() {
        // Get filtered teachers
        const filteredTeachers = getFilteredTeachers();
        
        // Create export modal
        const exportModalHTML = `
            <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
                <div class="modal-dialog" style="color: black">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exportModalLabel">Export Teacher Data</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Export Format</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="exportFormat" id="excelFormat" value="excel" checked>
                                    <label class="form-check-label" for="excelFormat">
                                        <i class="bi bi-file-earmark-excel text-success"></i> Excel (.xlsx)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="exportFormat" id="csvFormat" value="csv">
                                    <label class="form-check-label" for="csvFormat">
                                        <i class="bi bi-filetype-csv text-primary"></i> CSV (.csv)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="exportFormat" id="pdfFormat" value="pdf">
                                    <label class="form-check-label" for="pdfFormat">
                                        <i class="bi bi-file-earmark-pdf text-danger"></i> PDF (.pdf)
                                    </label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Columns to Export</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportPhoto" checked disabled>
                                    <label class="form-check-label" for="exportPhoto">Photo</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportName" checked>
                                    <label class="form-check-label" for="exportName">Name</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportEmail" checked>
                                    <label class="form-check-label" for="exportEmail">Email</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportSubject" checked>
                                    <label class="form-check-label" for="exportSubject">Subject</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportExperience" checked>
                                    <label class="form-check-label" for="exportExperience">Experience</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportStatus" checked>
                                    <label class="form-check-label" for="exportStatus">Status</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="fileName" class="form-label">File Name</label>
                                <input type="text" class="form-control" id="fileName" value="Teachers_${new Date().toISOString().slice(0, 10)}">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmExport">Export</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', exportModalHTML);
        const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
        exportModal.show();
        
        // Handle export confirmation
        document.getElementById('confirmExport').addEventListener('click', function() {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const fileName = document.getElementById('fileName').value;
            const columns = {
                photo: document.getElementById('exportPhoto').checked,
                name: document.getElementById('exportName').checked,
                email: document.getElementById('exportEmail').checked,
                subject: document.getElementById('exportSubject').checked,
                experience: document.getElementById('exportExperience').checked,
                status: document.getElementById('exportStatus').checked
            };
            
            switch(format) {
                case 'excel':
                    exportToExcel(filteredTeachers, fileName, columns);
                    break;
                case 'csv':
                    exportToCSV(filteredTeachers, fileName, columns);
                    break;
                case 'pdf':
                    exportToPDF(filteredTeachers, fileName, columns);
                    break;
            }
            
            exportModal.hide();
            setTimeout(() => {
                document.getElementById('exportModal').remove();
            }, 500);
        });
    });

    // Helper function to get filtered teachers
    function getFilteredTeachers() {
        const subject = subjectFilter.value;
        const gender = genderFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        return teachers.filter(teacher => {
            return (subject === "all" || teacher.subject === subject) &&
                   (gender === "all" || teacher.gender === gender) &&
                   (teacher.name.toLowerCase().includes(searchTerm) || 
                   teacher.email.toLowerCase().includes(searchTerm) || 
                   teacher.subject.toLowerCase().includes(searchTerm));
        });
    }

    // Export to Excel function
    function exportToExcel(teachers, fileName, columns) {
        // Prepare data
        const data = teachers.map(teacher => {
            const row = {};
            if (columns.name) row['Name'] = teacher.name;
            if (columns.email) row['Email'] = teacher.email;
            if (columns.subject) row['Subject'] = teacher.subject;
            if (columns.experience) row['Experience'] = teacher.experience;
            if (columns.status) row['Status'] = teacher.status;
            return row;
        });
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Teachers");
        
        // Generate and download
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        
        // Show success message
        Swal.fire({
            title: 'Export Successful!',
            text: 'Teacher data has been exported to Excel.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Export to CSV function
    function exportToCSV(teachers, fileName, columns) {
        // Prepare headers
        const headers = [];
        if (columns.name) headers.push('Name');
        if (columns.email) headers.push('Email');
        if (columns.subject) headers.push('Subject');
        if (columns.experience) headers.push('Experience');
        if (columns.status) headers.push('Status');
        
        // Prepare data rows
        const rows = teachers.map(teacher => {
            const row = [];
            if (columns.name) row.push(`"${teacher.name}"`);
            if (columns.email) row.push(`"${teacher.email}"`);
            if (columns.subject) row.push(`"${teacher.subject}"`);
            if (columns.experience) row.push(`"${teacher.experience}"`);
            if (columns.status) row.push(`"${teacher.status}"`);
            return row.join(',');
        });
        
        // Combine headers and rows
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        Swal.fire({
            title: 'Export Successful!',
            text: 'Teacher data has been exported to CSV.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    function exportToPDF(teachers, fileName, columns) {
        // Use jsPDF in compatibility mode (window.jsPDF)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Teacher Records', 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Prepare data for the table
        const headers = [];
        const data = [];
        
        // Build headers based on selected columns
        if (columns.name) headers.push('Name');
        if (columns.email) headers.push('Email');
        if (columns.subject) headers.push('Subject');
        if (columns.experience) headers.push('Experience');
        if (columns.status) headers.push('Status');
        
        // Build data rows
        teachers.forEach(teacher => {
            const row = [];
            if (columns.name) row.push(teacher.name);
            if (columns.email) row.push(teacher.email);
            if (columns.subject) row.push(teacher.subject);
            if (columns.experience) row.push(teacher.experience);
            if (columns.status) row.push(teacher.status);
            data.push(row);
        });
        
        // Add table to PDF
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 40,
            theme: 'grid',
            headStyles: {
                fillColor: [58, 74, 107], // Primary color from your theme
                textColor: 255,
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 40 }
        });
        
        // Save PDF
        doc.save(`${fileName}.pdf`);
        
        // Show success message
        Swal.fire({
            title: 'Export Successful!',
            text: 'Teacher data has been exported to PDF.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Event listeners for filters and search
    subjectFilter.addEventListener("change", filterTeachers);
    genderFilter.addEventListener("change", filterTeachers);
    sortBy.addEventListener("change", filterTeachers);
    searchInput.addEventListener("input", filterTeachers);
    searchButton.addEventListener("click", filterTeachers);

    // Initial display
    displayTeachers();
});