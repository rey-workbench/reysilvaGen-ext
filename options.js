document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        bin1: document.getElementById('bin1'),
        bin2: document.getElementById('bin2'),
        binMode: document.getElementById('binMode'),
        generateKey: document.getElementById('generateKey'),
        clearKey: document.getElementById('clearKey'),
        submitKey: document.getElementById('submitKey'),
        cardDetails: document.getElementById('cardDetails'),
        saveButton: document.getElementById('saveButton'),
        resetButton: document.getElementById('resetButton')
    };

    function loadSettings() {
        chrome.storage.sync.get(DEFAULT_SETTINGS, function(items) {
            elements.bin1.value = items.bin1 || '';
            elements.bin2.value = items.bin2 || '';
            elements.binMode.value = items.binMode || 'primary';
            elements.generateKey.value = items.generateKey || 'X';
            elements.clearKey.value = items.clearKey || 'C';
            elements.submitKey.value = items.submitKey || 'H';
            elements.cardDetails.value = items.cardDetails || '';
            console.log('Settings loaded successfully');
        });
    }

    function saveSettings() {
        const bin1Raw = elements.bin1.value.trim();
        const bin2Raw = elements.bin2.value.trim();
        const binMode = elements.binMode.value;
        const generateKey = elements.generateKey.value.toUpperCase() || 'X';
        const clearKey = elements.clearKey.value.toUpperCase() || 'C';
        const submitKey = elements.submitKey.value.toUpperCase() || 'H';
        const cardDetails = elements.cardDetails.value.trim();

        // Process BIN values (decode Base64 if needed)
        const bin1 = validate('processBIN', { value: bin1Raw });
        const bin2 = validate('processBIN', { value: bin2Raw });

        const binValidation = validate('binSettings', { bin1, bin2, binMode });
        if (!binValidation.valid) {
            showNotification(binValidation.message, 'error');
            return;
        }

        // Validate all keys are different
        if (generateKey === clearKey || generateKey === submitKey || clearKey === submitKey) {
            showNotification('All hotkeys must be different', 'error');
            return;
        }

        const settings = {
            bin1,
            bin2,
            binMode,
            generateKey,
            clearKey,
            submitKey,
            cardDetails
        };

        chrome.storage.sync.set(settings, function() {
            console.log('Settings saved:', settings);
            
            // Update input fields with processed values
            elements.bin1.value = bin1;
            elements.bin2.value = bin2;
            
            showNotification('Settings saved successfully!', 'success');
        });
    }

    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            chrome.storage.sync.set(DEFAULT_SETTINGS, function() {
                loadSettings();
                showNotification('Settings reset to defaults', 'success');
                console.log('Settings reset to defaults');
            });
        }
    }

    elements.bin1.addEventListener('input', () => validate('binInput', { input: elements.bin1 }));
    elements.bin2.addEventListener('input', () => validate('binInput', { input: elements.bin2 }));
    elements.generateKey.addEventListener('input', () => validate('keyInput', { input: elements.generateKey }));
    elements.clearKey.addEventListener('input', () => validate('keyInput', { input: elements.clearKey }));
    elements.submitKey.addEventListener('input', () => validate('keyInput', { input: elements.submitKey }));

    elements.saveButton.addEventListener('click', saveSettings);
    elements.resetButton.addEventListener('click', resetSettings);

    elements.bin1.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') saveSettings();
    });

    loadSettings();

    console.log('Options page initialized successfully');
});
