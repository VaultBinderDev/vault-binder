//-------------------
// START SCRIPT (tk)
//-------------------


//-------------------
// GLOBAL VARIABLES
//-------------------

let favorite = false;
let isOldest = false;
let showingFavorites = false;
let settingsOpen = false;

let selectedCardView = "info";
let selectedCardIndex = "";

let currentPage = 1;

// JUST CHANGE THESE VARIABLES TO CHANGE THE ENTIRE LAYOUT
const COLUMNS = 4;
const ROWS = 4;

binderPage.style.setProperty("--columns", COLUMNS);
binderPage.style.setProperty("--rows", ROWS);

const SLOTS_PER_PAGE = COLUMNS * ROWS;
let slotsPerPage = SLOTS_PER_PAGE;

let binders = JSON.parse(localStorage.getItem("binders")) || [
    {
        name: "Main Binder",
        color: "#111111",
        totalPages: 1
    },
    {
        name:   "Trades",
        color: "#1f3f2f",
        totalPages: 1
    },
    {
        name: "Favorites",
        color: "#2f243f",
        totalPages: 1
    }
];

let activeBinderIndex = Number(localStorage.getItem("activeBinderIndex")) || 0;

let currentTheme = "pastelSherbet";
let settingsText = "";

let editModeIndex = -1;

let cards = JSON.parse(localStorage.getItem("cards")) || [];


//-------------------
// DISPLAY FUNCTIONS
//-------------------

function displayBookPage(cardList) {
    if (!cardList) {
        cardList = cards;
    }

    const sidebar = document.getElementById("binderSidebar");
    const openSidebarBtn = document.getElementById("openSidebarBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");

    openSidebarBtn.onclick = () => {
        sidebar.classList.add("open");
        openSidebarBtn.style.display = "none";
    }

    closeSidebarBtn.onclick = () => {
        sidebar.classList.remove("open");
        openSidebarBtn.style.display = "block";
    }

    let binderPage = document.getElementById("binderPage");

    if (!binderPage) return;

    binderPage.innerHTML = "";

    let totalCount = document.getElementById("binderCount");

    if (totalCount) {
        totalCount.textContent = cardList.length;
    }

    let start = (currentPage - 1) * slotsPerPage;
    let end = start + slotsPerPage;

    for(let slot = 0; slot < slotsPerPage; slot++) {
        let cardIndex = start + slot;
        let card = cardList[cardIndex];

        if(card) {
            let selectedClass = selectedCardIndex === cardIndex ? " selectedCard" : "";
            // Render Real card
            if (cardIndex === selectedCardIndex && selectedCardView === "info") {
                cardViewHtml = `
                <div class="compactInfoView">
                <h3>${card.name || "Card Name"}</h3>

                <div class="infoMiniRow">
                    <span class="miniLabel">Set</span>
                    <span class="miniValue">${card.setName || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">No.</span>
                    <span class="miniValue">${card.cardNum || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Rarity</span>
                    <span class="miniValue">${card.cardRarity || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Variant</span>
                    <span class="miniValue">${card.cardVariant || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Condition</span>
                    <span class="miniValue">${card.cardCondition || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Status</span>
                    <span class="miniValue">${card.cardStatus || "--~--"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Qty</span>
                    <span class="miniValue">${card.quantity || "1"}</span>
                </div>

                <div class="infoMiniRow">
                    <span class="miniLabel">Value</span>
                    <span class="miniValue">${card.estimatedValue || "--~--"}</span>
                </div>
                </div>
                `;
            } else if (cardIndex === selectedCardIndex && selectedCardView === "options") {
            cardViewHtml = `
                <div class="optionsView">
                <button onclick="event.stopPropagation(); toggleNotesView(${cardIndex})">
                    Notes
                </button>
                <button onclick="event.stopPropagation(); editCard(${cardIndex})">
                    Edit
                </button>
                <button onclick="event.stopPropagation(); deleteCard(${cardIndex})">
                    Delete
                </button>
                </div>
            `;
            } else {
            cardViewHtml = `
            ${
            card.imageData
            ? `<img class="binderCardImage" src="${card.imageData}" alt="${card.name}">`
            : `<div class="emptyCardSlot">
                    <div class="emptyCardIcon">=</div>
                    <h3>No Image Here</h3>
                    <p>Add an image to this card</p>
               </div>`
            }
            `;
            }






            binderPage.innerHTML += `
            <div class="binderCard${selectedClass}" id="card-${cardIndex}" onclick="selectCard(${cardIndex})">
            <div class="cardTopTabs">
            <button onclick="event.stopPropagation(); selectedCardIndex=${cardIndex}; selectedCardView='image'; displayBookPage();">Image</button>
            <button onclick="event.stopPropagation(); selectedCardIndex=${cardIndex}; selectedCardView='info'; displayBookPage();">Info</button>
            <button onclick="event.stopPropagation(); selectedCardIndex=${cardIndex}; selectedCardView='options'; displayBookPage();">Options</button>
            </div>

            <div class="mainCardArea">
            ${cardViewHtml}
            </div>

            <div class="cardBottomActions">
            <button onclick="event.stopPropagation(); favoriteCard()">★</button>
            <button onclick="event.stopPropagation();">$</button>
            <button onclick="event.stopPropagation();">♥</button>
            </div>
            </div>
            `;
        } else {
            // Render Empty slot
            binderPage.innerHTML += `
                <div class="binderCard emptySlot testSlot">
                    <div class="mainCardArea">
                        <div class="emptySlotContent">
                            <h3>Empty Slot</h3>
                            <p>Awaiting Card</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    updatePageIndicator()
}

//-------------------
// IMAGE FUNCTIONS
//-------------------

function previewImage() {

    let imageInput =
        document.getElementById("cardImageInput");

    let previewBox =
        document.getElementById("imagePreviewBox");

    let file = imageInput.files[0];

    if (!file) {

        previewBox.innerHTML =
            "<p>No image selected.</p>";

        return;
    }

    let reader = new FileReader();

    reader.onload = function () {

        previewBox.innerHTML = `
            <img
                src="${reader.result}"
                alt="Card image preview"
            >
        `;
    };

    reader.readAsDataURL(file);
}

function addCardWithImage() {

    let imageInput =
        document.getElementById("cardImageInput");

    let file = imageInput.files[0];

    if (!file) {
        addCard("");
        return;
    }

    let reader = new FileReader();

    reader.onload = function () {

        addCard(reader.result);

        imageInput.value = "";
    };

    reader.readAsDataURL(file);
}


//-------------------
// CARD FUNCTIONS
//-------------------

function addCard(imageData = "") {

    let card = {

        id: createCardId(),
        createdAt: Date.now(),

        name:
            document.getElementById("cardName").value,

        setName:
            document.getElementById("setname").value,

        cardNum:
            document.getElementById("cardnumber").value,

        quantity:
            document.getElementById("quantity").value,

        cardRarity:
            document.getElementById("rarity").value,

        cardVariant:
            document.getElementById("variant").value,

        cardCondition:
            document.getElementById("condition").value,

        cardStatus:
            document.getElementById("status").value,

        estimatedValue: "",

        fav: favorite,
        notes: "",

        imageData: imageData,
        imageLayout: "vertical"
    };

    cards.push(card);

    cards = updateOldCards(cards);

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );

    currentPage =
        Math.ceil(cards.length / slotsPerPage);

    selectedCardIndex = cards.length - 1;

    displayBookPage();

    clearAddCardForm();

    showToast(`🎉 ${card.name} added!`);
}

function clearAddCardForm() {

    document.getElementById("cardName").value = "";
    document.getElementById("setname").value = "";
    document.getElementById("cardnumber").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("rarity").value = "";
    document.getElementById("variant").value = "";
    document.getElementById("condition").value = "";
    document.getElementById("status").value = "";

    document.getElementById("cardImageInput").value = "";

    document.getElementById("imagePreviewBox").innerHTML = `<p>Image Preview</p>`;
}

function deleteCard(index) {

    cards.splice(index, 1);

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );

    selectedCardIndex = null;

    displayBookPage();
}

function editCard(index) {

    if (editModeIndex === index) {

        saveEditedCard(index);

        editModeIndex = -1;

    } else {

        editModeIndex = index;
    }

    displayBookPage();
}

function saveEditedCard(index) {

    cards[index].name =
        document.getElementById(`editName-${index}`).value;

    cards[index].setName =
        document.getElementById(`editSet-${index}`).value;

    cards[index].cardNum =
        document.getElementById(`editNumber-${index}`).value;

    cards[index].cardRarity =
        document.getElementById(`editRarity-${index}`).value;

    cards[index].cardCondition =
        document.getElementById(`editCondition-${index}`).value;

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );
}

function favoriteCard() {

    let card = cards[selectedCardIndex];

    if (!card) return;

    card.fav = !card.fav;

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );

    displayBookPage();
}



//-------------------
// TABS FUNCTIONS
//-------------------

function displayTabs() {
    let tabs = document.querySelectorAll(".binderTab");

    tabs.forEach((tab, index) => {
        tab.classList.toggle("active", index === activeBinderIndex);
    });
}

function changeTab(index) {

    activeBinderIndex = index;

    currentPage = 1;

    displayTabs();
    displayBookPage();

}

function saveBinderState() {
    localStorage.setItem("binders", JSON.stringify(binders));
    localStorage.setItem("activeBinderIndex", activeBinderIndex);
}


//-------------------
// NOTES FUNCTIONS
//-------------------

function toggleNotesView(index) {

    let notesInput =
        document.getElementById("notesInput");

    let charCount =
        document.getElementById("charCount");

    let popup =
        document.getElementById("notesPopup");

    notesInput.value =
        cards[index].notes || "";

    charCount.textContent =
        `${notesInput.value.length} / 300`;

    popup.style.display = "block";
}

function saveNotes(index) {

    let popup =
        document.getElementById("notesPopup");

    let notes =
        document.getElementById("notesInput").value;

    cards[index].notes = notes;

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );

    popup.style.display = "none";
}


//-------------------
// SEARCH / SORT
//-------------------

function search() {

    let searchText =
        document.getElementById("searchBar")
        .value
        .toLowerCase();

    let filteredCards =
        cards.filter(card =>
            card.name.toLowerCase()
            .includes(searchText)
        );

    displayBookPage(filteredCards);
}

function toggleFavorites() {

    showingFavorites = !showingFavorites;

    if (showingFavorites) {

        let filteredFavs =
            cards.filter(card => card.fav);

        displayBookPage(filteredFavs);

    } else {

        displayBookPage(cards);
    }
}

function sortDuplicates() {

    isOldest = !isOldest;

    cards.sort((a, b) => {

        return isOldest
            ? b.createdAt - a.createdAt
            : a.createdAt - b.createdAt;
    });

    displayBookPage();
}

function sortCardName() {

    cards.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    displayBookPage();
}


//-------------------
// SETTINGS / THEMES
//-------------------

function toggleSettings() {

    let popup =
        document.getElementById("settingsPopup");

    let button =
        document.getElementById("settingsBtn");

    settingsOpen = !settingsOpen;

    if (settingsOpen) {

        popup.style.display = "block";

        button.classList.add("active");

    } else {

        popup.style.display = "none";

        button.classList.remove("active");
    }
}

function applyTheme(themeName) {

    currentTheme = themeName;

    document.body.classList.remove(
        "theme-pastelSherbet",
        "theme-sleekModern",
        "theme-mutedNeon"
    );

    document.body.classList.add(
        "theme-" + themeName
    );
}

function setDefaultTheme() {

    localStorage.setItem(
        "defaultTheme",
        currentTheme
    );

    showToast("Default Theme Saved!");
}

function loadDefaultTheme() {

    let savedTheme =
        localStorage.getItem("defaultTheme");

    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        applyTheme("pastelSherbet");
    }
}


//-------------------
// PAGE CONTROL
//-------------------

function selectCard(index) {

    selectedCardIndex = index;

    displayBookPage();
}

function toggleInfoView(index) {

    selectedCardIndex = index;

    selectedCardView =
        selectedCardView === "image"
        ? "info"
        : "image";

    displayBookPage();
}

function toggleOptionsView(index) {

    selectedCardIndex = index;

    selectedCardView = "options";

    displayBookPage();
}

function updatePageIndicator() {
    const activeBinder = binders[activeBinderIndex];
    let pageIndicator = document.getElementById("pageIndicator");

    if(!pageIndicator) return;

    pageIndicator.textContent = `Page ${currentPage} / ${activeBinder.totalPages}`;

}

function nextPage() {
    const activeBinder = binders[activeBinderIndex]; 
    if (currentPage < activeBinder.totalPages) {
        currentPage++;
        displayBookPage();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayBookPage();
    }
}

function addPage() {
    const activeBinder = binders[activeBinderIndex];

    activeBinder.totalPages++;

    localStorage.setItem("binders", JSON.stringify(binders));

    displayBookPage();
}

//-------------------
// UTILITY FUNCTIONS
//-------------------

function createCardId() {

    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}

function updateOldCards(cardList) {

    return cardList.map(card => {

        return {

            id:
                card.id || createCardId(),

            createdAt:
                card.createdAt || Date.now(),

            name:
                card.name || "",

            setName:
                card.setName || "",

            cardNum:
                card.cardNum || "",

            quantity:
                card.quantity || 1,

            cardRarity:
                card.cardRarity || "",

            cardVariant:
                card.cardVariant || "",

            cardCondition:
                card.cardCondition || "",

            cardStatus:
                card.cardStatus || "Owned",

            estimatedValue:
                card.estimatedValue || "",

            fav:
                card.fav || false,

            wishlist:
                card.wishlist || false,

            notes:
                card.notes || "",

            imageData:
                card.imageData || "",

            imageLayout:
                card.imageLayout || "vertical",

            ...card
        };
    });
}

function showToast(message) {

    let toast =
        document.getElementById("toast");

    if (!toast) {
        console.log("Toast element missing");
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


//-------------------
// STARTUP
//-------------------

loadDefaultTheme();

cards = JSON.parse(
    localStorage.getItem("cards")
) || [];

cards = updateOldCards(cards);

localStorage.setItem(
    "cards",
    JSON.stringify(cards)
);

displayBookPage();