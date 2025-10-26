// Import shared config
importScripts('shared/config.js');

// 🔄 AUTO-RELOAD FOR DEVELOPMENT (Remove in production)
const DEV_MODE = true;

if (DEV_MODE) {
  let ws;
  
  function connectReloader() {
    ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('🔄 Auto-reload connected');
    };
    
    ws.onmessage = (event) => {
      if (event.data === 'reload') {
        console.log('🔄 Reloading extension...');
        chrome.runtime.reload();
      }
    };
    
    ws.onerror = () => {
      console.log('⚠️ Auto-reload not available (run: npm run watch)');
    };
    
    ws.onclose = () => {
      setTimeout(connectReloader, 2000);
    };
  }
  
  connectReloader();
}

// Безпечний background script з підтримкою функціональності
console.log('Safe Background Script Loaded with functionality');

// Простий обробник повідомлень
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    if (request.action === 'ping') {
        sendResponse({status: 'safe', message: 'Extension is running safely'});
    } else if (request.action === 'updateSettings') {
        // Оновлення налаштувань без відправки даних
        chrome.storage.sync.set(request.settings, () => {
            console.log('Settings updated safely');
            sendResponse({status: 'success'});
        });
    } else if (request.action === 'toggleExtension') {
        // Перемикання розширення
        chrome.storage.sync.set({extensionEnabled: request.enabled}, () => {
            console.log('Extension toggled:', request.enabled);
            sendResponse({status: 'success'});
        });
    }
    
    return true;
});

// Простий обробник встановлення
chrome.runtime.onInstalled.addListener(() => {
    console.log('Safe extension installed');
    
    // Встановлення налаштувань за замовчуванням
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
        console.log('Default settings saved');
    });
});

// Обробник змін налаштувань
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        console.log('Settings changed:', changes);
        
        // Отримуємо повні налаштування та відправляємо їх до всіх вкладок
        chrome.storage.sync.get(DEFAULT_SETTINGS, (fullSettings) => {
            // Відправка повних налаштувань всім вкладкам
            chrome.tabs.query({}, (tabs) => {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateSettings',
                        settings: fullSettings
                    }).catch(() => {
                        // Ігноруємо помилки для вкладок без content script
                    });
                }
            });
        });
    }
});