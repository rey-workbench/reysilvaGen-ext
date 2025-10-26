// Card Generator Module

// Luhn algorithm for card validation
const calculateLuhnChecksum = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
};

// Generate card number with Luhn check
const generateCardNumber = (bin) => {
    let cardNumber = bin;
    for (let i = cardNumber.length; i < 15; i++) {
        cardNumber += Math.floor(Math.random() * 10).toString();
    }
    
    for (let i = 0; i < 10; i++) {
        if (calculateLuhnChecksum(cardNumber + i)) {
            return cardNumber + i;
        }
    }
    return cardNumber + '0';
};

// Generate expiration date
const generateExpirationDate = () => {
    const currentYear = new Date().getFullYear();
    const month = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
    const year = Math.floor(Math.random() * 5) + currentYear + 1;
    return month + '/' + year.toString().slice(-2);
};

// Generate complete card details
const generateCardDetails = (settings) => {
    const { cardDetails, currentBin, binMode } = settings;
    const { cardIndex } = settings;
    
    // Use card from list if available
    if (cardDetails && cardDetails.length > 0) {
        const cardData = cardDetails[cardIndex];
        settings.cardIndex = (cardIndex + 1) % cardDetails.length;
        const [cardNumber, month, year, cvv] = cardData.split('|');
        
        return {
            email: 'test' + Math.floor(Math.random() * 900 + 100) + '@gmail.com',
            cardNumber: cardNumber,
            expirationDate: month + '/' + year.slice(-2),
            cvv: cvv,
            cardHolderName: window.SafeExtension.generateRandomName(),
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            postalCode: '10001',
            city: 'New York',
            country: 'US',
            state: 'NY'
        };
    } else {
        // Generate random card based on BIN mode
        let bin;
        const mode = binMode || 'primary';
        
        if (mode === 'primary') {
            // Always use primary BIN
            bin = settings['bin1'];
        } else if (mode === 'secondary') {
            // Always use secondary BIN
            bin = settings['bin2'];
        } else if (mode === 'alternate') {
            // Alternate between bin1 and bin2
            bin = settings[currentBin] || settings['bin1'];
            settings.currentBin = currentBin === 'bin1' ? 'bin2' : 'bin1';
        } else {
            // Fallback to primary
            bin = settings['bin1'];
        }
        
        const randomNum = Math.floor(Math.random() * 900 + 100);
        
        return {
            email: 'test' + randomNum + '@gmail.com',
            cardNumber: generateCardNumber(bin),
            expirationDate: generateExpirationDate(),
            cvv: Math.floor(Math.random() * 900 + 100).toString(),
            cardHolderName: window.SafeExtension.generateRandomName(),
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            postalCode: '10001',
            city: 'New York',
            country: 'US',
            state: 'NY'
        };
    }
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.generateCardDetails = generateCardDetails;
window.SafeExtension.generateCardNumber = generateCardNumber;
window.SafeExtension.generateExpirationDate = generateExpirationDate;
