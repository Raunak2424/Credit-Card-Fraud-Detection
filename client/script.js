const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const overlay = document.getElementById('overlayLoader');
const fileNameDisplay = document.getElementById('fileName');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');

// Toast notification
function showToast(message, type='info'){
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.backgroundColor = type==='success' ? '#28a745' :
                               type==='error' ? '#dc3545' : '#333';
  toast.className = 'show';
  setTimeout(()=>toast.className = toast.className.replace('show',''), 3000);
}

// Display selected file name
fileInput.addEventListener('change', () => {
  if(fileInput.files.length > 0){
    fileNameDisplay.textContent = `Selected file: ${fileInput.files[0].name}`;
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
});

// Drag & drop support
const uploadLabel = document.getElementById('uploadLabel');
uploadLabel.addEventListener('dragover', e => {
  e.preventDefault();
  uploadLabel.style.backgroundColor = 'rgba(255,255,255,0.1)';
});
uploadLabel.addEventListener('dragleave', e => {
  e.preventDefault();
  uploadLabel.style.backgroundColor = 'transparent';
});
uploadLabel.addEventListener('drop', e => {
  e.preventDefault();
  uploadLabel.style.backgroundColor = 'transparent';
  const files = e.dataTransfer.files;
  if(files.length > 0){
    fileInput.files = files;
    fileNameDisplay.textContent = `Selected file: ${files[0].name}`;
  }
});

// Process button click
processBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if(!file){
    showToast('Please select a file to process', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  overlay.classList.remove('hidden');
  progressContainer.classList.remove('hidden');
  progressBar.style.width = '0%';
  progressBar.textContent = '0%';

  // Simulated progress
  let simulatedProgress = 0;
  const interval = setInterval(()=>{
    if(simulatedProgress < 85){
      simulatedProgress += Math.floor(Math.random()*3)+1;
      progressBar.style.width = simulatedProgress + '%';
      progressBar.textContent = simulatedProgress + '%';
    }
  }, 300);

  try{
    const response = await fetch('http://127.0.0.1:5000/process-csv',{
      method: 'POST',
      body: formData
    });

    clearInterval(interval);

    if(!response.ok){
      showToast('Failed to process file', 'error');
      overlay.classList.add('hidden');
      progressContainer.classList.add('hidden');
      return;
    }

    // Animate progress to 100%
    let animateProgress = simulatedProgress;
    const animateInterval = setInterval(()=>{
      if(animateProgress < 100){
        animateProgress += 2;
        progressBar.style.width = animateProgress + '%';
        progressBar.textContent = animateProgress + '%';
      } else {
        clearInterval(animateInterval);

        // Download file with correct name
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'nonfraudtransactions.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showToast('File processed successfully!', 'success');

          setTimeout(()=>{
            overlay.classList.add('hidden');
            progressContainer.classList.add('hidden');
          }, 500);
        });
      }
    }, 30);

  } catch(err){
    clearInterval(interval);
    overlay.classList.add('hidden');
    progressContainer.classList.add('hidden');
    console.error(err);
    showToast('An error occurred while processing', 'error');
  }
});
