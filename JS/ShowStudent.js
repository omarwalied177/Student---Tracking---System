document.addEventListener("DOMContentLoaded", function () {
    // Sample student data
    const students = [
        { 
            id: 1,
            name: "Ahmed Mohamed", 
            email: "ahmed@student.com", 
            phone: "01012345678", 
            grade: "Grade 1", 
            parent: "Mohamed Ali", 
            parentEmail: "mohamed@parent.com", 
            address: "123 School St, Cairo", 
            birthDate: "2005-06-12", 
            gender: "Male", 
            photo: "https://randomuser.me/api/portraits/men/1.jpg",
            status: "Active"
        },
        { 
            id: 2,
            name: "Sara Khaled", 
            email: "sara@student.com", 
            phone: "01098765432", 
            grade: "Grade 2", 
            parent: "Khaled Hassan", 
            parentEmail: "khaled@parent.com", 
            address: "456 Education Ave, Giza", 
            birthDate: "2006-09-20", 
            gender: "Female", 
            photo: "https://randomuser.me/api/portraits/women/2.jpg",
            status: "Active"
        },
        { 
            id: 3,
            name: "John Doe", 
            email: "john@student.com", 
            phone: "01122334455", 
            grade: "Grade 1", 
            parent: "Doe Senior", 
            parentEmail: "doe@parent.com", 
            address: "789 Learning Blvd, Alexandria", 
            birthDate: "2007-05-15", 
            gender: "Male", 
            photo: "https://randomuser.me/api/portraits/men/3.jpg",
            status: "Inactive"
        },
        { 
            id: 4,
            name: "Mariam Adel", 
            email: "mariam@student.com", 
            phone: "01555667788", 
            grade: "Grade 3", 
            parent: "Adel Samir", 
            parentEmail: "adel@parent.com", 
            address: "321 Knowledge Rd, Mansoura", 
            birthDate: "2008-08-10", 
            gender: "Female", 
            photo: "https://randomuser.me/api/portraits/women/4.jpg",
            status: "Active"
        }
    ];

    // DOM elements
    const studentTableBody = document.getElementById("studentTableBody");
    const gradeFilter = document.getElementById("gradeFilter");
    const genderFilter = document.getElementById("genderFilter");
    const statusFilter = document.getElementById("statusFilter");
    const sortBy = document.getElementById("sortBy");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const exportBtn = document.getElementById("exportBtn");
    const studentDetailModal = new bootstrap.Modal(document.getElementById("studentDetailModal"));
    const studentDetailContent = document.getElementById("studentDetailContent");

    // Display students in the table
    function displayStudents(filteredStudents = students) {
        studentTableBody.innerHTML = "";
        
        filteredStudents.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${student.photo}" class="student-img" alt="${student.name}"></td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.grade}</td>
                <td>${student.parent}</td>
                <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
                <td>
                    <button class="action-btn view-btn" title="View" onclick="viewStudentDetails(${student.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <a href="EditStudent.html?id=${student.id}" class="action-btn edit-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="action-btn delete-btn" title="Delete" onclick="deleteStudent(${student.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    // Filter students based on selected filters
    function filterStudents() {
        const grade = gradeFilter.value;
        const gender = genderFilter.value;
        const status = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filtered = students.filter(student => {
            return (grade === "all" || student.grade === grade) &&
                   (gender === "all" || student.gender === gender) &&
                   (status === "all" || student.status === status) &&
                   (student.name.toLowerCase().includes(searchTerm) || 
                   student.email.toLowerCase().includes(searchTerm) || 
                   student.parent.toLowerCase().includes(searchTerm));
        });
        
        // Sort students
        const sortValue = sortBy.value;
        filtered.sort((a, b) => {
            switch (sortValue) {
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "grade_asc":
                    return parseInt(a.grade.split(" ")[1]) - parseInt(b.grade.split(" ")[1]);
                case "grade_desc":
                    return parseInt(b.grade.split(" ")[1]) - parseInt(a.grade.split(" ")[1]);
                default:
                    return 0;
            }
        });
        
        displayStudents(filtered);
    }

    // View student details
    window.viewStudentDetails = function(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            studentDetailContent.innerHTML = `
                <div class="text-center mb-4">
                    <img src="${student.photo}" class="student-detail-img" alt="${student.name}">
                    <h4 style="color: black;">${student.name}</h4>
                    <p class="text-muted">${student.grade} • ${student.gender}</p>
                </div>
                
                <div class="row" style="color:black;">
                    <div class="col-md-6">
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Email:</span> ${student.email}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Phone:</span> ${student.phone}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Date of Birth:</span> ${formatDate(student.birthDate)}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Status:</span> <span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></p>
                    </div>
                    <div class="col-md-6">
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Parent Name:</span> ${student.parent}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Parent Email:</span> ${student.parentEmail}</p>
                        <p><span class="detail-label" style="color: var(--accent-color); font-weight: bold;">Address:</span> ${student.address}</p>
                    </div>
                </div>
            `;
            studentDetailModal.show();
        }
    };

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Delete student
    window.deleteStudent = function(id) {
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
                const index = students.findIndex(student => student.id === id);
                if (index !== -1) {
                    // Remove the student from the array
                    students.splice(index, 1);
                    // Refresh the table
                    filterStudents();
                }
                Swal.fire(
                    'Deleted!',
                    'Student has been deleted.',
                    'success'
                );
            }
        });
    };

    // Enhanced export functionality
    exportBtn.addEventListener("click", function() {
        // Get filtered students
        const filteredStudents = getFilteredStudents();
        
        // Create export modal
        const exportModalHTML = `
            <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
                <div class="modal-dialog" style="color: black">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exportModalLabel">Export Student Data</h5>
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
                                    <input class="form-check-input" type="checkbox" id="exportGrade" checked>
                                    <label class="form-check-label" for="exportGrade">Grade</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportParent" checked>
                                    <label class="form-check-label" for="exportParent">Parent</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportStatus" checked>
                                    <label class="form-check-label" for="exportStatus">Status</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="fileName" class="form-label">File Name</label>
                                <input type="text" class="form-control" id="fileName" value="Students_${new Date().toISOString().slice(0, 10)}">
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
                grade: document.getElementById('exportGrade').checked,
                parent: document.getElementById('exportParent').checked,
                status: document.getElementById('exportStatus').checked
            };
            
            switch(format) {
                case 'excel':
                    exportToExcel(filteredStudents, fileName, columns);
                    break;
                case 'csv':
                    exportToCSV(filteredStudents, fileName, columns);
                    break;
                case 'pdf':
                    exportToPDF(filteredStudents, fileName, columns);
                    break;
            }
            
            exportModal.hide();
            setTimeout(() => {
                document.getElementById('exportModal').remove();
            }, 500);
        });
    });

    // Helper function to get filtered students
    function getFilteredStudents() {
        const grade = gradeFilter.value;
        const gender = genderFilter.value;
        const status = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        return students.filter(student => {
            return (grade === "all" || student.grade === grade) &&
                   (gender === "all" || student.gender === gender) &&
                   (status === "all" || student.status === status) &&
                   (student.name.toLowerCase().includes(searchTerm) || 
                   student.email.toLowerCase().includes(searchTerm) || 
                   student.parent.toLowerCase().includes(searchTerm));
        });
    }

    // Export to Excel function
    function exportToExcel(students, fileName, columns) {
        // Prepare data
        const data = students.map(student => {
            const row = {};
            if (columns.name) row['Name'] = student.name;
            if (columns.email) row['Email'] = student.email;
            if (columns.grade) row['Grade'] = student.grade;
            if (columns.parent) row['Parent'] = student.parent;
            if (columns.status) row['Status'] = student.status;
            return row;
        });
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        
        // Generate and download
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        
        // Show success message
        Swal.fire({
            title: 'Export Successful!',
            text: 'Student data has been exported to Excel.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Export to CSV function
    function exportToCSV(students, fileName, columns) {
        // Prepare headers
        const headers = [];
        if (columns.name) headers.push('Name');
        if (columns.email) headers.push('Email');
        if (columns.grade) headers.push('Grade');
        if (columns.parent) headers.push('Parent');
        if (columns.status) headers.push('Status');
        
        // Prepare data rows
        const rows = students.map(student => {
            const row = [];
            if (columns.name) row.push(`"${student.name}"`);
            if (columns.email) row.push(`"${student.email}"`);
            if (columns.grade) row.push(`"${student.grade}"`);
            if (columns.parent) row.push(`"${student.parent}"`);
            if (columns.status) row.push(`"${student.status}"`);
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
            text: 'Student data has been exported to CSV.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    function exportToPDF(students, fileName, columns) {
        // Use jsPDF in compatibility mode (window.jsPDF)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Student Records', 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Prepare data for the table
        const headers = [];
        const data = [];
        
        // Build headers based on selected columns
        if (columns.name) headers.push('Name');
        if (columns.email) headers.push('Email');
        if (columns.grade) headers.push('Grade');
        if (columns.parent) headers.push('Parent');
        if (columns.status) headers.push('Status');
        
        // Build data rows
        students.forEach(student => {
            const row = [];
            if (columns.name) row.push(student.name);
            if (columns.email) row.push(student.email);
            if (columns.grade) row.push(student.grade);
            if (columns.parent) row.push(student.parent);
            if (columns.status) row.push(student.status);
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
            text: 'Student data has been exported to PDF.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    // Event listeners for filters and search
    gradeFilter.addEventListener("change", filterStudents);
    genderFilter.addEventListener("change", filterStudents);
    statusFilter.addEventListener("change", filterStudents);
    sortBy.addEventListener("change", filterStudents);
    searchInput.addEventListener("input", filterStudents);
    searchButton.addEventListener("click", filterStudents);

    // Initial display
    displayStudents();
});