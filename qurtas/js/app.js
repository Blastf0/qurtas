// Main App Entry Point

document.addEventListener('DOMContentLoaded', () => {
    console.log('Qurtas App Initialized');

    const initBtn = document.getElementById('init-btn');
    if (initBtn) {
        initBtn.addEventListener('click', () => {
            alert('Welcome to Qurtas! Setup is complete.');
        });
    }
});
