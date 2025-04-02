document.addEventListener('DOMContentLoaded', function() {
    // Sample data for recent teachers
    const recentTeachers = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@school.edu",
        subject: "Mathematics",
        classes: "Grade 1, Grade 2",
        photo: "https://randomuser.me/api/portraits/women/1.jpg"
      },
      {
        id: 2,
        name: "Mr. David Wilson",
        email: "david.wilson@school.edu",
        subject: "Science",
        classes: "Grade 3, Grade 4",
        photo: "https://randomuser.me/api/portraits/men/2.jpg"
      },
      {
        id: 3,
        name: "Ms. Emily Chen",
        email: "emily.chen@school.edu",
        subject: "English",
        classes: "Grade 5, Grade 6",
        photo: "https://randomuser.me/api/portraits/women/3.jpg"
      },
      {
        id: 4,
        name: "Mr. Robert Taylor",
        email: "robert.taylor@school.edu",
        subject: "History",
        classes: "Grade 2, Grade 3",
        photo: "https://randomuser.me/api/portraits/men/4.jpg"
      }
    ];
  
    // Load recent teachers
    const recentTeachersTable = document.getElementById('recentTeachersTable');
    recentTeachers.forEach(teacher => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${teacher.photo}" class="teacher-img-sm" alt="${teacher.name}"></td>
        <td>${teacher.name}</td>
        <td>${teacher.email}</td>
        <td>${teacher.subject}</td>
        <td>${teacher.classes}</td>
      `;
      recentTeachersTable.appendChild(row);
    });
  
    // Initialize charts
    initCharts();
  
    // Bulk import modal
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    if (bulkImportBtn) {
      bulkImportBtn.addEventListener('click', function() {
        // Create and show modal
        const modalHTML = `
          <div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content" style="color:black;">
                <div class="modal-header">
                  <h5 class="modal-title" id="importModalLabel">Bulk Import Teachers</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="dropzone" id="teacherDropzone">
                    <i class="bi bi-cloud-arrow-up fs-1"></i>
                    <h5>Drag & Drop your file here</h5>
                    <p class="text-muted">or click to browse files</p>
                    <input type="file" id="teacherFile" accept=".csv, .xlsx" style="display: none;">
                    <p class="small mt-3">Supported formats: CSV, Excel</p>
                    <a href="#" class="template-download" id="downloadTemplate" style="text-decoration: none;">
                      <i class="bi bi-download"></i> Download Template
                    </a>
                  </div>
                  <div class="progress mt-3 d-none" id="importProgress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%"></div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" id="startImport" disabled>Start Import</button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const importModal = new bootstrap.Modal(document.getElementById('importModal'));
        importModal.show();
        
        // Initialize dropzone functionality
        setupDropzone();
      });
    }
  });
  
  function initCharts() {
    // Subject Distribution Chart
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    const subjectChart = new Chart(subjectCtx, {
      type: 'bar',
      data: {
        labels: ['Math', 'Science', 'English', 'History', 'Geography', 'Art'],
        datasets: [{
          label: 'Number of Teachers',
          data: [12, 10, 8, 6, 4, 3],
          backgroundColor: [
            'rgba(92, 122, 234, 0.7)',
            'rgba(40, 167, 69, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(220, 53, 69, 0.7)',
            'rgba(23, 162, 184, 0.7)',
            'rgba(108, 117, 125, 0.7)'
          ],
          borderColor: [
            'rgba(92, 122, 234, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(220, 53, 69, 1)',
            'rgba(23, 162, 184, 1)',
            'rgba(108, 117, 125, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 45,  // Maximum rotation angle (0 for horizontal)
              minRotation: 0    // Minimum rotation angle
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  
    // Gender Distribution Chart
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    const genderChart = new Chart(genderCtx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [15, 28],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  function setupDropzone() {
    const dropzone = document.getElementById('teacherDropzone');
    const fileInput = document.getElementById('teacherFile');
    const startImportBtn = document.getElementById('startImport');
    
    dropzone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        handleFileSelection(this.files[0]);
      }
    });
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropzone.classList.add('active');
    }
    
    function unhighlight() {
      dropzone.classList.remove('active');
    }
    
    dropzone.addEventListener('drop', function(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFileSelection(files[0]);
      }
    });
    
    function handleFileSelection(file) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid CSV or Excel file.');
        return;
      }
      
      dropzone.innerHTML = `
        <i class="bi bi-file-earmark-check fs-1 text-success"></i>
        <h5>${file.name}</h5>
        <p class="text-muted">${(file.size / 1024).toFixed(2)} KB</p>
        <button class="btn btn-sm btn-outline-secondary mt-2" id="changeFile">Change File</button>
      `;
      
      startImportBtn.disabled = false;
      
      document.getElementById('changeFile').addEventListener('click', function() {
        fileInput.value = '';
        dropzone.innerHTML = `
          <i class="bi bi-cloud-arrow-up fs-1"></i>
          <h5>Drag & Drop your file here</h5>
          <p class="text-muted">or click to browse files</p>
          <input type="file" id="teacherFile" accept=".csv, .xlsx" style="display: none;">
          <p class="small mt-3">Supported formats: CSV, Excel</p>
          <a href="#" class="template-download" id="downloadTemplate">
            <i class="bi bi-download"></i> Download Template
          </a>
        `;
        startImportBtn.disabled = true;
        setupDropzone();
      });
    }
    
    // Start import
    startImportBtn.addEventListener('click', function() {
      const progressBar = document.getElementById('importProgress');
      progressBar.classList.remove('d-none');
      
      // Simulate import progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        progressBar.querySelector('.progress-bar').style.width = `${progress}%`;
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert('Import completed successfully!');
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
          }, 500);
        }
      }, 200);
    });
  }
  
  function deleteTeacher(id) {
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
            // In a real app, this would make an API call to delete the teacher
            console.log(`Deleting teacher with ID: ${id}`);
            Swal.fire(
                'Deleted!',
                'Teacher has been deleted.',
                'success'
            );
            // Refresh the table or remove the row
        }
    });
}