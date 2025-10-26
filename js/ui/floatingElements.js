// Floating UI Elements - Generate Button & Credit Badge

// Add Generate Card Button
const addGenerateButton = (buttonId, onClickCallback) => {
    window.SafeExtension.ensureFontAwesome();
    
    const button = document.createElement('button');
    button.id = buttonId;
    button.innerHTML = '<i class="fas fa-bolt" style="margin-right: 6px; font-size: 13px;"></i>Generate Card';
    button.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        color: #000000;
        padding: 10px 18px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        z-index: 999998;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    `;
    
    document.body.appendChild(button);
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)';
        button.style.background = 'rgba(255, 255, 255, 1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)';
        button.style.background = 'rgba(255, 255, 255, 0.95)';
    });
    
    button.addEventListener('click', () => {
        window.SafeExtension.log(1, 'Manually triggered card generation');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = 'translateY(0)', 100);
        if (onClickCallback) onClickCallback();
    });
};

// Add Floating Credit Badge
const addFloatingCredit = () => {
    window.SafeExtension.ensureFontAwesome();
    
    const creditDiv = document.createElement('div');
    creditDiv.innerHTML = '<i class="fas fa-shield-alt" style="margin-right: 6px; font-size: 11px;"></i> ReysilvaGen v1.1';
    creditDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(20, 20, 20, 0.92);
        color: #ffffff;
        padding: 8px 14px;
        border: 1px solid rgba(64, 64, 64, 0.6);
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        z-index: 999997;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    `;
    
    creditDiv.addEventListener('mouseenter', () => {
        creditDiv.style.transform = 'translateY(-1px)';
        creditDiv.style.borderColor = 'rgba(128, 128, 128, 0.8)';
        creditDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    });
    
    creditDiv.addEventListener('mouseleave', () => {
        creditDiv.style.transform = 'translateY(0)';
        creditDiv.style.borderColor = 'rgba(64, 64, 64, 0.6)';
        creditDiv.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
    });
    
    document.body.appendChild(creditDiv);
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.addGenerateButton = addGenerateButton;
window.SafeExtension.addFloatingCredit = addFloatingCredit;
