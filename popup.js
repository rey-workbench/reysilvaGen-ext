let settings = DEFAULT_SETTINGS;
let currentHotkeyIndex = 0;

const hotkeyConfig = [
    { label: 'Generate Key', key: 'generateKey', icon: 'keyboard' },
    { label: 'Clear Key', key: 'clearKey', icon: 'eraser' },
    { label: 'Submit Key', key: 'submitKey', icon: 'paper-plane' }
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup initialized');
    loadSettings();
    initEventListeners();
    initCollapsibleCards();
});

function initEventListeners() {
    document.getElementById('extensionToggle').addEventListener('change', toggleExtension);
    document.getElementById('openSettings').addEventListener('click', openSettingsPage);
    document.getElementById('saveBinButton').addEventListener('click', saveBinSettings);
    
    const bin1Input = document.getElementById('bin1Input');
    const bin2Input = document.getElementById('bin2Input');
    
    bin1Input.addEventListener('input', () => validate('binInput', { input: bin1Input }));
    bin2Input.addEventListener('input', () => validate('binInput', { input: bin2Input }));
    
    // Hotkey carousel navigation
    document.getElementById('prevHotkey').addEventListener('click', () => navigateHotkey(-1));
    document.getElementById('nextHotkey').addEventListener('click', () => navigateHotkey(1));
}

function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
        settings = result;
        updateUI();
    });
}

function updateUI() {
    document.getElementById('extensionToggle').checked = settings.extensionEnabled;
    updateStatusBadge(settings.extensionEnabled);
    
    document.getElementById('bin1Display').textContent = settings.bin1 || 'Not Set';
    document.getElementById('bin2Display').textContent = settings.bin2 || 'Not Set';
    
    const binMode = settings.binMode || 'primary';
    document.getElementById('binModeDisplay').textContent = BIN_MODE_LABELS[binMode] || 'Primary Only';
    
    document.getElementById('bin1Input').value = settings.bin1 || '';
    document.getElementById('bin2Input').value = settings.bin2 || '';
    document.getElementById('binModeSelect').value = binMode;
    
    // Update hotkey display
    updateHotkeyDisplay();
}

function updateStatusBadge(enabled) {
    const badge = document.getElementById('statusBadge');
    if (enabled) {
        badge.innerHTML = `
            <div class="status-text active">Extension Enabled</div>
            <div class="status-info">
                <i class="fas fa-circle icon-xs icon-success"></i>
                <span>Ready to autofill</span>
            </div>
        `;
    } else {
        badge.innerHTML = `
            <div class="status-text inactive">Extension Disabled</div>
            <div class="status-info">
                <i class="fas fa-circle icon-xs"></i>
                <span>Toggle to activate</span>
            </div>
        `;
    }
}

function toggleExtension() {
    const enabled = document.getElementById('extensionToggle').checked;
    
    chrome.storage.sync.set({extensionEnabled: enabled}, () => {
        settings.extensionEnabled = enabled;
        updateStatusBadge(enabled);
        
        chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleExtension',
                    enabled: enabled
                }).catch(() => {});
            }
        });
    });
}

function openSettingsPage() {
    chrome.runtime.openOptionsPage();
}

function navigateHotkey(direction) {
    currentHotkeyIndex = (currentHotkeyIndex + direction + hotkeyConfig.length) % hotkeyConfig.length;
    updateHotkeyDisplay();
}

function updateHotkeyDisplay() {
    const config = hotkeyConfig[currentHotkeyIndex];
    const keyValue = settings[config.key] || 'X';
    
    document.getElementById('keyLabel').textContent = config.label;
    document.getElementById('keyDisplay').textContent = `Ctrl + ${keyValue}`;
}

function initCollapsibleCards() {
    // Load saved collapse state
    const savedState = JSON.parse(localStorage.getItem('popupCollapseState') || '{}');
    
    // Initialize all card headers
    document.querySelectorAll('.card-header[data-card]').forEach(header => {
        const cardName = header.dataset.card;
        const body = header.nextElementSibling;
        const chevron = header.querySelector('.card-chevron');
        
        // Restore saved state (default: only status expanded)
        const isCollapsed = savedState[cardName] !== undefined ? savedState[cardName] : (cardName !== 'status');
        
        if (isCollapsed) {
            body.classList.add('collapsed');
            chevron.classList.add('collapsed');
        }
        
        // Add click handler
        header.addEventListener('click', () => {
            const isCurrentlyCollapsed = body.classList.contains('collapsed');
            
            body.classList.toggle('collapsed');
            chevron.classList.toggle('collapsed');
            
            // Save state
            savedState[cardName] = !isCurrentlyCollapsed;
            localStorage.setItem('popupCollapseState', JSON.stringify(savedState));
        });
    });
}

function saveBinSettings() {
    const bin1Raw = document.getElementById('bin1Input').value.trim();
    const bin2Raw = document.getElementById('bin2Input').value.trim();
    const binMode = document.getElementById('binModeSelect').value;
    
    // Process BIN values (decode Base64 if needed)
    const bin1 = validate('processBIN', { value: bin1Raw });
    const bin2 = validate('processBIN', { value: bin2Raw });
    
    const validation = validate('binSettings', { bin1, bin2, binMode });
    if (!validation.valid) {
        showNotification(validation.message, 'error');
        return;
    }
    
    chrome.storage.sync.set({ bin1, bin2, binMode }, () => {
        console.log('BIN settings saved:', { bin1, bin2, binMode });
        settings.bin1 = bin1;
        settings.bin2 = bin2;
        settings.binMode = binMode;
        
        // Update input fields with processed values
        document.getElementById('bin1Input').value = bin1;
        document.getElementById('bin2Input').value = bin2;
        
        document.getElementById('bin1Display').textContent = bin1 || 'Not Set';
        document.getElementById('bin2Display').textContent = bin2 || 'Not Set';
        document.getElementById('binModeDisplay').textContent = BIN_MODE_LABELS[binMode] || 'Primary Only';
        
        showNotification('BIN settings saved successfully!', 'success');
        
        chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateSettings',
                    settings: { bin1, bin2, binMode }
                }).catch(() => {});
            }
        });
    });
}
