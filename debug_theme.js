// Run this in browser console to check what's happening
console.log('=== Theme Button Debug ===');
console.log('1. setTheme exists:', typeof setTheme !== 'undefined');
console.log('2. getTheme exists:', typeof getTheme !== 'undefined');

// Try to manually trigger theme change
console.log('3. Attempting manual theme change...');
try {
    if (typeof setTheme === 'undefined') {
        console.error('ERROR: setTheme function not found!');
        console.log('4. Checking if utils.js loaded...');
        console.log('   - formatNumber exists:', typeof formatNumber !== 'undefined');
        console.log('   - sanitizeHTML exists:', typeof sanitizeHTML !== 'undefined');
    } else {
        setTheme('light');
        console.log('5. Theme changed to light successfully!');
    }
} catch (e) {
    console.error('6. Error:', e);
}

// Check event listener
const btn = document.getElementById('theme-toggle');
console.log('7. Button element:', btn);
console.log('8. Button onclick:', btn ? btn.onclick : 'N/A');
console.log('9. Button event listeners:', btn ? getEventListeners(btn) : 'N/A');
