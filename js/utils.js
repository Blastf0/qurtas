// Utility Functions for Qurtas

/**
 * Generate a UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get the start of the current week (Monday)
 * @returns {Date}
 */
function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

/**
 * Get the end of the current week (Sunday)
 * @returns {Date}
 */
function getEndOfWeek(date = new Date()) {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

/**
 * Check if a date is in the current week
 * @param {string|Date} dateString
 * @returns {boolean}
 */
function isInCurrentWeek(dateString) {
    const date = new Date(dateString);
    const start = getStartOfWeek();
    const end = getEndOfWeek();
    return date >= start && date <= end;
}

/**
 * Format a date to a readable string
 * @param {string|Date} dateString
 * @param {boolean} includeTime
 * @returns {string}
 */
function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return date.toLocaleDateString('en-US', options);
}

/**
 * Format duration in minutes to readable string
 * @param {number} minutes
 * @returns {string}
 */
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculate reading speed (pages per hour)
 * @param {number} pages
 * @param {number} minutes
 * @returns {number}
 */
function calculateReadingSpeed(pages, minutes) {
    if (minutes === 0) return 0;
    return Math.round((pages / minutes) * 60);
}

/**
 * Debounce function calls
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {string} type - success, error, info, warning
 * @param {number} duration - milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    bottom: calc(var(--bottom-nav-height) + var(--space-lg));
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg-elevated);
    color: var(--color-text-primary);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 9999;
    animation: slideUp 0.3s ease-out;
    max-width: calc(100% - 2rem);
    text-align: center;
  `;

    // Add type-specific styling
    const typeColors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-accent-primary)'
    };

    toast.style.borderLeft = `4px solid ${typeColors[type] || typeColors.info}`;

    document.body.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Deep clone an object
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Calculate percentage
 * @param {number} current
 * @param {number} total
 * @returns {number}
 */
function calculatePercentage(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
}

/**
 * Format number with commas
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
