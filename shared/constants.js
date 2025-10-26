// ============================================================================
// CONSTANTS - Single source of truth for all hardcoded values
// ============================================================================

// ============================================================================
// SELECTORS - DOM element selectors
// ============================================================================
const SELECTORS = {
    // Payment method selectors
    CARD_RADIO_PRIMARY: '#payment-method-accordion-item-title-card',
    CARD_RADIO_FALLBACK: 'input[type="radio"][value="card"]',
    CARD_ACCORDION_BUTTON: '[data-testid="card-accordion-item-button"]',
    
    // Form field selectors
    EMAIL: 'input#email',
    CARD_NUMBER: 'input#cardNumber',
    CARD_EXPIRY: 'input#cardExpiry',
    CARD_CVC: 'input#cardCvc',
    BILLING_NAME: 'input#billingName',
    BILLING_ADDRESS_LINE1: 'input#billingAddressLine1',
    BILLING_ADDRESS_LINE2: 'input#billingAddressLine2',
    BILLING_POSTAL_CODE: 'input#billingPostalCode',
    BILLING_LOCALITY: 'input#billingLocality',
    BILLING_COUNTRY: 'select#billingCountry',
    BILLING_STATE: 'select#billingState',
    
    // Submit button selectors
    SUBMIT_BUTTON_PRIMARY: 'button[type="submit"]',
    SUBMIT_BUTTON_CLASS: 'button.SubmitButton',
    SUBMIT_BUTTON_CLASS_ALT: '.SubmitButton',
    SUBMIT_BUTTON_ID: '#submitButton',
    
    // Submit button disabled classes
    DISABLED_CLASS: 'disabled',
    INCOMPLETE_CLASS: 'SubmitButton--incomplete',
    CHECKED_CLASS: 'is-checked'
};

// ============================================================================
// TIMEOUTS - Timing values in milliseconds
// ============================================================================
const TIMEOUTS = {
    // Autofill delays
    AUTOFILL_DELAY: 1000,
    CARD_SELECTION_NOTICE: 2000,
    COUNTRY_STATE_WAIT: 500,
    FORM_COMPLETE_CALLBACK: 1000,
    
    // Polling intervals
    CARD_SELECTION_POLL: 500,
    SUBMIT_BUTTON_WAIT: 500,
    BUTTON_ANIMATION: 100,
    
    // Maximum timeouts
    CARD_OBSERVER_MAX: 60000,      // 60 seconds
    SUBMIT_RETRY_MAX: 10,          // retries
    
    // Visual feedback
    BASE64_FEEDBACK_DURATION: 1500
};

// ============================================================================
// UI STYLES - CSS values and styling constants
// ============================================================================
const UI_STYLES = {
    // Colors
    COLORS: {
        SUCCESS_BORDER: '#10b981',
        SUCCESS_BG: 'transparent',  // Transparent agar tidak menutupi form
        SUCCESS_GLOW: '0 0 0 3px rgba(16, 185, 129, 0.1)',  // Subtle glow effect
        BUTTON_BG: 'rgba(255, 255, 255, 0.95)',
        BUTTON_BG_HOVER: 'rgba(255, 255, 255, 1)',
        BUTTON_TEXT: '#000000',
        CREDIT_BG: 'rgba(20, 20, 20, 0.92)',
        CREDIT_TEXT: '#ffffff',
        CREDIT_BORDER: 'rgba(64, 64, 64, 0.6)',
        CREDIT_BORDER_HOVER: 'rgba(128, 128, 128, 0.8)'
    },
    
    // Positions
    POSITIONS: {
        BUTTON_BOTTOM: '70px',
        BUTTON_RIGHT: '20px',
        CREDIT_BOTTOM: '20px',
        CREDIT_RIGHT: '20px'
    },
    
    // Z-indexes
    Z_INDEX: {
        GENERATE_BUTTON: 999998,
        CREDIT_BADGE: 999997
    },
    
    // Sizes
    SIZES: {
        BUTTON_BORDER_RADIUS: '8px',
        BUTTON_PADDING: '10px 18px',
        BUTTON_FONT_SIZE: '13px',
        CREDIT_PADDING: '8px 14px',
        CREDIT_FONT_SIZE: '11px',
        ICON_SIZE: '13px',
        ICON_SIZE_SMALL: '11px'
    }
};

// ============================================================================
// VALIDATION - Validation rules and constraints
// ============================================================================
const VALIDATION = {
    // BIN validation
    BIN_MIN_LENGTH: 6,
    BIN_MAX_LENGTH: 16,
    BASE64_MIN_LENGTH: 4,
    
    // Regex patterns
    REGEX: {
        BASE64: /^[A-Za-z0-9+/=_-]+$/,
        DIGITS_ONLY: /^[0-9]+$/,
        NON_DIGITS: /\D/g,
        SINGLE_LETTER: /^[A-Z]$/
    },
    
    // Validation types
    TYPES: {
        BIN_INPUT: 'binInput',
        KEY_INPUT: 'keyInput',
        PROCESS_BIN: 'processBIN',
        BIN_SETTINGS: 'binSettings',
        KEYS_DIFFERENT: 'keysDifferent'
    }
};

// ============================================================================
// DEFAULT VALUES - Form and billing defaults
// ============================================================================
const DEFAULTS = {
    // Billing information
    COUNTRY: 'US',
    COUNTRY_NAME: 'United States',
    STATE: 'NY',
    STATE_NAME: 'New York',
    
    // Extension metadata
    VERSION: 'v1.1',
    NAME: 'ReysilvaGen'
};

// ============================================================================
// TEXT CONSTANTS - Button texts and submit button search terms
// ============================================================================
const TEXT = {
    // Submit button search terms (lowercase)
    SUBMIT_BUTTON_TERMS: ['start trial', 'subscribe', 'pay', 'submit'],
    
    // Button labels
    GENERATE_BUTTON_LABEL: 'Generate Card',
    CREDIT_BADGE_LABEL: 'ReysilvaGen v1.1',
    
    // Notification messages
    NOTIFICATIONS: {
        EXTENSION_DISABLED: 'Extension is disabled. Cannot autofill and submit.',
        AUTOFILLING_FORM: 'Autofilling form (submit button will auto-click).',
        FORM_CLEARED: 'All fields have been cleared.',
        CARD_SELECTED: 'Card Selected',
        CARD_SELECTED_MSG: 'Auto-filling form in 2 seconds...',
        CARD_UNSELECTED: 'Card payment method unselected. Ready for next selection.',
        CARD_DETECTED: 'Card payment method detected as selected by user!',
        CARD_DETECTED_POLL: 'Card payment method detected as selected (polling)!',
        CARD_CLICKED: 'Card payment method clicked and selected!',
        SUBMIT_DISABLED: 'Submit button found but is disabled. Waiting...',
        SUBMIT_ENABLED: 'Submit button now enabled, clicking...',
        SUBMIT_STILL_DISABLED: 'Submit button still disabled after waiting. Skipping auto-click.',
        SUBMIT_CLICKING: 'Automatically clicking submit button...',
        SUBMIT_NOT_FOUND: 'Submit button not found.',
        RADIO_FOUND: 'Card radio button found, monitoring for selection...',
        RADIO_NOT_FOUND: 'Card radio button not found. Autofill may not work.',
        RADIO_MONITORING_BUTTON: 'Also monitoring parent button for clicks...',
        COUNTRY_SELECTED: 'Country auto-selected: United States',
        STATE_SELECTED: 'State auto-selected: New York',
        MANUAL_GENERATION: 'Manually triggered card generation',
        FORM_SUBMITTED: 'Form Submitted',
        PROCESSING_PAYMENT: 'Processing payment...'
    },
    
    // Log messages
    LOGS: {
        GENERATE_KEY_PRESSED: 'Generate key pressed: ',
        CLEAR_KEY_PRESSED: 'Clear key pressed: ',
        SUBMIT_KEY_PRESSED: 'Submit key pressed: ',
        SCRIPT_LOADED: 'Script loaded. Press "{generateKey}" to generate new card details, "{clearKey}" to clear form fields.',
        CHECKOUT_DETECTED: 'Click "Card" payment method, then press Ctrl+{generateKey}',
        NOT_CHECKOUT_PAGE: 'Not a checkout or payment page. Extension features disabled.',
        EXTENSION_DISABLED: 'Extension is disabled.',
        EXTENSION_ENABLED: 'Extension enabled',
        EXTENSION_TOGGLED: 'Extension {status}',
        SETTINGS_UPDATED: 'Settings updated dynamically:',
        SETTINGS_LOADED: 'Loaded settings:',
        FIELDS_CLEARED: 'Form fields cleared.'
    }
};

// ============================================================================
// LOG LEVELS - Logging level constants
// ============================================================================
const LOG_LEVELS = {
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SUCCESS: 4,
    DEBUG: 0
};

// ============================================================================
// PAGE DETECTION - URL patterns for checkout page detection
// ============================================================================
const PAGE_PATTERNS = {
    HOSTNAME: [/^pay\./, /checkout\.stripe\.com/, /^buy\.stripe/],
    PATHNAME: [/checkout/i, /stripe/i]
};

// ============================================================================
// TIMEZONE - Logging timezone
// ============================================================================
const TIMEZONE = 'Africa/Casablanca';

// ============================================================================
// FONT AWESOME - Icon classes
// ============================================================================
const ICONS = {
    BOLT: 'fas fa-bolt',
    SHIELD: 'fas fa-shield-alt',
    CHECK_CIRCLE: 'fa-check-circle',
    EXCLAMATION_CIRCLE: 'fa-exclamation-circle'
};

// ============================================================================
// Export all constants
// ============================================================================
if (typeof window !== 'undefined') {
    window.CONSTANTS = {
        SELECTORS,
        TIMEOUTS,
        UI_STYLES,
        VALIDATION,
        DEFAULTS,
        TEXT,
        LOG_LEVELS,
        PAGE_PATTERNS,
        TIMEZONE,
        ICONS
    };
}

