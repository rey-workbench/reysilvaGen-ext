// Form Filler Module

// Element cache
const cachedElements = {};

const getElement = (selector) => {
    if (!cachedElements[selector]) {
        cachedElements[selector] = document.querySelector(selector);
    }
    return cachedElements[selector];
};

// Log generated card details
const logGeneratedDetails = (details, fromList) => {
    const source = fromList ? 'from list' : 'generated';
    window.SafeExtension.log(1, `Card details (${source}):`, {
        email: details.email,
        card: details.cardNumber,
        expiry: details.expirationDate,
        cvv: details.cvv,
        name: details.cardHolderName,
        address: details.addressLine1 + ', ' + details.city + ', ' + details.state + ' ' + details.postalCode
    });
};

// Clear form fields
const clearFormFields = () => {
    const { SELECTORS, TEXT, LOG_LEVELS } = window.CONSTANTS || {};
    
    const selectors = [
        SELECTORS?.EMAIL || 'input#email',
        SELECTORS?.CARD_NUMBER || 'input#cardNumber',
        SELECTORS?.CARD_EXPIRY || 'input#cardExpiry',
        SELECTORS?.CARD_CVC || 'input#cardCvc',
        SELECTORS?.BILLING_NAME || 'input#billingName',
        SELECTORS?.BILLING_ADDRESS_LINE1 || 'input#billingAddressLine1',
        SELECTORS?.BILLING_ADDRESS_LINE2 || 'input#billingAddressLine2',
        SELECTORS?.BILLING_POSTAL_CODE || 'input#billingPostalCode',
        SELECTORS?.BILLING_LOCALITY || 'input#billingLocality',
        SELECTORS?.BILLING_COUNTRY || 'select#billingCountry',
        SELECTORS?.BILLING_STATE || 'select#billingState'
    ];
    
    selectors.forEach(selector => {
        const element = getElement(selector);
        if (element) {
            element.value = '';
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    
    const logLevel = LOG_LEVELS?.INFO || 1;
    const logMsg = TEXT?.LOGS?.FIELDS_CLEARED || 'Form fields cleared.';
    window.SafeExtension.log(logLevel, logMsg);
};

// Fill form fields with card details
const fillFormFields = (settings, lastCardDetails, onComplete) => {
    const cardDetails = window.SafeExtension.generateCardDetails(settings);
    lastCardDetails.current = cardDetails;
    
    const fieldMappings = {
        'input#email': cardDetails.email,
        'input#cardNumber': cardDetails.cardNumber,
        'input#cardExpiry': cardDetails.expirationDate,
        'input#cardCvc': cardDetails.cvv,
        'input#billingName': cardDetails.cardHolderName,
        'input#billingAddressLine1': cardDetails.addressLine1,
        'input#billingAddressLine2': cardDetails.addressLine2,
        'input#billingPostalCode': cardDetails.postalCode,
        'input#billingLocality': cardDetails.city
    };
    
    for (const [selector, value] of Object.entries(fieldMappings)) {
        const element = getElement(selector);
        if (element) {
            window.SafeExtension.simulateTyping(element, value);
        }
    }
    
    // Auto-select US country
    const countrySelect = document.querySelector('select#billingCountry');
    if (countrySelect) {
        countrySelect.value = 'US';
        countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
        countrySelect.dispatchEvent(new Event('input', { bubbles: true }));
        window.SafeExtension.log(1, 'Country auto-selected: United States');
        
        // Wait for state dropdown and auto-select NY
        setTimeout(() => {
            const stateSelect = document.querySelector('select#billingState');
            if (stateSelect) {
                stateSelect.value = 'NY';
                stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                stateSelect.dispatchEvent(new Event('input', { bubbles: true }));
                window.SafeExtension.log(1, 'State auto-selected: New York');
            }
            
            // Trigger callback after all fields filled
            if (onComplete) {
                setTimeout(() => onComplete(), 1000);
            }
        }, 500);
    } else {
        // If no country select, trigger callback
        if (onComplete) {
            setTimeout(() => onComplete(), 1000);
        }
    }
    
    logGeneratedDetails(cardDetails, settings.cardDetails && settings.cardDetails.length > 0);
    return cardDetails;
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.fillFormFields = fillFormFields;
window.SafeExtension.clearFormFields = clearFormFields;
