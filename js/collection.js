//-------------------
// START SCRIPT (tk)
//-------------------


//-------------------
// GLOBAL VARIABLES
//-------------------

let vaultUser = 
    JSON.parse(localStorage.getItem("vaultUser")) || {
        id: createCardId,
        username: "Guest Vault",
        createdAt: Date.now(),
        createdAtReadable: new Date().toLocaleString()
    }

let favorite = false;
let isOldest = false;
let showingFavorites = false;
let settingsOpen = false;

let draggedCardId = null;


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
        id: "main",
        name: "Main Binder",
        color: "#111111",
        totalPages: 1
    }
];

let activeBinderIndex = Number(localStorage.getItem("activeBinderIndex")) || 0;

const binderColors = [
    "#111111",
    "#1f3f2f",
    "#22364a",
    "#3a243f",
    "#3f2d1f",
    "#1f3f3c",
    "#3f1f2b",
    "#2d2d3f",
]

let currentTheme = "pastelSherbet";
let settingsText = "";

let editModeIndex = -1;

let cards = JSON.parse(localStorage.getItem("cards")) || [];


//-------------------
// DISPLAY FUNCTIONS
//-------------------

function displayBookPage(cardList) {
    if (!cardList) {
        let activeBinder = binders[activeBinderIndex];

        cardList = cards.filter(card => 
            card.binderId === activeBinder.id
        );
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

    let activeBinder = binders[activeBinderIndex];
    document.documentElement.style.setProperty("--active-tab-color", activeBinder.color);

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
        let visualSlot = slot;

        let card = cardList.find(card => 
            card.page === currentPage && 
            card.slot === visualSlot
        );
        
        let cardIndex = cards.findIndex(savedCard => 
            savedCard.id === card?.id
        );

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
            <div 
            class="binderCard${selectedClass}" 
            id="card-${cardIndex}"
            draggable="true" 
            ondragstart="startDrag('${card.id}')"
            ondragover="event.preventDefault()"
            ondrop="dropOnSlot(${slot})"
            onclick="selectCard(${cardIndex})">
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
                <div 
                class="binderCard emptySlot testSlot"
                ondragover="event.preventDefault()"
                ondrop="dropOnSlot(${slot})"
                >
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

    updatePageControls();
}

//-------------------
// IMAGE FUNCTIONS
//-------------------

function compressImage(file, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();

        img.onload = function () {
            const canvas = document.createElement("canvas");

            const maxHeight = 700;
            const scale = maxHeight / img.height;

            canvas.width = img.width * scale;
            canvas.height = maxHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedImage = canvas.toDataURL("image/jpeg", 0.75);

            callback(compressedImage);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

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
    let imageInput = document.getElementById("cardImageInput");
    let file = imageInput.files[0];

    if (!file) {
        addCard("");
        return;
    }

    compressImage(file, function (compressedImage) {
        addCard(compressedImage);
        imageInput.value = "";
    }) 
}


//-------------------
// CARD FUNCTIONS
//-------------------

function addCard(imageData = "") {

    let card = {

        id: createCardId(),
        createdAt: Date.now(),
        binderId: binders[activeBinderIndex].id,

        page: currentPage,
        slot: getNextOpenSlot(),

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
        imageLayout: "vertical",

        
    };

    cards.push(card);

    cards = updateOldCards(cards);

    saveCards();

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

    saveCards();

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

    saveCards();
}

function favoriteCard() {

    let card = cards[selectedCardIndex];

    if (!card) return;

    card.fav = !card.fav;

    saveCards();

    displayBookPage();
}



//-------------------
// TABS FUNCTIONS (tk)
//-------------------

function displayTabs() {
    const binderTabs = document.getElementById("binderTabs");
    let activeBinder = binders[activeBinderIndex];

    binderTabs.innerHTML = "";

    binders.forEach((binder, index) => {
        binderTabs.innerHTML += `
            <button
                class="binderTab ${index === activeBinderIndex ? "active" : ""}"
                onclick="changeTab(${index})">
                ${binder.name}
            </button>
        `;
    });

    binderTabs.innerHTML += `
        <button class="binderTab addTab" onclick="addBinderTab()">+</button>
    `;


    showToast(`Opened: ${activeBinder.name}`);
}

function changeTab(index) {

    activeBinderIndex = index;
    currentPage = 1;

    localStorage.setItem("activeBinderIndex", activeBinderIndex);

    displayTabs();
    displayBookPage();

}

function addBinderTab() {
    binders.push({
        id: crypto.randomUUID(),
        name: `Binder ${binders.length + 1}`,
        color: getRandomBinderColor(),
        totalPages: 1
    });

    activeBinderIndex = binders.length - 1;
    currentPage = 1;

    saveBinderState();
    displayTabs();
    displayBookPage();
}

function getRandomBinderColor() {
    let randIndex = Math.floor(Math.random() * binderColors.length);

    return binderColors[randIndex];
}

function saveBinderState() {
    saveBinders();
    saveActiveBinder();
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

function updatePageControls() {
    const activeBinder = binders[activeBinderIndex];

    const pageIndicator = document.getElementById("pageIndicator");
    const pageSlider = document.getElementById("pageSlider");

    if(pageIndicator) {
        pageIndicator.textContent = `Page ${currentPage} / ${activeBinder.totalPages}`;
    }

    if(pageSlider) {
        pageSlider.min = 1;
        pageSlider.max = activeBinder.totalPages;
        pageSlider.value = currentPage;
    }
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

    saveBinders();

    displayBookPage();
}


//-------------------
// DRAG & DROP CARDS
//-------------------

function startDrag(cardId) {
    draggedCardId = cardId;
}

function dropOnSlot(slot) {
    const activeBinder = binders[activeBinderIndex];

    const draggedCard = cards.find(card =>
        card.id === draggedCardId
    );

    if(!draggedCard) return;

    const targetCard = getCardInSlot(
        activeBinder.id,
        currentPage,
        slot
    );

    if(draggedCard.slot === slot) return;

    if(!targetCard) {
        moveCardToSlot(draggedCardId, slot);
    } else {
        swapCardSlots(draggedCardId, targetCard.id);
    }

    draggedCardId = null;
}

function getNextOpenSlot() {
    const activeBinder = binders[activeBinderIndex];

    const binderCards = cards.filter(card => 
        card.binderId === activeBinder.id &&
        card.page === currentPage
    );

    for(let slot = 0; slot < slotsPerPage; slot++) {
        let slotTaken = binderCards.some(card => card.slot === slot);

        if(!slotTaken) {
            return slot;
        }
    }
}

function getCardInSlot(binderId, page, slot) {
    return cards.find(card => 
        card.binderId === binderId &&
        card.page === page && 
        card.slot === slot
    )
}

function moveCardToSlot(cardId, slot) {
    let card = cards.find(card => card.id === cardId);

    console.log(card);

    if(!card) return;

    card.slot = slot;

    saveCards();
    displayBookPage();
}

function swapCardSlots(cardAId, cardBId) {
    let cardA = cards.find(card => card.id === cardAId);
    let cardB = cards.find(card => card.id === cardBId);

    if(!cardA || !cardB) return;

    let oldSlotA = cardA.slot;
    let oldSlotB = cardB.slot;

    cardA.slot = oldSlotB;
    cardB.slot = oldSlotA;

    saveCards();
    displayBookPage();
}

//------------------
// IMPORT / EXPORT  
//------------------

function exportVaultData() {
    const vaultData = {
        vaultUser,
        cards,
        binders,
        totalPages,
        activeBinderIndex
    };

    const jsonString = JSON.stringify(vaultData, null, 2);

    document.getElementById("vaultDataBox").value = jsonString;

    showToast(
        `${vaultUser.username} | ${cards.length} cards exported.`
    );
}


 
//-------------------
// UTILITY FUNCTIONS
//-------------------



// SAVE FUNCTIONS tk

function saveCards() {
    localStorage.setItem("cards", JSON.stringify(cards));
}

function saveBinders() {
    localStorage.setItem("binders", JSON.stringify(binders));
}

function saveActiveBinder() {
    localStorage.setItem("activeBinderIndex", activeBinderIndex);
}

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

            ...card,

            binderId: card.binderId || "main",

            page: card.page || 1,
            
            slot: card.slot ?? getNextOpenSlot(),

            id: card.id || createCardId(),

            createdAt: card.createdAt || Date.now(),

            name: card.name || "",

            setName: card.setName || "",

            cardNum: card.cardNum || "",

            quantity: card.quantity || 1,

            cardRarity: card.cardRarity || "",

            cardVariant: card.cardVariant || "",

            cardCondition: card.cardCondition || "",

            cardStatus: card.cardStatus || "Owned",

            estimatedValue: card.estimatedValue || "",

            fav: card.fav ?? false,

            wishlist: card.wishlist ?? false,

            notes: card.notes || "",

            imageData: card.imageData || "",

            imageLayout: card.imageLayout || "vertical",

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

    }, 1000);
}


//-------------------
// STARTUP
//-------------------

document.getElementById("pageSlider").oninput = function () {
    currentPage = Number(this.value);
    displayBookPage();
}

displayTabs();

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