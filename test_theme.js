// COPY AND PASTE THIS INTO BROWSER CONSOLE ON localhost:8080
// After navigating to the Profile tab

console.clear();
console.log('=== Theme Debug Test ===');

// 1. Check if functions exist
console.log('1. window.setTheme exists:', typeof window.setTheme);
console.log('2. window.getTheme exists:', typeof window.getTheme);

// 2. Check button
const btn = document.getElementById('theme-toggle');
console.log('3. Button found:', !!btn);
if (btn) {
    console.log('4. Button HTML:', btn.outerHTML.substring(0, 200));
}

// 3. Try manual theme change
console.log('\n5. Attempting to change theme manually...');
if (typeof window.setTheme === 'function') {
    console.log('6. Current theme:', document.documentElement.getAttribute('data-theme') || 'dark');
    console.log('7. Calling setTheme("light")...');
    window.setTheme('light');
    console.log('8. New theme:', document.documentElement.getAttribute('data-theme') || 'dark');
    console.log('9. Background color:', getComputedStyle(document.body).backgroundColor);
} else {
    console.error('ERROR: setTheme is not a function!');
    console.log('Type:', typeof window.setTheme);
}

// 4. Check if click event is attached
if (btn) {
    console.log('\n10. Simulating button click...');
    btn.click();
    setTimeout(() => {
        console.log('11. Theme after click:', document.documentElement.getAttribute('data-theme') || 'dark');
    }, 100);
}
