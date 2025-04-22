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

// Function to create new request item
function createRequestItem(data, isNew = true) {
    const requestsList = document.getElementById('requestsList');
    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    // Get the current number of requests
    const requestsCount = requestsList.getElementsByClassName('request-item').length;
    const newRequestNumber = requestsCount + 1;
    
    // Create new request element
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    requestItem.dataset.requestId = `request-${Date.now()}`;
    requestItem.innerHTML = `
        <div class="request-icon">📝</div>
        <div class="request-info">
            <div class="request-title">Активная заявка #${newRequestNumber}</div>
            <div class="request-details">
                Статус: Новая<br>
                Водитель: ${data.driverName}<br>
                Направление: ${data.direction}<br>
                Груз: ${data.cargoType}
            </div>
        </div>
        <div class="request-actions">
            <div class="request-time">${time}</div>
            <button class="move-to-shipment-btn" onclick="moveToShipment('${requestItem.dataset.requestId}')">
                📤 Выгрузка
            </button>
        </div>
    `;
    
    // Add new request to the top of the list
    if (isNew) {
        requestsList.insertBefore(requestItem, requestsList.firstChild);
    } else {
        requestsList.appendChild(requestItem);
    }
    
    // Update requests counter
    updateRequestsCount();
}

// Function to update requests counter
function updateRequestsCount() {
    const activeRequests = document.getElementById('requestsList').getElementsByClassName('request-item').length;
    const counterElement = document.getElementById('requests-count');
    if (counterElement) {
        counterElement.textContent = activeRequests;
    }
}

// Function to move request to shipment
function moveToShipment(requestId) {
    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    if (!requestItem) return;

    // Show shipment date modal
    const modal = document.getElementById('shipmentDateModal');
    const requestIdInput = document.getElementById('requestId');
    modal.style.display = 'block';
    requestIdInput.value = requestId;
}

// Function to close shipment date modal
function closeShipmentDateModal() {
    const modal = document.getElementById('shipmentDateModal');
    modal.style.display = 'none';
}

// Function to handle shipment date submission
function handleShipmentDateSubmit(event) {
    event.preventDefault();
    
    const requestId = document.getElementById('requestId').value;
    const shipmentDate = document.getElementById('shipmentDate').value;
    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    
    if (requestItem) {
        // Clone the request item
        const shipmentItem = requestItem.cloneNode(true);
        
        // Update the status and add shipment date
        const detailsDiv = shipmentItem.querySelector('.request-details');
        detailsDiv.innerHTML = detailsDiv.innerHTML.replace(
            'Статус: Новая',
            `Статус: На выгрузке<br>Дата выгрузки: ${shipmentDate}`
        );
        
        // Remove the move button and add close button
        const actionsDiv = shipmentItem.querySelector('.request-actions');
        actionsDiv.innerHTML = `
            <div class="request-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
            <button class="move-to-closed-btn" onclick="moveToClosed('${requestId}')">
                🔒 Закрыть
            </button>
        `;
        
        // Add to shipment list
        const shipmentList = document.getElementById('shipmentList');
        shipmentList.insertBefore(shipmentItem, shipmentList.firstChild);
        
        // Remove from active requests
        requestItem.remove();
        
        // Update counter
        updateRequestsCount();
        
        // Close modal
        closeShipmentDateModal();
    }
}

// Function to move request to closed
function moveToClosed(requestId) {
    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    if (!requestItem) return;
    
    // Clone the request item
    const closedItem = requestItem.cloneNode(true);
    
    // Update the status
    const detailsDiv = closedItem.querySelector('.request-details');
    detailsDiv.innerHTML = detailsDiv.innerHTML.replace(
        'Статус: На выгрузке',
        'Статус: Закрыто'
    );
    
    // Remove the action buttons
    const actionsDiv = closedItem.querySelector('.request-actions');
    actionsDiv.innerHTML = `
        <div class="request-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    
    // Add to closed list
    const closedList = document.getElementById('closedList');
    closedList.insertBefore(closedItem, closedList.firstChild);
    
    // Remove from shipment list
    requestItem.remove();
}

// Handle form submission
function handleRequestSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form data:', data);
    
    // Create new request item in the list
    createRequestItem(data);
    
    // Close the modal after submission
    closeRequestForm();
    
    // Reset form
    event.target.reset();
    
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

    // Add navigation handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });
});

// Handle navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Example: Update requests count
document.getElementById('requests-count').textContent = '2';

// Handle main button click
tg.onEvent('mainButtonClicked', function(){
    tg.sendData("some data");
}); 