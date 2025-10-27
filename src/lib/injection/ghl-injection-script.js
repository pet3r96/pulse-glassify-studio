/**
 * PulseGen Studio - GoHighLevel Theme Injection System
 * This script is injected into GoHighLevel to enable theme customization
 * and communication with PulseGen Studio
 */

(function() {
  'use strict';

  // Configuration
  const PULSEGEN_CONFIG = {
    version: '1.0.0',
    namespace: 'pulsegen',
    debug: false,
    allowedOrigins: [
      'https://pulsegenstudio.com',
      'https://pulsegen-studio.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    messageTypes: {
      THEME_UPDATE: 'PG_THEME_UPDATE',
      THEME_REMOVE: 'PG_THEME_REMOVE',
      STATUS_REQUEST: 'PG_STATUS_REQUEST',
      STATUS_RESPONSE: 'PG_STATUS_RESPONSE',
      HEARTBEAT: 'PG_HEARTBEAT',
      ERROR: 'PG_ERROR'
    }
  };

  // State management
  let currentTheme = null;
  let isConnected = false;
  let heartbeatInterval = null;

  // Debug logging
  function log(message, data = null) {
    if (PULSEGEN_CONFIG.debug) {
      console.log(`[PulseGen Studio] ${message}`, data);
    }
  }

  // Validate origin
  function isValidOrigin(origin) {
    return PULSEGEN_CONFIG.allowedOrigins.some(allowed => 
      origin.includes(allowed.replace(/^https?:\/\//, ''))
    );
  }

  // Remove existing theme
  function removeTheme() {
    const existingStyle = document.getElementById(`${PULSEGEN_CONFIG.namespace}-theme`);
    if (existingStyle) {
      existingStyle.remove();
      log('Removed existing theme');
    }

    const existingScript = document.getElementById(`${PULSEGEN_CONFIG.namespace}-script`);
    if (existingScript) {
      existingScript.remove();
      log('Removed existing script');
    }

    // Remove any PulseGen classes
    document.body.classList.remove(`${PULSEGEN_CONFIG.namespace}-themed`);
    
    currentTheme = null;
  }

  // Inject CSS
  function injectCSS(css) {
    if (!css) return;

    // Remove existing theme first
    removeTheme();

    const style = document.createElement('style');
    style.id = `${PULSEGEN_CONFIG.namespace}-theme`;
    style.setAttribute('data-pulsegen-version', PULSEGEN_CONFIG.version);
    style.setAttribute('data-pulsegen-timestamp', Date.now().toString());
    style.textContent = css;
    
    document.head.appendChild(style);
    document.body.classList.add(`${PULSEGEN_CONFIG.namespace}-themed`);
    
    log('CSS injected successfully');
  }

  // Inject JavaScript
  function injectJS(js) {
    if (!js) return;

    const script = document.createElement('script');
    script.id = `${PULSEGEN_CONFIG.namespace}-script`;
    script.setAttribute('data-pulsegen-version', PULSEGEN_CONFIG.version);
    script.setAttribute('data-pulsegen-timestamp', Date.now().toString());
    script.textContent = js;
    
    document.head.appendChild(script);
    
    log('JavaScript injected successfully');
  }

  // Apply theme
  function applyTheme(themeData) {
    try {
      log('Applying theme', themeData);
      
      if (themeData.css) {
        injectCSS(themeData.css);
      }
      
      if (themeData.js) {
        injectJS(themeData.js);
      }

      currentTheme = {
        ...themeData,
        appliedAt: new Date().toISOString(),
        version: PULSEGEN_CONFIG.version
      };

      // Dispatch custom event
      const event = new CustomEvent('pulsegen-theme-applied', {
        detail: {
          theme: currentTheme,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);

      // Send confirmation back to PulseGen Studio
      sendMessage(PULSEGEN_CONFIG.messageTypes.STATUS_RESPONSE, {
        status: 'success',
        theme: currentTheme,
        message: 'Theme applied successfully'
      });

    } catch (error) {
      log('Error applying theme', error);
      sendMessage(PULSEGEN_CONFIG.messageTypes.ERROR, {
        error: error.message,
        theme: themeData
      });
    }
  }

  // Send message to PulseGen Studio
  function sendMessage(type, data) {
    const message = {
      type: type,
      source: 'ghl-injection',
      data: data,
      timestamp: new Date().toISOString(),
      version: PULSEGEN_CONFIG.version
    };

    // Try to send to parent window first (if in iframe)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }

    // Also send to opener (if opened from PulseGen Studio)
    if (window.opener) {
      window.opener.postMessage(message, '*');
    }

    log('Message sent', message);
  }

  // Handle incoming messages
  function handleMessage(event) {
    // Validate origin
    if (!isValidOrigin(event.origin)) {
      log('Invalid origin', event.origin);
      return;
    }

    const { type, data } = event.data;

    if (!type || !type.startsWith('PG_')) {
      return; // Not a PulseGen message
    }

    log('Message received', { type, data });

    switch (type) {
      case PULSEGEN_CONFIG.messageTypes.THEME_UPDATE:
        applyTheme(data);
        break;

      case PULSEGEN_CONFIG.messageTypes.THEME_REMOVE:
        removeTheme();
        sendMessage(PULSEGEN_CONFIG.messageTypes.STATUS_RESPONSE, {
          status: 'success',
          message: 'Theme removed successfully'
        });
        break;

      case PULSEGEN_CONFIG.messageTypes.STATUS_REQUEST:
        sendMessage(PULSEGEN_CONFIG.messageTypes.STATUS_RESPONSE, {
          status: 'connected',
          theme: currentTheme,
          version: PULSEGEN_CONFIG.version,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
        break;

      case PULSEGEN_CONFIG.messageTypes.HEARTBEAT:
        sendMessage(PULSEGEN_CONFIG.messageTypes.HEARTBEAT, {
          status: 'alive',
          timestamp: new Date().toISOString()
        });
        break;

      default:
        log('Unknown message type', type);
    }
  }

  // Initialize connection
  function initializeConnection() {
    log('Initializing PulseGen Studio connection');
    
    // Listen for messages
    window.addEventListener('message', handleMessage);
    
    // Send initial status
    sendMessage(PULSEGEN_CONFIG.messageTypes.STATUS_RESPONSE, {
      status: 'ready',
      version: PULSEGEN_CONFIG.version,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Start heartbeat
    heartbeatInterval = setInterval(() => {
      sendMessage(PULSEGEN_CONFIG.messageTypes.HEARTBEAT, {
        status: 'alive',
        timestamp: new Date().toISOString()
      });
    }, 30000); // Every 30 seconds

    isConnected = true;
    log('Connection initialized');
  }

  // Cleanup function
  function cleanup() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    window.removeEventListener('message', handleMessage);
    removeTheme();
    log('Cleanup completed');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConnection);
  } else {
    initializeConnection();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  // Expose API for debugging and manual control
  window.PulseGenStudio = {
    version: PULSEGEN_CONFIG.version,
    config: PULSEGEN_CONFIG,
    currentTheme: () => currentTheme,
    applyTheme: applyTheme,
    removeTheme: removeTheme,
    sendMessage: sendMessage,
    isConnected: () => isConnected,
    cleanup: cleanup,
    debug: (enabled) => {
      PULSEGEN_CONFIG.debug = enabled;
      log('Debug mode', enabled ? 'enabled' : 'disabled');
    }
  };

  log('PulseGen Studio injection script loaded successfully');

})();
