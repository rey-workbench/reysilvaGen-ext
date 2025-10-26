// Event Helper - Realistic click simulation
const triggerRealisticClick = (element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const mouseEventInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        button: 0,
        buttons: 1
    };
    
    element.dispatchEvent(new MouseEvent('mouseenter', mouseEventInit));
    element.dispatchEvent(new MouseEvent('mouseover', mouseEventInit));
    element.dispatchEvent(new MouseEvent('mousedown', mouseEventInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseEventInit));
    element.dispatchEvent(new MouseEvent('click', mouseEventInit));
    element.dispatchEvent(new PointerEvent('pointerdown', mouseEventInit));
    element.dispatchEvent(new PointerEvent('pointerup', mouseEventInit));
    element.dispatchEvent(new PointerEvent('click', mouseEventInit));
    
    // Also try native click
    if (element.click) {
        element.click();
    }
};

// Simulate typing in input field
const simulateTyping = (element, value) => {
    element.focus();
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.blur();
};

// Ensure Font Awesome is loaded
const ensureFontAwesome = () => {
    if (!document.getElementById('ext-fontawesome')) {
        const faLink = document.createElement('link');
        faLink.id = 'ext-fontawesome';
        faLink.rel = 'stylesheet';
        faLink.href = chrome.runtime.getURL('assets/fontawesome/all.min.css');
        document.head.appendChild(faLink);
    }
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.triggerRealisticClick = triggerRealisticClick;
window.SafeExtension.simulateTyping = simulateTyping;
window.SafeExtension.ensureFontAwesome = ensureFontAwesome;
