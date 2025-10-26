// Submit Button Handler Module

// Show notification after submit
const showSubmitNotification = (lastCardDetails) => {
    if (lastCardDetails) {
        const { cardNumber, expirationDate, cvv } = lastCardDetails;
        const [month, year] = expirationDate.split('/');
        window.SafeExtension.showNotification('success', 'Form Submitted', 
            'Card: ' + cardNumber + '|' + month + '|' + year + '|' + cvv);
    } else {
        window.SafeExtension.showNotification('success', 'Form Submitted', 'Processing payment...');
    }
};

// Click submit button
const clickSubscribeButton = (lastCardDetails) => {
    // Try multiple selectors for submit button
    let submitButton = document.querySelector('button[type="submit"]') ||
                       document.querySelector('button.SubmitButton') ||
                       document.querySelector('.SubmitButton') ||
                       document.querySelector('#submitButton');
    
    // If not found, try finding by text content
    if (!submitButton) {
        const allButtons = document.querySelectorAll('button');
        for (let btn of allButtons) {
            const text = btn.textContent || '';
            if (text.toLowerCase().includes('start trial') || 
                text.toLowerCase().includes('subscribe') || 
                text.toLowerCase().includes('pay') ||
                text.toLowerCase().includes('submit')) {
                submitButton = btn;
                break;
            }
        }
    }
    
    if (submitButton) {
        // Check if button is disabled
        if (submitButton.disabled || submitButton.getAttribute('disabled') || 
            submitButton.classList.contains('disabled') ||
            submitButton.classList.contains('SubmitButton--incomplete')) {
            window.SafeExtension.log(2, 'Submit button found but is disabled. Waiting...');
            
            // Wait for button to be enabled
            let retries = 0;
            const waitInterval = setInterval(() => {
                if (!submitButton.disabled && !submitButton.classList.contains('SubmitButton--incomplete')) {
                    clearInterval(waitInterval);
                    window.SafeExtension.log(1, 'Submit button now enabled, clicking...');
                    window.SafeExtension.triggerRealisticClick(submitButton);
                    showSubmitNotification(lastCardDetails);
                } else if (retries++ > 10) {
                    clearInterval(waitInterval);
                    window.SafeExtension.log(2, 'Submit button still disabled after waiting. Skipping auto-click.');
                }
            }, 500);
        } else {
            window.SafeExtension.log(1, 'Automatically clicking submit button...');
            window.SafeExtension.triggerRealisticClick(submitButton);
            showSubmitNotification(lastCardDetails);
        }
    } else {
        window.SafeExtension.log(2, 'Submit button not found.');
    }
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.clickSubscribeButton = clickSubscribeButton;
