// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the form element
    const form = document.getElementById('safetySurvey');
    
    // Check if form exists (safety check)
    if (!form) {
        console.error('Form with id "safetySurvey" not found!');
        return;
    }
    
    // Add submit event listener
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const statusDiv = document.getElementById('statusMessage');
        
        // Set date if not provided
        const dateInput = document.getElementById('surveyDate');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Collect all responses
        const responses = {
            timestamp: new Date().toISOString(),
            name: document.getElementById('employeeName') ? document.getElementById('employeeName').value : '',
            designation: document.getElementById('designation') ? document.getElementById('designation').value : '',
            date: dateInput ? dateInput.value : ''
        };
        
        // Collect questions 1-19
        for (let i = 1; i <= 19; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            responses[`q${i}`] = selected ? selected.value : 'Not answered';
        }
        
        // Question 20
        const q20Field = document.querySelector('textarea[name="q20"]');
        responses.q20 = q20Field ? q20Field.value : '';
        
        // Add redirect URL (back to your site)
        responses.redirect = window.location.href.split('?')[0]; // Remove any query params
        
        // YOUR NEW APPS SCRIPT URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEQAFE7bv8esi1_8v59J6evwoQpWgje5ihgBVOMPxM_ZvYRLbLg2pmSnccl_t3-oek/exec';
        
        // Create a hidden form for submission
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = GOOGLE_SCRIPT_URL;
        hiddenForm.target = '_self';
        
        // Add data as a single JSON string
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'data';
        hiddenField.value = JSON.stringify(responses);
        hiddenForm.appendChild(hiddenField);
        
        // Show submitting message
        if (statusDiv) {
            statusDiv.innerHTML = 'Submitting... Please wait.';
            statusDiv.style.color = '#1a4a6f';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }
        
        // Submit the form
        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    });
    
    // Auto-set today's date
    const dateInput = document.getElementById('surveyDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    console.log("Survey form initialized successfully!");
    console.log("Using Apps Script URL: https://script.google.com/macros/s/AKfycbyEQAFE7bv8esi1_8v59J6evwoQpWgje5ihgBVOMPxM_ZvYRLbLg2pmSnccl_t3-oek/exec");
});
