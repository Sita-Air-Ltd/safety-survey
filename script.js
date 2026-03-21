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
    
    // YOUR WEB APP URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcdvAK9sc_d_q97kGu3ILitUiT1UAdrrlzCmopEKI5soHLA4KPPnY3LyWBX7wup7u4/exec';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '';
    
    try {
        console.log("Sending to:", GOOGLE_SCRIPT_URL);
        console.log("Data:", responses);
        
        // REMOVED 'no-cors' to get real response
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',  // Changed from 'no-cors' to 'cors'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responses)
        });
        
        const result = await response.json();
        console.log("Response from server:", result);
        
        if (result.success) {
            statusDiv.className = 'success';
            statusDiv.innerHTML = '✓ Survey submitted successfully! Thank you for your feedback.';
            this.reset();
            document.getElementById('surveyDate').value = new Date().toISOString().split('T')[0];
        } else {
            throw new Error(result.error || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        statusDiv.className = 'error';
        statusDiv.innerHTML = `⚠ Submission failed: ${error.message}`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Survey';
    }
});

// Auto-set today's date
document.getElementById('surveyDate').value = new Date().toISOString().split('T')[0];
