const products = [
    { id: '1', name: 'Garrafa Água Sem Gás', price: 8.00, quantity: 0 },
    { id: '2', name: 'Garrafa Água Com Gás', price: 8.00, quantity: 0 },
    { id: '3', name: 'Lata Água Sem Gás', price: 12.00, quantity: 0 },
    { id: '4', name: 'Lata Água Com Gás', price: 12.00, quantity: 0 },
    { id: '5', name: 'Refrigerante', price: 10.00, quantity: 0 },
    { id: '6', name: 'Cerveja Premium', price: 15.00, quantity: 0 },
    { id: '7', name: 'Achocolatado', price: 9.00, quantity: 0 },
    { id: '8', name: 'Água de Côco', price: 9.00, quantity: 0 },
    { id: '9', name: 'Batata Pringles', price: 18.00, quantity: 0 },
    { id: '10', name: 'Barra de Cereais', price: 8.00, quantity: 0 },
    { id: '11', name: 'Castanha de Caju', price: 11.00, quantity: 0 },
    { id: '12', name: 'Chocolate Pequeno', price: 9.00, quantity: 0 },
    { id: '13', name: 'Chocolate Especial', price: 15.00, quantity: 0 },
    { id: '14', name: 'Chiclete', price: 7.00, quantity: 0 },
    { id: '15', name: 'Fini', price: 6.00, quantity: 0 }
];

const productsList = document.getElementById('productsList');
const consumptionValue = document.querySelector('.consumption-value');
const apartmentNumber = document.getElementById('apartmentNumber');
const viewAddedItemsBtn = document.getElementById('viewAddedItems');
const shareWhatsAppBtn = document.getElementById('shareWhatsApp');
const modal = document.getElementById('addedItemsModal');
const modalClose = document.querySelector('.close');
const modalItemsList = document.getElementById('modalItemsList');
const modalTotal = document.getElementById('modalTotal');
const modalTitle = document.getElementById('modalTitle');

function updateConsumption() {
    const total = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    consumptionValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function renderProducts() {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                <span>${product.quantity}</span>
                <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
        `;
        productsList.appendChild(productElement);
    });
}

function updateQuantity(id, increment) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.quantity = increment ? product.quantity + 1 : Math.max(0, product.quantity - 1);
        renderProducts();
        updateConsumption();
    }
}

productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
        const id = e.target.getAttribute('data-id');
        updateQuantity(id, e.target.classList.contains('plus'));
    }
});

function showAddedItems() {
    const addedProducts = products.filter(p => p.quantity > 0);
    modalItemsList.innerHTML = '';
    let total = 0;

    if (addedProducts.length === 0) {
        modalItemsList.innerHTML = '<p>Nenhum item adicionado</p>';
    } else {
        addedProducts.forEach(product => {
            const itemTotal = product.price * product.quantity;
            total += itemTotal;
            const itemElement = document.createElement('div');
            itemElement.className = 'modal-item';
            itemElement.innerHTML = `
                <div>
                    <div>${product.name}</div>
                    <div>${product.quantity}x R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div>R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
            `;
            modalItemsList.appendChild(itemElement);
        });
    }

    modalTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    modalTitle.textContent = `Apto: ${apartmentNumber.value || 'N/A'}`;
    modal.style.display = 'block';
}

viewAddedItemsBtn.addEventListener('click', showAddedItems);

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function shareOnWhatsApp() {
    const addedProducts = products.filter(p => p.quantity > 0);
    if (addedProducts.length === 0) {
        alert('Adicione algum item antes de compartilhar');
        return;
    }
    
    if (!apartmentNumber.value) {
        alert('Digite o número do apartamento');
        return;
    }

    let message = `*Consumo - Apto ${apartmentNumber.value}*\n\n`;
let total = 0;
addedProducts.forEach(product => {
    const itemTotal = product.price * product.quantity;
    total += itemTotal;
    message += `${product.name} - x${product.quantity} = R$ ${itemTotal.toFixed(2)}\n`;
});

    message += `\n*Total: R$ ${total.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}


shareWhatsAppBtn.addEventListener('click', shareOnWhatsApp);

renderProducts();
updateConsumption();
