// Diagnostic Script - Run this in browser console
console.log('=== Qurtas Diagnostic ===');
console.log('1. App object exists:', typeof app !== 'undefined');
console.log('2. Storage object exists:', typeof storage !== 'undefined');
console.log('3. setTheme function exists:', typeof setTheme !== 'undefined');
console.log('4. Current theme:', document.documentElement.getAttribute('data-theme') || 'dark');
console.log('5. Theme in localStorage:', localStorage.getItem('qurtas_theme'));
console.log('6. View container exists:', !!document.getElementById('view-container'));
console.log('7. Bottom nav exists:', !!document.getElementById('bottom-nav'));
console.log('8. Theme toggle button exists:', !!document.getElementById('theme-toggle'));

// Try to navigate to profile
if (typeof app !== 'undefined') {
    console.log('9. Navigating to profile...');
    app.navigateTo('profile');
    setTimeout(() => {
        console.log('10. Theme toggle after navigation:', !!document.getElementById('theme-toggle'));
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            console.log('11. Theme toggle HTML:', toggle.outerHTML);
        } else {
            console.log('11. Theme toggle NOT FOUND in DOM');
            console.log('12. View container HTML:', document.getElementById('view-container').innerHTML.substring(0, 500));
        }
    }, 500);
}
