document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Get user data
    const user = tg.initDataUnsafe.user;
    document.getElementById('username').textContent = user ? user.first_name : 'Гость';

    // Set theme
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.link_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.button_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.button_text_color || '#ffffff');

    // Handle action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('.action-text').textContent;
            tg.showPopup({
                title: action,
                message: `Выполнить действие "${action}"?`,
                buttons: [
                    {text: "Отмена", type: "cancel"},
                    {text: "Да", type: "ok"}
                ]
            });
        });
    });

    // Handle navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            tg.HapticFeedback.impactOccurred('light');
        });
    });

    // Example: Update requests count
    document.getElementById('requests-count').textContent = '2';
}); 