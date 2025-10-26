// Shared validation function - Single entry point for all validation tasks
function validate(type, params) {
    const { VALIDATION, UI_STYLES, TIMEOUTS } = window.CONSTANTS || {};
    
    // Fallback if constants not loaded yet
    const RULES = VALIDATION || {
        BIN_MIN_LENGTH: 6,
        BIN_MAX_LENGTH: 16,
        BASE64_MIN_LENGTH: 4,
        REGEX: {
            BASE64: /^[A-Za-z0-9+/=_-]+$/,
            DIGITS_ONLY: /^[0-9]+$/,
            NON_DIGITS: /\D/g,
            SINGLE_LETTER: /^[A-Z]$/
        }
    };
    
    const COLORS = UI_STYLES?.COLORS || { 
        SUCCESS_BORDER: '#10b981', 
        SUCCESS_BG: 'transparent',
        SUCCESS_GLOW: '0 0 0 3px rgba(16, 185, 129, 0.1)'
    };
    const FEEDBACK_DURATION = TIMEOUTS?.BASE64_FEEDBACK_DURATION || 1500;
    
    switch(type) {
        case 'binInput': {
            // params: { input: HTMLInputElement }
            const { input } = params;
            const value = input.value.trim();
            
            // Check if input might be Base64
            const isBase64 = value.length >= RULES.BASE64_MIN_LENGTH && 
                           RULES.REGEX.BASE64.test(value) && 
                           !RULES.REGEX.DIGITS_ONLY.test(value);
            
            if (isBase64) {
                try {
                    const decoded = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
                    const digits = decoded.replace(RULES.REGEX.NON_DIGITS, '');
                    
                    if (digits && digits.length >= RULES.BIN_MIN_LENGTH) {
                        input.value = digits.substring(0, RULES.BIN_MAX_LENGTH);
                        
                        // Only change border and add subtle glow - no background
                        input.style.borderColor = COLORS.SUCCESS_BORDER;
                        input.style.boxShadow = COLORS.SUCCESS_GLOW;
                        input.style.transition = 'all 0.3s ease';
                        
                        setTimeout(() => {
                            input.style.borderColor = '';
                            input.style.boxShadow = '';
                            input.style.transition = '';
                        }, FEEDBACK_DURATION);
                        return;
                    }
                } catch (e) {
                    // Decode failed, continue to normal validation
                }
            }
            
            // Normal BIN validation (only digits)
            input.value = input.value.replace(RULES.REGEX.NON_DIGITS, '').substring(0, RULES.BIN_MAX_LENGTH);
            break;
        }
        
        case 'keyInput': {
            // params: { input: HTMLInputElement }
            const { input } = params;
            const value = input.value.toUpperCase();
            input.value = (value && RULES.REGEX.SINGLE_LETTER.test(value)) ? value : '';
            break;
        }
        
        case 'processBIN': {
            // params: { value: string }
            // Returns: processed BIN string
            const { value } = params;
            if (!value) return '';
            
            const trimmed = value.trim();
            const isBase64 = trimmed.length >= RULES.BASE64_MIN_LENGTH && 
                           RULES.REGEX.BASE64.test(trimmed) && 
                           !RULES.REGEX.DIGITS_ONLY.test(trimmed);
            
            if (isBase64) {
                try {
                    const decoded = atob(trimmed.replace(/-/g, '+').replace(/_/g, '/'));
                    const digits = decoded.replace(RULES.REGEX.NON_DIGITS, '');
                    
                    if (digits && digits.length >= RULES.BIN_MIN_LENGTH) {
                        return digits.substring(0, RULES.BIN_MAX_LENGTH);
                    }
                } catch (e) {
                    // Decode failed, continue to normal processing
                }
            }
            
            return trimmed.replace(RULES.REGEX.NON_DIGITS, '').substring(0, RULES.BIN_MAX_LENGTH);
        }
        
        case 'binSettings': {
            // params: { bin1: string, bin2: string, binMode: string }
            // Returns: { valid: boolean, message?: string }
            const { bin1, bin2, binMode } = params;
            
            if (bin1 && bin1.length < RULES.BIN_MIN_LENGTH) {
                return { valid: false, message: `Primary BIN must be at least ${RULES.BIN_MIN_LENGTH} digits` };
            }
            
            if (bin2 && bin2.length < RULES.BIN_MIN_LENGTH) {
                return { valid: false, message: `Secondary BIN must be at least ${RULES.BIN_MIN_LENGTH} digits` };
            }
            
            if (binMode === 'primary' && !bin1) {
                return { valid: false, message: 'Primary BIN is required for Primary Only mode' };
            }
            
            if (binMode === 'secondary' && !bin2) {
                return { valid: false, message: 'Secondary BIN is required for Secondary Only mode' };
            }
            
            if (binMode === 'alternate' && (!bin1 || !bin2)) {
                return { valid: false, message: 'Both BINs are required for Alternate mode' };
            }
            
            return { valid: true };
        }
        
        case 'keysDifferent': {
            // params: { key1: string, key2: string }
            // Returns: { valid: boolean, message?: string }
            const { key1, key2 } = params;
            
            if (key1 === key2) {
                return { valid: false, message: 'Generate and Clear keys must be different' };
            }
            
            return { valid: true };
        }
        
        default:
            console.error('Unknown validation type:', type);
            return { valid: false, message: 'Unknown validation type' };
    }
}
