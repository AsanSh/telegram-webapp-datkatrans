// Modal functions
function showRequestForm() {
    console.log('showRequestForm called');
    const modal = document.getElementById('requestFormModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
        console.log('Modal shown');
    } else {
        console.error('Modal element not found');
    }
}

function closeRequestForm() {
    console.log('closeRequestForm called');
    const modal = document.getElementById('requestFormModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        console.log('Modal hidden');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('requestFormModal');
    if (event.target === modal) {
        closeRequestForm();
    }
}

// Handle form submission
function handleRequestSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form data:', data);
    
    // Close the modal after submission
    closeRequestForm();
    
    // Show success message
    alert('Заявка успешно создана!');
}

// Initialize Telegram WebApp
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Add button handler
    const addButton = document.querySelector('.add-button');
    if (addButton) {
        console.log('Add button found');
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add button clicked');
            showRequestForm();
        });
    } else {
        console.error('Add button not found');
    }

    // Other action buttons
    const actionButtons = document.querySelectorAll('.action-button:not(.add-button)');
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

    // Handle form submission
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.onsubmit = handleRequestSubmit;
    }
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

// Handle main button click
tg.onEvent('mainButtonClicked', function(){
    tg.sendData("some data");
}); 