const menuGrid = document.getElementById("menu-grid");

async function loadCoffeeMenu() {

    try {

        console.log("Loading coffee products...");

        const response = await fetch("./coffee.json");

        if (!response.ok) {
            throw new Error(
                `JSON file error: ${response.status}`
            );
        }

        const coffees = await response.json();

        console.log("Coffee data loaded:", coffees);

        if (!Array.isArray(coffees)) {
            throw new Error("Coffee JSON must contain an array.");
        }

        menuGrid.innerHTML = "";

        coffees.forEach(coffee => {

            const card = document.createElement("article");

            card.classList.add("menu-card")

            card.dataset.category = coffee.category;

            card.innerHTML = `
                <img
                    src="${coffee.image}"
                    alt="${coffee.name}"
                >

                <div class="menu-info">

                    <h3>${coffee.name}</h3>

                    <p>${coffee.description}</p>

                    <span class="price">
                        ₦${Number(coffee.price).toLocaleString()}
                    </span>

                    <a href="contact.html" class="order-btn">
                        Order Now
                    </a>

                </div>
            `;

            menuGrid.appendChild(card);

        });

        console.log(
            `${coffees.length} coffee products displayed successfully.`
        );

    } catch (error) {

        console.error("Menu loading error:", error);

        menuGrid.innerHTML = `
            <p>
                Sorry! We could not load the coffee products.
                Please check the console for details.
            </p>
        `;

    }

}

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        const selectedCategory = this.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const menuCards = document.querySelectorAll(".menu-card");

        menuCards.forEach(card => {

            if (
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});

loadCoffeeMenu();
