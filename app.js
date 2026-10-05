// Menu Dataset with Categories & Unsplash Images
const menuItems = [
  {
    id: 1,
    name: "Artisan Cappuccino",
    category: "coffee",
    price: 180,
    desc: "Double shot espresso with steamed velvety milk foam.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Iced Caramel Macchiato",
    category: "coffee",
    price: 210,
    desc: "Cold espresso over vanilla milk with rich caramel drizzle.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Cold Brew Special",
    category: "coffee",
    price: 190,
    desc: "Steeped for 18 hours for a smooth, low-acid coffee taste.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Butter Croissant",
    category: "bakery",
    price: 140,
    desc: "Flaky, golden-baked French pastry made with pure butter.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Blueberry Cheesecake Slices",
    category: "bakery",
    price: 240,
    desc: "Creamy baked New York cheesecake topped with blueberry compote.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Chocolate Lava Cake",
    category: "bakery",
    price: 220,
    desc: "Warm chocolate cake with a molten dark chocolate center.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Avocado Sourdough Toast",
    category: "fastfood",
    price: 260,
    desc: "Smashed avocado, cherry tomatoes, and microgreens on sourdough.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Truffle Fries & Dip",
    category: "fastfood",
    price: 190,
    desc: "Crispy cut fries tossed in truffle oil and parmesan cheese.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Classic Smash Burger",
    category: "fastfood",
    price: 290,
    desc: "Double patty smash burger with cheddar cheese and house sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop"
  }
];

// Default Table State is null
let tableNumber = null;
let cart = [];

window.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  updateTableBadge();
  
  // Prompt modal on first load if null
  if (!tableNumber) {
    openTableModal();
  }
});

/* Modal & Table Handlers */
function openTableModal() {
  const modal = document.getElementById('tableModal');
  const input = document.getElementById('tableInput');
  if (modal) modal.style.display = 'flex';
  if (input) {
    input.value = tableNumber || '';
    input.focus();
  }
}

function saveTableNumber() {
  const input = document.getElementById('tableInput');
  const val = input ? input.value.trim() : '';
  const num = parseInt(val, 10);

  // Strictly enforce numbers between 1 and 13
  if (!val || isNaN(num) || num < 1 || num > 13) {
    alert("Please enter a valid table number between 1 and 13.");
    if (input) input.value = '';
    return;
  }

  tableNumber = num;
  updateTableBadge();
  
  const modal = document.getElementById('tableModal');
  if (modal) modal.style.display = 'none';
}

function updateTableBadge() {
  const badgeText = document.getElementById('tableBadgeText');
  const badgeBtn = document.getElementById('tableBadge');

  if (!badgeText || !badgeBtn) return;

  if (tableNumber) {
    badgeText.innerText = `#${tableNumber}`;
    badgeBtn.classList.remove('unassigned');
  } else {
    badgeText.innerText = 'Not Set';
    badgeBtn.classList.add('unassigned');
  }
}

/* Strict Order Placement Logic */
function placeOrder() {
  // 1. Mandatory Table Check
  if (!tableNumber) {
    alert("Table number is required before placing an order.");
    openTableModal();
    return;
  }

  // 2. Empty Cart Check
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to order.");
    return;
  }

  // Save order with verified table number
  const existingOrders = JSON.parse(localStorage.getItem('qb_orders') || '[]');
  const newOrder = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    table: `Table #${tableNumber}`,
    items: cart,
    status: 'Pending',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  existingOrders.push(newOrder);
  localStorage.setItem('qb_orders', JSON.stringify(existingOrders));

  alert(`Order submitted successfully for Table #${tableNumber}! Sent to kitchen.`);
  cart = [];
  updateCartUI();
}

// Table Number Handlers
function checkTableNumber() {
  const modal = document.getElementById('tableModal');
  const badge = document.getElementById('tableBadge');
  
  if (!tableNumber) {
    if (modal) modal.style.display = 'flex';
    if (badge) badge.innerText = 'Table: Not Set';
  } else {
    if (modal) modal.style.display = 'none';
    if (badge) badge.innerText = `Table #${tableNumber}`;
  }
}

function setTableNumber() {
  const input = document.getElementById('tableInput');
  const value = input ? input.value.trim() : '';

  if (!value || isNaN(value) || parseInt(value) <= 0) {
    alert("Please enter a valid table number.");
    return;
  }

  tableNumber = value;
  localStorage.setItem('qb_table', tableNumber);
  checkTableNumber();
}

function promptTableChange() {
  const newTable = prompt("Update your Table Number:", tableNumber || "");
  if (newTable && !isNaN(newTable) && parseInt(newTable) > 0) {
    tableNumber = newTable.trim();
    localStorage.setItem('qb_table', tableNumber);
    checkTableNumber();
  }
}

// Render Menu Cards
function renderMenu(categoryFilter) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const filtered = categoryFilter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === categoryFilter);

  grid.innerHTML = filtered.map(item => `
    <div class="menu-card">
      <div class="menu-card-content">
        <img src="${item.image}" alt="${item.name}" class="menu-card-img" />
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <span class="price">₹${item.price}</span>
        </div>
      </div>
      <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">+ Add</button>
    </div>
  `).join('');
}

// Category Filter Switcher
function filterCategory(category, button) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  renderMenu(category);
}

// Cart & Order System
function addToCart(itemName, price) {
  cart.push({ name: itemName, price: price });
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cartCount && cartTotal) {
    cartCount.innerText = `${cart.length} item${cart.length === 1 ? '' : 's'}`;
    cartTotal.innerText = `₹${total}`;
  }
}

function placeOrder() {
  if (!tableNumber) {
    checkTableNumber();
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty. Add some items before ordering.");
    return;
  }

  const existingOrders = JSON.parse(localStorage.getItem('qb_orders') || '[]');
  const newOrder = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    table: `Table #${tableNumber}`,
    items: cart,
    status: 'Pending',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  existingOrders.push(newOrder);
  localStorage.setItem('qb_orders', JSON.stringify(existingOrders));

  alert(`Order placed successfully for Table #${tableNumber}! Sent to kitchen display.`);
  cart = [];
  updateCartUI();
}

