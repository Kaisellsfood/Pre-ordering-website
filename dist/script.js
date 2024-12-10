// Load items and orders from localStorage or initialize default data
let items = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, name: "Item 1", stock: 10, price: 100 },
    { id: 2, name: "Item 2", stock: 5, price: 200 }
];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Display items for customers to view and order
function displayItems() {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = items
        .map(item => `
            <div>
                <p>${item.name} - Stock: ${item.stock} - Price: ₱${item.price}</p>
                <input type="number" id="quantity-${item.id}" placeholder="Enter quantity" min="1" max="${item.stock}">
                <button onclick="orderItem(${item.id})">Order</button>
            </div>
        `)
        .join("");
}

// Handle the order placement process
function orderItem(itemId) {
    const item = items.find(i => i.id === itemId);  
    const quantityInput = document.getElementById(`quantity-${item.id}`);
    const quantity = parseInt(quantityInput.value);

    if (!quantity || quantity <= 0 || quantity > item.stock) {
        alert("Invalid quantity! Please select a valid amount.");
        return;
    }

    // Ask for customer name and class info
    const name = prompt("Enter your name (first and last):");
    const classInfo = prompt("Enter your class (e.g., 9A):");

    if (!name || !classInfo) {
        alert("You must provide your name and class!");
        return;
    }

    // Prompt for payment method (gcash or cash)
    const paymentMethod = prompt("Select payment method: Type 'gcash' or 'cash'").toLowerCase();
    if (paymentMethod !== "gcash" && paymentMethod !== "cash") {
        alert("Invalid payment method! Please choose 'gcash' or 'cash'.");
        return;
    }

    // Update stock and save the order
    item.stock -= quantity;
    saveItems();

    const order = {
        name: name,
        class: classInfo,
        item: item.name,
        quantity: quantity,
        paymentMethod: paymentMethod
    };
    orders.push(order);
    saveOrders();

    alert(`Order placed successfully!\nItem: ${item.name}\nQuantity: ${quantity}\nPayment Method: ${paymentMethod}`);
    displayItems();
}

// Admin login and item management
function openAdmin() {
    const password = prompt("Enter Admin Password:");
    if (password === "admin123") {
        const action = prompt("Select an action:\n1. Add Item\n2. Update Stock\n3. Remove Item\n4. View Orders\n5. Remove Order\n6. Remove All Orders");

        switch (action) {
            case "1":
                addItem();
                break;
            case "2":
                updateStock();
                break;
            case "3":
                removeItem();
                break;
            case "4":
                viewOrders();
                break;
            case "5":
                removeOrder();
                break;
            case "6":
                removeAllOrders();
                break;
            default:
                alert("Invalid option!");
                break;
        }
    } else {
        alert("Access denied!");
    }
}

// Add a new item
function addItem() {
    const name = prompt("Enter item name:");
    const stock = parseInt(prompt("Enter stock quantity:"));
    const price = parseFloat(prompt("Enter item price:"));

    if (name && stock > 0 && price > 0) {
        const newItem = { id: items.length + 1, name, stock, price };
        items.push(newItem);
        saveItems();
        alert("Item added successfully!");
        displayItems();
    } else {
        alert("Invalid input!");
    }
}

// Update stock for an existing item
function updateStock() {
    const itemId = parseInt(prompt("Enter item ID to update stock:"));
    const item = items.find(i => i.id === itemId);

    if (item) {
        const newStock = parseInt(prompt(`Enter new stock for ${item.name}:`));
        if (newStock >= 0) {
            item.stock = newStock;
            saveItems();
            alert(`Stock for ${item.name} updated to ${newStock}.`);
            displayItems();
        } else {
            alert("Invalid stock value.");
        }
    } else {
        alert("Item not found.");
    }
}

// Remove an item from inventory
function removeItem() {
    const itemId = parseInt(prompt("Enter item ID to remove:"));
    const itemIndex = items.findIndex(i => i.id === itemId);

    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        saveItems();
        alert("Item removed successfully.");
        displayItems();
    } else {
        alert("Item not found.");
    }
}

// View all orders
function viewOrders() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = orders
        .map((order, index) => `
            <div>
                <p>Order #${index + 1}: ${order.name} (${order.class}) - ${order.item} x ${order.quantity} - Payment: ${order.paymentMethod}</p>
                <button onclick="removeOrder(${index})">Remove Order</button>
            </div>
        `)
        .join("");
}

// Remove an order
function removeOrder(orderIndex) {
    orders.splice(orderIndex, 1);
    saveOrders();
    alert("Order removed successfully.");
    viewOrders();
}

// Remove all orders
function removeAllOrders() {
    if (confirm("Are you sure you want to remove all orders?")) {
        orders = [];
        saveOrders();
        alert("All orders have been removed.");
        viewOrders();
    }
}

// Initialize the item display on page load
displayItems();