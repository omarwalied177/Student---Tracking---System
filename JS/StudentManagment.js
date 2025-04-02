document.addEventListener('DOMContentLoaded', function() {
    // Sample data for recent students
    const recentStudents = [
      {
        id: 1,
        name: "Ahmed Mohamed",
        email: "ahmed@student.com",
        grade: "Grade 1",
        parent: "Mohamed Ali",
        photo: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        id: 2,
        name: "Sara Khaled",
        email: "sara@student.com",
        grade: "Grade 2",
        parent: "Khaled Hassan",
        photo: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        id: 3,
        name: "John Doe",
        email: "john@student.com",
        grade: "Grade 1",
        parent: "Doe Senior",
        photo: "https://randomuser.me/api/portraits/men/3.jpg"
      },
      {
        id: 4,
        name: "Mariam Adel",
        email: "mariam@student.com",
        grade: "Grade 3",
        parent: "Adel Samir",
        photo: "https://randomuser.me/api/portraits/women/4.jpg"
      }
    ];
  
    // Load recent students
    const recentStudentsTable = document.getElementById('recentStudentsTable');
    recentStudents.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${student.photo}" class="student-img-sm" alt="${student.name}"></td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.grade}</td>
        <td>${student.parent}</td>
      `;
      recentStudentsTable.appendChild(row);
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
              <div class="modal-content" style = "color:black;">
                <div class="modal-header">
                  <h5 class="modal-title" id="importModalLabel">Bulk Import Students</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="dropzone" id="studentDropzone">
                    <i class="bi bi-cloud-arrow-up fs-1"></i>
                    <h5>Drag & Drop your file here</h5>
                    <p class="text-muted">or click to browse files</p>
                    <input type="file" id="studentFile" accept=".csv, .xlsx" style="display: none;">
                    <p class="small mt-3">Supported formats: CSV, Excel</p>
                    <a href="#" class="template-download" id="downloadTemplate" style="text-decoration : none;">
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
    // Grade Distribution Chart
    const gradeCtx = document.getElementById('gradeChart').getContext('2d');
    const gradeChart = new Chart(gradeCtx, {
      type: 'bar',
      data: {
        labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        datasets: [{
          label: 'Number of Students',
          data: [320, 280, 240, 200, 150, 55],
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
          data: [680, 565],
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
    const dropzone = document.getElementById('studentDropzone');
    const fileInput = document.getElementById('studentFile');
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
      if (!validTypes.includes(file.type) )
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
          <input type="file" id="studentFile" accept=".csv, .xlsx" style="display: none;">
          <p class="small mt-3">Supported formats: CSV, Excel</p>
          <a href="#" class="template-download" id="downloadTemplate">
            <i class="bi bi-download"></i> Download Template
          </a>
        `;
        startImportBtn.disabled = true;
        setupDropzone();
      });
    }
    
    // Download template
    document.getElementById('downloadTemplate').addEventListener('click', function(e) {
      e.preventDefault();
      // In a real app, this would download an actual template file
      alert('Template download would start here in a real application.');
    });
    
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
  
  function deleteStudent(id) {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this student?')) {
      // In a real app, this would make an API call to delete the student
      console.log(`Deleting student with ID: ${id}`);
      alert('Student deleted successfully!');
      // Refresh the table or remove the row
    }
  }