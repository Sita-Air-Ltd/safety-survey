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
    
    // CORRECT URL based on your working deployment
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/sitaair.com.np/s/AKfycbyH1jfR0UYYQGGYKwseqR2OvF94fc8qiebn3BTA53fsxs8aAQJYmT7JbKjJUQXMCp7T/exec';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responses)
        });
        
        // With no-cors, we can't read the response, but the request was sent
        statusDiv.className = 'success';
        statusDiv.innerHTML = '✓ Survey submitted successfully! Thank you for your feedback.';
        
        // Reset the form
        this.reset();
        document.getElementById('surveyDate').value = new Date().toISOString().split('T')[0];
        
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
