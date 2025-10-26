// Main Content Script - Entry Point
// All utility functions are loaded from modular files via manifest.json

(() => {
    // Import functions from global namespace
    const { 
        log, 
        isCheckoutOrPaymentPage,
        showNotification,
        addGenerateButton,
        addFloatingCredit,
        fillFormFields,
        clearFormFields,
        clickSubscribeButton
    } = window.SafeExtension;
    
    // Settings and state
    let settings = { ...DEFAULT_SETTINGS };
    
    let lastGeneratedCardDetails = { current: null };
    let hasAutoFilled = false;
    
    // Auto-fill and submit
    const autoFillAndSubmit = () => {
        const { TEXT, LOG_LEVELS, TIMEOUTS } = window.CONSTANTS;
        
        if (!settings.extensionEnabled) {
            log(LOG_LEVELS.WARN, TEXT.NOTIFICATIONS.EXTENSION_DISABLED);
            return;
        }
        
        log(LOG_LEVELS.INFO, TEXT.NOTIFICATIONS.AUTOFILLING_FORM);
        clearFormFields();
        
        setTimeout(() => {
            fillFormFields(settings, lastGeneratedCardDetails, () => {
                clickSubscribeButton(lastGeneratedCardDetails.current);
            });
        }, TIMEOUTS.AUTOFILL_DELAY);
    };
    
    // Keyboard event handler
    const handleKeyPress = (event) => {
        if (!settings.extensionEnabled) return;
        
        const { TEXT, LOG_LEVELS } = window.CONSTANTS;
        const key = event.key.toUpperCase();
        
        if (event.ctrlKey && key === settings.generateKey) {
            event.preventDefault();
            log(LOG_LEVELS.INFO, TEXT.LOGS.GENERATE_KEY_PRESSED + settings.generateKey);
            autoFillAndSubmit();
        } else if (event.ctrlKey && key === settings.clearKey) {
            event.preventDefault();
            log(LOG_LEVELS.INFO, TEXT.LOGS.CLEAR_KEY_PRESSED + settings.clearKey);
            clearFormFields();
            showNotification('info', 'Form Cleared', TEXT.NOTIFICATIONS.FORM_CLEARED);
        } else if (event.ctrlKey && key === settings.submitKey) {
            event.preventDefault();
            log(LOG_LEVELS.INFO, TEXT.LOGS.SUBMIT_KEY_PRESSED + settings.submitKey);
            clickSubscribeButton(lastGeneratedCardDetails.current);
        }
    };
    
    // Watch for card payment method selection
    const observeCardSelection = () => {
        const { SELECTORS, TIMEOUTS, TEXT, LOG_LEVELS } = window.CONSTANTS;
        
        const radioCheck = document.querySelector(SELECTORS.CARD_RADIO_PRIMARY) ||
                          document.querySelector(SELECTORS.CARD_RADIO_FALLBACK);
        
        if (radioCheck) {
            log(LOG_LEVELS.INFO, TEXT.NOTIFICATIONS.RADIO_FOUND);
            
            // Helper to check if card is selected (supports both checked and aria-checked)
            const isCardSelected = () => {
                return radioCheck.checked || 
                       radioCheck.getAttribute('aria-checked') === 'true' ||
                       radioCheck.classList.contains(SELECTORS.CHECKED_CLASS);
            };
            
            const checkInterval = setInterval(() => {
                const cardSelected = isCardSelected();
                
                if (!cardSelected && hasAutoFilled) {
                    hasAutoFilled = false;
                    log(LOG_LEVELS.INFO, TEXT.NOTIFICATIONS.CARD_UNSELECTED);
                }
                
                // Auto-fill when card is selected
                if (cardSelected && !hasAutoFilled) {
                    hasAutoFilled = true;
                    log(LOG_LEVELS.INFO, TEXT.NOTIFICATIONS.CARD_DETECTED);
                    showNotification('success', TEXT.NOTIFICATIONS.CARD_SELECTED, TEXT.NOTIFICATIONS.CARD_SELECTED_MSG);
                    
                    setTimeout(() => {
                        fillFormFields(settings, lastGeneratedCardDetails, () => {
                            clickSubscribeButton(lastGeneratedCardDetails.current);
                        });
                    }, TIMEOUTS.CARD_SELECTION_NOTICE);
                }
            }, TIMEOUTS.CARD_SELECTION_POLL);
            
            // Stop checking after configured timeout
            setTimeout(() => clearInterval(checkInterval), TIMEOUTS.CARD_OBSERVER_MAX);
        } else {
            log(LOG_LEVELS.WARN, TEXT.NOTIFICATIONS.RADIO_NOT_FOUND);
        }
    };
    
    // Initialize extension
    const initializeExtension = () => {
        const { TEXT, LOG_LEVELS, TIMEOUTS } = window.CONSTANTS;
        
        chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
            settings = result;
            settings.extensionEnabled = result.extensionEnabled;
            log(LOG_LEVELS.INFO, TEXT.LOGS.SETTINGS_LOADED, settings);
            
            if (settings.extensionEnabled) {
                if (isCheckoutOrPaymentPage()) {
                    addGenerateButton('generateCardButton', autoFillAndSubmit);
                    document.addEventListener('keydown', handleKeyPress);
                    
                    const scriptLoadedMsg = TEXT.LOGS.SCRIPT_LOADED
                        .replace('{generateKey}', settings.generateKey)
                        .replace('{clearKey}', settings.clearKey);
                    log(LOG_LEVELS.INFO, scriptLoadedMsg);
                    
                    const checkoutDetectedMsg = TEXT.LOGS.CHECKOUT_DETECTED
                        .replace('{generateKey}', settings.generateKey);
                    showNotification('info', 'Checkout Page Detected', checkoutDetectedMsg);
                    
                    // Watch for card selection
                    setTimeout(observeCardSelection, TIMEOUTS.AUTOFILL_DELAY);
                    
                    addFloatingCredit();
                } else {
                    log(LOG_LEVELS.INFO, TEXT.LOGS.NOT_CHECKOUT_PAGE);
                }
            } else {
                log(LOG_LEVELS.INFO, TEXT.LOGS.EXTENSION_DISABLED);
            }
        });
    };
    
    // Handle messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { TEXT, LOG_LEVELS } = window.CONSTANTS;
        
        if (request.action === 'updateSettings') {
            settings = request.settings;
            log(LOG_LEVELS.INFO, TEXT.LOGS.SETTINGS_UPDATED, settings);
        } else if (request.action === 'toggleExtension') {
            settings.extensionEnabled = request.enabled;
            const status = settings.extensionEnabled ? 'enabled' : 'disabled';
            log(LOG_LEVELS.INFO, TEXT.LOGS.EXTENSION_TOGGLED.replace('{status}', status));
            
            if (!settings.extensionEnabled) {
                const button = document.getElementById('generateCardButton');
                if (button) button.remove();
                document.removeEventListener('keydown', handleKeyPress);
            } else {
                initializeExtension();
            }
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtension);
    } else {
        initializeExtension();
    }
})();
