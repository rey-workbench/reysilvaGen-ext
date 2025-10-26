// Notification Toast UI Module

const showNotification = (type, title, message, customStyle = null) => {
    const duration = customStyle || type === 'success' || title.includes('Payment Page Detected') || title.includes('Card Generated') ? 7000 : 5000;
    
    // Remove existing notifications
    const existing = document.querySelectorAll('.ext-toast-notification');
    existing.forEach(toast => toast.remove());
    
    const notification = document.createElement('div');
    notification.className = `ext-toast-notification ext-toast-${type}`;
    
    const typeColors = {
        'success': '#4caf50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196f3',
        'default': '#ffffff'
    };
    
    const borderColor = typeColors[type] || typeColors['default'];
    
    // Ensure Font Awesome is loaded
    window.SafeExtension.ensureFontAwesome();
    
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle',
        'default': 'credit-card'
    };
    
    const iconClass = iconMap[type] || iconMap['default'];
    
    notification.innerHTML = `
        <div class="ext-toast-icon">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="ext-toast-content">
            <div class="ext-toast-title">${title}</div>
            <div class="ext-toast-message">${message}</div>
        </div>
    `;
    
    // Inject styles once
    if (!document.getElementById('ext-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'ext-toast-styles';
        style.textContent = `
            .ext-toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 300px;
                max-width: 380px;
                padding: 16px 18px;
                background: rgba(20, 20, 20, 0.98);
                border: 1px solid rgba(64, 64, 64, 0.8);
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 999999;
                animation: ext-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }
            
            .ext-toast-notification.ext-toast-success {
                border-left: 3px solid #4caf50;
            }
            
            .ext-toast-notification.ext-toast-error {
                border-left: 3px solid #f44336;
            }
            
            .ext-toast-notification.ext-toast-info {
                border-left: 3px solid #2196f3;
            }
            
            .ext-toast-notification.ext-toast-warning {
                border-left: 3px solid #ff9800;
            }
            
            .ext-toast-notification.ext-toast-default {
                border-left: 3px solid #ffffff;
            }
            
            .ext-toast-icon {
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                flex-shrink: 0;
            }
            
            .ext-toast-success .ext-toast-icon {
                color: #4caf50;
                background: rgba(76, 175, 80, 0.12);
            }
            
            .ext-toast-error .ext-toast-icon {
                color: #f44336;
                background: rgba(244, 67, 54, 0.12);
            }
            
            .ext-toast-info .ext-toast-icon {
                color: #2196f3;
                background: rgba(33, 150, 243, 0.12);
            }
            
            .ext-toast-warning .ext-toast-icon {
                color: #ff9800;
                background: rgba(255, 152, 0, 0.12);
            }
            
            .ext-toast-default .ext-toast-icon {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.12);
            }
            
            .ext-toast-content {
                flex: 1;
            }
            
            .ext-toast-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 3px;
                color: #ffffff;
                letter-spacing: -0.2px;
                line-height: 1.3;
            }
            
            .ext-toast-message {
                font-size: 12px;
                color: #a0a0a0;
                line-height: 1.4;
            }
            
            @keyframes ext-slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes ext-slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .ext-toast-notification.ext-removing {
                animation: ext-slideOut 0.3s ease-in forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('ext-removing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
};

window.SafeExtension = window.SafeExtension || {};
window.SafeExtension.showNotification = showNotification;
