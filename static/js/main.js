// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Get user data
const user = tg.initDataUnsafe.user;
if (document.getElementById('username')) {
    document.getElementById('username').textContent = user ? user.first_name : 'Гость';
}

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
    console.log('Creating new request item:', data);
    const requestsList = document.getElementById('requestsList');
    if (!requestsList) {
        console.error('Requests list not found');
        return;
    }

    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const requestId = `request-${Date.now()}`;
    
    // Create new request element
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    requestItem.dataset.requestId = requestId;
    requestItem.innerHTML = `
        <div class="request-icon">📝</div>
        <div class="request-info">
            <div class="request-title">Активная заявка #${requestId}</div>
            <div class="request-details">
                Статус: Новая<br>
                Водитель: ${data.driverName}<br>
                Направление: ${data.direction}<br>
                Груз: ${data.cargoType}
            </div>
        </div>
        <div class="request-actions">
            <div class="request-time">${time}</div>
            <button class="move-to-shipment-btn" onclick="moveToShipment('${requestId}')">
                📤 Выгрузка
            </button>
        </div>
    `;
    
    if (isNew) {
        requestsList.insertBefore(requestItem, requestsList.firstChild);
    } else {
        requestsList.appendChild(requestItem);
    }
    
    updateRequestsCount();
    console.log('Request item created:', requestId);
}

// Function to update requests counter
function updateRequestsCount() {
    const activeRequests = document.getElementById('requestsList').getElementsByClassName('request-item').length;
    const counterElement = document.getElementById('requests-count');
    if (counterElement) {
        counterElement.textContent = activeRequests;
        console.log('Updated requests count:', activeRequests);
    }
}

// Function to move request to shipment
function moveToShipment(requestId) {
    console.log('Moving to shipment:', requestId);
    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    if (!requestItem) {
        console.error('Request item not found:', requestId);
        return;
    }

    const modal = document.getElementById('shipmentDateModal');
    const requestIdInput = document.getElementById('requestId');
    if (modal && requestIdInput) {
        modal.style.display = 'block';
        requestIdInput.value = requestId;
        console.log('Shipment modal shown for request:', requestId);
    } else {
        console.error('Shipment modal or input not found');
    }
}

// Function to close shipment date modal
function closeShipmentDateModal() {
    const modal = document.getElementById('shipmentDateModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Shipment modal closed');
    }
}

// Function to handle shipment date submission
function handleShipmentDateSubmit(event) {
    event.preventDefault();
    console.log('Handling shipment date submission');
    
    const requestId = document.getElementById('requestId').value;
    const shipmentDate = document.getElementById('shipmentDate').value;
    console.log('Request ID:', requestId, 'Shipment date:', shipmentDate);

    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    const shipmentList = document.getElementById('shipmentList');
    
    if (requestItem && shipmentList) {
        // Clone the request item
        const shipmentItem = requestItem.cloneNode(true);
        
        // Update the status and add shipment date
        const detailsDiv = shipmentItem.querySelector('.request-details');
        detailsDiv.innerHTML = detailsDiv.innerHTML.replace(
            'Статус: Новая',
            `Статус: На выгрузке<br>Дата выгрузки: ${shipmentDate}`
        );
        
        // Update the actions
        const actionsDiv = shipmentItem.querySelector('.request-actions');
        actionsDiv.innerHTML = `
            <div class="request-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
            <button class="move-to-closed-btn" onclick="moveToClosed('${requestId}')">
                🔒 Закрыть
            </button>
        `;
        
        // Add to shipment list
        shipmentList.insertBefore(shipmentItem, shipmentList.firstChild);
        
        // Remove from active requests
        requestItem.remove();
        
        // Update counter and close modal
        updateRequestsCount();
        closeShipmentDateModal();
        
        // Show shipment section
        showSection('shipment-section');
        
        console.log('Request moved to shipment successfully');
    } else {
        console.error('Request item or shipment list not found');
    }
}

// Function to move request to closed
function moveToClosed(requestId) {
    console.log('Moving to closed:', requestId);
    const requestItem = document.querySelector(`[data-request-id="${requestId}"]`);
    const closedList = document.getElementById('closedList');
    
    if (requestItem && closedList) {
        // Clone the request item
        const closedItem = requestItem.cloneNode(true);
        
        // Update the status
        const detailsDiv = closedItem.querySelector('.request-details');
        detailsDiv.innerHTML = detailsDiv.innerHTML.replace(
            'Статус: На выгрузке',
            'Статус: Закрыто'
        );
        
        // Update the actions
        const actionsDiv = closedItem.querySelector('.request-actions');
        actionsDiv.innerHTML = `
            <div class="request-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        
        // Add to closed list
        closedList.insertBefore(closedItem, closedList.firstChild);
        
        // Remove from shipment list
        requestItem.remove();
        
        // Show closed section
        showSection('closed-section');
        
        console.log('Request moved to closed successfully');
    } else {
        console.error('Request item or closed list not found');
    }
}

// Function to show section
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        console.log('Section displayed:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Handle form submission
function handleRequestSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log('Form data:', data);
    
    // Create new request item
    createRequestItem(data);
    
    // Reset form and close modal
    event.target.reset();
    closeRequestForm();
    
    // Show success message
    alert('Заявка успешно создана!');
}

// Initialize when DOM is loaded
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

    // Add navigation handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });

    // Handle form submission
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.onsubmit = handleRequestSubmit;
    }

    // Show initial section
    showSection('requests-section');
});

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
});

// Handle main button click
tg.onEvent('mainButtonClicked', function(){
    tg.sendData("some data");
}); 