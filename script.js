document.getElementById('safetySurvey').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('statusMessage');
    
    // Set date if not provided
    const dateInput = document.getElementById('surveyDate');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Collect all responses
    const responses = {
        timestamp: new Date().toISOString(),
        name: document.getElementById('employeeName').value,
        designation: document.getElementById('designation').value,
        date: dateInput.value
    };
    
    // Collect questions 1-19
    for (let i = 1; i <= 19; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        responses[`q${i}`] = selected ? selected.value : 'Not answered';
    }
    
    // Question 20
    responses.q20 = document.querySelector('textarea[name="q20"]').value || '';
    
    // Add redirect URL
    responses.redirect = window.location.href;
    
    // Create a hidden form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbzVQOrK8AvdCIDo8pQSlShyDvVazwH7c4uEvaRfb1pDXM7iZYnETMIsQrpuU6CuxtAz/exec';
    form.target = '_self';
    
    // Add data as a single JSON string
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'data';
    hiddenField.value = JSON.stringify(responses);
    form.appendChild(hiddenField);
    
    // Show submitting message
    statusDiv.className = '';
    statusDiv.innerHTML = 'Submitting... Please wait.';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Note: The page will redirect, so no need to reset here
});
