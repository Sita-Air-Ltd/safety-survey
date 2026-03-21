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
    
    // Question 20
    responses.q20 = document.querySelector('textarea[name="q20"]').value || '';
    
    // YOUR CORRECT WEB APP URL - from your new deployment
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcdvAK9sc_d_q97kGu3ILitUiT1UAdrrlzCmopEKI5soHLA4KPPnY3LyWBX7wup7u4/exec';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '';
    
    try {
        console.log("Sending to:", GOOGLE_SCRIPT_URL);
        console.log("Data:", responses);
        
        // USE THE CORRECT URL VARIABLE HERE
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responses)
        });
        
        // With no-cors, we can't read response, so assume success
        statusDiv.className = 'success';
        statusDiv.innerHTML = '✓ Survey submitted successfully! Thank you for your feedback.';
        this.reset();
        document.getElementById('surveyDate').value = new Date().toISOString().split('T')[0];
        
        // Show a note about checking the sheet
        setTimeout(() => {
            statusDiv.innerHTML = '✓ Survey submitted! Please check the Google Sheet for your response.';
        }, 3000);
        
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
