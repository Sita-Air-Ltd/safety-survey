document.getElementById('safetySurvey').addEventListener('submit', async function(e) {
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
    
    // Question 20 (open-ended)
    responses.q20 = document.querySelector('textarea[name="q20"]').value || '';
    
    // Submit to Google Sheets via Web App URL
    // You'll replace this URL after setting up Google Apps Script
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responses)
        });
        
        // With no-cors, we can't read response, so assume success
        statusDiv.className = 'success';
        statusDiv.innerHTML = '✓ Survey submitted successfully! Thank you for your feedback.';
        this.reset();
        
    } catch (error) {
        console.error('Submission error:', error);
        statusDiv.className = 'error';
        statusDiv.innerHTML = '⚠ Submission failed. Please check your connection and try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Survey';
    }
});

// Auto-set today's date
document.getElementById('surveyDate').value = new Date().toISOString().split('T')[0];
