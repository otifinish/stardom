// WhatsApp Business Number
const whatsappNumber = "2349128597738";
// Select the menu container
const menuGrid = document.getElementById("menu-grid");

// Select all filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Store coffee products
let coffees = [];

// Store the selected category
let selectedCategory = "all";

// Display coffee products
function displayCoffeeMenu() {

    if (!menuGrid) {
        console.error("Menu grid element not found!");
        return;
    }

    // Clear existing products
    menuGrid.innerHTML = "";

    // Filter products by category
    const filteredCoffees = coffees.filter(coffee => {

        return (
            selectedCategory === "all" ||
            coffee.category === selectedCategory
        );

    });

    // Check if products are available
    if (filteredCoffees.length === 0) {
        menuGrid.textContent = "No coffee products found.";
        return;
    }

    // Create coffee cards
    filteredCoffees.forEach(coffee => {

        const card = document.createElement("article");

        card.classList.add("menu-card");

        card.dataset.category = coffee.category;

        // Create image
        const image = document.createElement("img");

        image.src = coffee.image;
        image.alt = coffee.name;

        // Create information container
        const menuInfo = document.createElement("div");

        menuInfo.classList.add("menu-info");

        // Coffee name
        const name = document.createElement("h3");

        name.textContent = coffee.name;

        // Coffee description
        const description = document.createElement("p");

        description.textContent = coffee.description;

        // Coffee price
        const price = document.createElement("span");

        price.classList.add("price");

        price.textContent =
            `₦${Number(coffee.price).toLocaleString("en-NG")}`;

        // Order button
        
const orderButton = document.createElement("button");

orderButton.type = "button";

orderButton.classList.add("add-cart-btn");

orderButton.textContent = "Add to Cart";

orderButton.addEventListener("click", function () {

    addToCart(coffee);

});


        // Add elements to menu information
        menuInfo.append(
            name,
            description,
            price,
            orderButton
        );

        // Add elements to coffee card
        card.append(image, menuInfo);

        // Display coffee card
        menuGrid.appendChild(card);

    });

    console.log(
        `${filteredCoffees.length} coffee products displayed successfully.`
    );

}


// Load coffee products from JSON
async function loadCoffeeMenu() {

    try {

        console.log("Loading coffee products...");

        const response = await fetch("./coffee.json");

        if (!response.ok) {

            throw new Error(
                `JSON file error: ${response.status}`
            );

        }

        // Convert response into JavaScript data
        const data = await response.json();

        // Check JSON structure
        if (!Array.isArray(data)) {

            throw new Error(
                "Coffee JSON must contain an array."
            );

        }

        coffees = data;

        console.log("Coffee data loaded:", coffees);

        // Display all coffee products
        displayCoffeeMenu();

    } catch (error) {

        console.error("Menu loading error:", error);

        menuGrid.textContent =
            "Sorry! We could not load the coffee products. Please try again.";

    }

}


// Filter coffee products
filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Get selected category
        selectedCategory = this.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        // Activate selected button
        this.classList.add("active");

        // Display selected products
        displayCoffeeMenu();

    });

});


// Start loading the coffee menu
loadCoffeeMenu();

// =================================
// SHOPPING CART SYSTEM
// =================================

// Load saved cart from localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];
} catch (error) {
    console.error("Could not load saved cart:", error);
    cart = [];
}


// Add coffee to cart
function addToCart(coffee) {

    const existingItem = cart.find(item => item.id === coffee.id);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...coffee,
            quantity: 1
        });

    }

    saveCart();

    renderCart();

    console.log("Product added to cart:", coffee.name);

}


// Save cart
function saveCart() {

    localStorage.setItem("coffeeCart", JSON.stringify(cart));

}


// Display cart
function renderCart() {

    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");

    const totalItems = document.getElementById("cart-total-items");

    const totalPrice = document.getElementById("cart-total-price");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    // Calculate total quantity
    const itemCount = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    // Calculate total price
    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity, 0
    );

    // Update cart numbers
    cartCount.textContent = itemCount;

    totalItems.textContent = itemCount;

    totalPrice.textContent =
        `₦${total.toLocaleString("en-NG")}`;

    // Display empty cart
    if (cart.length === 0) {

        cartItems.textContent = "Your cart is currently empty.";

        return;

    }

    // Display cart products
    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        const information = document.createElement("div");

        const name = document.createElement("h3");

        name.textContent = item.name;

        const price = document.createElement("p");

        price.textContent =
            `Price: ₦${Number(item.price).toLocaleString("en-NG")}`;

        const quantity = document.createElement("p");

        quantity.textContent = `Quantity: ${item.quantity}`;

        const subtotal = document.createElement("p");

        subtotal.textContent =
            `Subtotal: ₦${(Number(item.price) * item.quantity).toLocaleString("en-NG")}`;

        information.append(name, price, quantity, subtotal);

        const actions = document.createElement("div");

        actions.classList.add("cart-actions");

        // Decrease quantity
        const decrease = document.createElement("button");

        decrease.textContent = "-";

        decrease.dataset.action = "decrease";

        decrease.dataset.id = item.id;

        // Increase quantity
        const increase = document.createElement("button");

        increase.textContent = "+";

        increase.dataset.action = "increase";

        increase.dataset.id = item.id;

        // Remove product
        const remove = document.createElement("button");

        remove.textContent = "Remove";

        remove.dataset.action = "remove";

        remove.dataset.id = item.id;

        actions.append(decrease, increase, remove);

        cartItem.append(information, actions);

        cartItems.appendChild(cartItem);

    });

}


// Handle cart buttons
document.getElementById("cart-items").addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.id !== id);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }

    saveCart();

    renderCart();

});


// Clear entire cart
document.getElementById("clear-cart").addEventListener("click", function() {

    cart = [];

    saveCart();

    renderCart();

});


// Checkout button
document.getElementById("checkout-btn").addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    alert("Your order is ready for checkout!");

});


// Display previously saved cart
renderCart();

// SELECT CHECKOUT ELEMENTS
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutSection = document.getElementById("checkout-section");

// CHECKOUT BUTTON EVENT
checkoutBtn.addEventListener("click", function () {

    // Show customer checkout form
    checkoutSection.classList.add("active");

    // Scroll smoothly to checkout
    checkoutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

const findNearby = document.querySelector("#find-nearby");
const searchLocation = document.querySelector("#search-location");
const locationInput = document.querySelector("#location-input");
const locationMessage = document.querySelector("#location-message");

// Find coffee shops using the customer's current location
findNearby.addEventListener("click", function () {

    if (!navigator.geolocation) {
        locationMessage.textContent =
            "Your browser does not support location services.";
        return;
    }

    locationMessage.textContent = "Finding your location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const mapURL =
                `https://www.google.com/maps/search/coffee+shops/@${latitude},${longitude},14z`;

            locationMessage.textContent =
                "Opening nearby coffee shops...";

            window.open(mapURL, "_blank");
        },

        function () {
            locationMessage.textContent =
                "Location access denied. Please search manually.";
        }
    );
});

// Search using a city or area
searchLocation.addEventListener("click", function () {

    const location = locationInput.value.trim();

    if (location === "") {
        locationMessage.textContent =
            "Please enter a city or area.";
        return;
    }

    const mapURL =
        `https://www.google.com/maps/search/coffee+shops+in+${encodeURIComponent(location)}`;

    window.open(mapURL, "_blank");
});
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("delivery-address").value;

    const message = `
Hello, I want to place an order.

Customer Name: ${name}
Phone: ${phone}
Delivery Address: ${address}

Thank you!
    `;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

});

