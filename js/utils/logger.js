// Logging utility
const log = (level, message, data = null) => {
    const { TIMEZONE, LOG_LEVELS } = window.CONSTANTS || {};
    
    const timestamp = new Date().toLocaleString('en-GB', {
        timeZone: TIMEZONE || 'Africa/Casablanca',
        hour12: true
    });
    
    const LEVELS = LOG_LEVELS || { INFO: 1, WARN: 2, ERROR: 3, SUCCESS: 4, DEBUG: 0 };
    
    let levelText = '';
    switch(level) {
        case LEVELS.INFO: levelText = 'INFO'; break;
        case LEVELS.WARN: levelText = 'WARN'; break;
        case LEVELS.ERROR: levelText = 'ERROR'; break;
        case LEVELS.SUCCESS: levelText = 'SUCCESS'; break;
        default: levelText = 'DEBUG'; break;
    }
    
    console.log(`[${timestamp}] ${levelText}: ${message}`, data || '');
};

// Check if it's a checkout/payment page
const isCheckoutOrPaymentPage = () => {
    const { PAGE_PATTERNS } = window.CONSTANTS || {};
    const patterns = PAGE_PATTERNS || {
        HOSTNAME: [/^pay\./, /checkout\.stripe\.com/, /^buy\.stripe/],
        PATHNAME: [/checkout/i, /stripe/i]
    };
    
    const allPatterns = [...patterns.HOSTNAME, ...patterns.PATHNAME];
    const isPaymentPage = allPatterns.some(pattern => 
        pattern.test(window.location.hostname) || pattern.test(window.location.pathname)
    );
    console.log('isCheckoutOrPaymentPage:', isPaymentPage);
    return isPaymentPage;
};

// Make functions available globally
window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.log = log;
window.SafeExtension.isCheckoutOrPaymentPage = isCheckoutOrPaymentPage;
