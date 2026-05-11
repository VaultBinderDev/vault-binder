    //-------------------
        // START SCRIPT (tk)
        //-------------------
        // Variable to tell if HP is Ascending or descending
        let hpAscending = true;
        // Variable to tell if a card is favorited or not
        let favorite = false;
        // Plain Text stars for fav: ★ and not fav: ☆

        let editModeIndex = null;

        let isOldest = false;

        // Variable to help figure out the favorites toggle
        let showingFavorites = false;

        // Variable to help the system tell the difference between multiples of the same card:
        let cardID = "";

        // Variable for opening the custom settings popup
        let settingsOpen = false;

        // Variable to flip between image view and regular info view
        let selectedCardView = "info";

        let isOptions = false;

        let settingsText = "";
    /*
        The main array that stores all cards.
        It loads from localStorage if cards were previously saved.
    */
        let cards = JSON.parse(localStorage.getItem("cards")) || [];
        let selectedCardIndex = "";
    /*
        Pagination settings:
        currentPage tracks which page the user is on.
        cardsPerPage controls how many cards appear on one page.
    */
    let currentPage = 1;
    let cardsPerPage = 12;

    /*
        This function draws the current page of cards into the bookDisplay area.
        It only shows a limited number of cards at a time so the page stays compact.
    */
    function displayBookPage(cardList) {
        if(!cardList) {
            cardList = cards;
        }
        let bookDisplay = document.getElementById("bookDisplay");
        bookDisplay.innerHTML = "";

        let totalCount = document.getElementById("TotalPokeCards");
        totalCount.textContent = cardList.length;
        let selectedClass = "";
        

        let start = (currentPage - 1) * cardsPerPage;
        let end = start + cardsPerPage;

        for (let i = start; i < end && i < cardList.length; i++) {
            let card = cardList[i];
            let cardViewHtml = "";
            let isEditing = (editModeIndex === i);

            if(selectedCardIndex != null && selectedCardIndex === i) {
                selectedClass = " selectedCard";
            } else {
                selectedClass = "";
            }

            // PLACE IMAGE HTML HERE
            if(i === selectedCardIndex && selectedCardView === "image") {
                if(card.imageData) {
                    cardViewHtml = `<div id="imageView">
                    <h2>${card.name}</h2> <label>#${card.pokeNum}</label><br>
                    <img src="${card.imageData}" alt="${card.name}">
                    <div id="pokemonImg"></div>
                    </div>`;
                } else {
                    cardViewHtml = `<div id="imageView">
                    <h2>${card.name}</h2> <label>#${card.pokeNum}</label>
                    <p>No Image Found</p>
                    <div id="pokemonImg"></div>
                    </div>`;
            }
                
            // PLACE OPTIONS HTML HERE
            } else if(i === selectedCardIndex && selectedCardView === "options") {
                cardViewHtml = `
                <div id="optionsPopup">
                    <h2>Options Per Card: </h2><br>
                    <label>Jot Down Some Notes</label><br>
                    <button onclick="toggleNotesView(${i})">Notepad Paper</button><br><br>
                </div>`;
            // PLACE INFO HTML HERE AS DEFAULT
            } else {
                cardViewHtml = `<div id="infoView">
                    <input 
                        type="text" 
                        id="editName-${i}" 
                        value="${card.name}" 
                        class="inputBox fullWidth" 
                        placeholder="Name" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        ${isEditing ? "" : "readonly"}>
                    <input 
                        type="text" 
                        id="editHp-${i}" 
                        value="${card.hp}" 
                        class="inputBox" 
                        placeholder="HP" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        ${isEditing ? "" : "readonly"}>
                    <input 
                        type="text" 
                        id="editDex-${i}" 
                        value="${card.pokeNum}" 
                        class="inputBox" 
                        placeholder="Pokedex #" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        ${isEditing ? "" : "readonly"}>
                    <input 
                        type="text" 
                        id="editStage-${i}" 
                        value="${card.stage}" 
                        class="inputBox" 
                        placeholder="Stage" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        ${isEditing ? "" : "readonly"}>
                    <input 
                        type="text" 
                        id="editType-${i}" 
                        value="${card.type}" 
                        class="inputBox" 
                        placeholder="Type" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        d${isEditing ? "" : "readonly"}>
                    <input 
                        type="text" 
                        id="editHolo-${i}" 
                        value="${card.holoType}" 
                        class="inputBox" 
                        placeholder="Card Rarity" 
                        onclick="event.stopPropagation()"
                        onmmousedown="event.stopPropagation()"
                        ${isEditing ? "" : "readonly"}><br>
                    <div class="cardActionRow">
                        <button id="editCard" onclick="event.stopPropagation(); editCard(${i})">
                            ${isEditing ? "Save Edits" : "Edit Card"}
                        </button>
                        <button onclick="event.stopPropagation(); deleteCard(${i})">
                            Delete Card
                        </button>
                    </div>
                </div>`;
            }
            // IF STATEMENT HANDLES LOGIC BETWEEN LAYERS WHILE ORIGINAL RENDERING HOPEFULLY STAYS CONSISTENT
            bookDisplay.innerHTML +=
               `<div class="cardContainer${selectedClass}" id="card-${i}" onclick="selectCard(${i})">
                    <div id="buttonSideBar">
                        <button class="funcButton" onclick="event.stopPropagation(); toggleInfoView(${i})">I</button><br>
                        <button class="funcButton" id="favButton"onclick="event.stopPropagation(); favoriteCard()">F</button><br>
                        <button class="funcButton" onclick="event.stopPropagation(); ">W</button><br>
                        <button class="funcButton" onclick="event.stopPropagation(); ">P</button><br>
                        <button class="funcButton" id="optButton" onclick="event.stopPropagation(); toggleOptionsView(${i})">O</button>
                    </div>
                <div class="cardContent">
                ${cardViewHtml}
                </div>
                </div>`;
        }

        let maxPage = Math.max(1, Math.ceil(cardList.length / cardsPerPage));
        document.getElementById("pageNumber").textContent = "Page " + currentPage + " of " + maxPage;
    }
    function toggleInfoView(index) {
        if(selectedCardIndex === index && selectedCardView === "image") {
            selectedCardView = "info";
        } else if(selectedCardIndex === index && selectedCardView === "info") {
            selectedCardIndex = index;
            selectedCardView = "image";
        } else {
            // DEFAULT TO IMAGE FOR PROFESSIONAL FINISH
            selectedCardIndex = index;
            selectedCardView = "image";
        }
        displayBookPage();
    }

    
    
    // THE POPUP WILL BE FOR NOTES, NOT FOR ALL OPTIONS!!
    function toggleNotesView(index) {
        let notesInput = document.getElementById("notesInput");
        let charCount = document.getElementById("charCount");
        let popup = document.getElementById("notesPopup");
        

        notesInput.value = (cards[index].notes || "");
        charCount.textContent = `${notesInput.value.length} / 300`;
        popup.style.display = "block";
    }

    function saveNotes(index) {
        let popup = document.getElementById("notesPopup");
        let notes = document.getElementById("notesInput").value;
        cards[index].notes = notes;
        localStorage.setItem("cards", JSON.stringify(cards));
        popup.style.display = "none";
    }

    /* Searches the total set of pokemon cards and pushes the currently ordered list into displayBookPage() */
    function search() {
        let searchText = document.getElementById("searchBar").value.toLowerCase();
        let filteredCards = cards.filter(function(card) {
            return card.name.toLowerCase().includes(searchText);
        })
        displayBookPage(filteredCards);

    }
    function toggleFavorites() {
        showingFavorites = !showingFavorites;

        if(showingFavorites) {
            let filteredFavs = cards.filter(function(card) {
                currentPage = 1;
                return card.fav === true;
            })
            displayBookPage(filteredFavs);
        } else {
            currentPage = 1;
            displayBookPage(cards);
        }
    }
    function toggleSettings() {
        let popup = document.getElementById("settingsPopup");
        let button = document.getElementById("settingsBtn");

        settingsOpen = !settingsOpen;

        if(settingsOpen) {
            popup.style.display = "block";
            button.classList.add("active");
        } else {
            popup.style.display = "none";
            button.classList.remove("active");
        }

    }

    function toggleOptionsView(index) {
        if(selectedCardIndex === index) {
            selectedCardView = "options";
        } else {
            selectedCardView = "image";
        }
        displayBookPage();
    }

    function selectCard(index) {
        selectedCardIndex = index;
        displayBookPage();
    }

    /*
        Moves forward one page if another page exists.
    */
    function nextPage() {
        let maxPage = Math.ceil(cards.length / cardsPerPage);

        if (currentPage < maxPage) {
            currentPage++;
            displayBookPage();
        }
    }

    /*
        Moves backward one page if the user is not already on page 1.
    */
    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            displayBookPage();
        }
    }

    /*
        Adds a new card to the collection, saves it, clears the form,
        and redraws the current page view.
    */

    function fillTypeDropdown() {
        let typeSelect = document.getElementById("typeInput");

        pokemonTypes.forEach(type => {
            typeSelect.innerHTML += `
                <option value="${type.name}">
                    ${type.emoji} ${type.name}
                </option>
            `;
        })
    }

    // SAVE IMAGE
    function addCardWithImage() {
        console.log("Add Card Clicked.");
        let imageInput = document.getElementById("cardImageInput");
        let file = imageInput.files[0];

        if(!file) {
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

    function addCard(imageData = "") {
        let noteTaken = "";

        let card = {
            id: createCardId(),
            createdAt: Date.now(),

            name: document.getElementById("cardName").value,
            hp: document.getElementById("cardHp").value,
            type: document.getElementById("typeInput").value,
            stage: document.getElementById("cardStage").value,
            holoType: document.querySelector('input[name="holoType"]:checked').value,
            pokeNum: document.getElementById("pokeNum").value,
            fav: favorite,
            notes: noteTaken,
            pricing: "0.00",

            imageData: imageData,
            imageLayout: "vertical"
        };

        cards.push(card);
        localStorage.setItem("cards", JSON.stringify(cards));
        showToast(`🎉 ${card.name} added to your collection!`);

        /*
            After adding a card, jump to the last page so the new card
            is visible right away.
        */
        currentPage = Math.max(1, Math.ceil(cards.length / cardsPerPage));

        document.getElementById("cardName").value = "";
        document.getElementById("pokeNum").value = "";
        document.getElementById("cardHp").value = "";
        document.getElementById("typeInput").selectedIndex = 0;
        document.getElementById("cardStage").selectedIndex = 0;
        document.querySelector('input[name="holoType"][value="None"]').checked = true;

        cards = JSON.parse(localStorage.getItem("cards")) || [];
        cards = updateOldCards(cards);
        localStorage.setItem("cards", JSON.stringify(cards));
        displayBookPage();
    }

    
    /*
       Deletes the currently selected card and selects the next available card.
    */
    function deleteCard(index) {
        cards.splice(index, 1);
        localStorage.setItem("cards", JSON.stringify(cards));
        selectedCardIndex = null;
        displayBookPage();
    }

    /*
        Edit Function replacing the current variables if needed.
    */
    function editCard(index) {
        console.log("editCard ran. Index = ", index);

        if(editModeIndex === index) {
            // SAVE MODE
            saveEditedCard(index);
            editModeIndex = null;
        } else {
            // EDIT MODE
            editModeIndex = index;
        }
        displayBookPage();
    }

    function saveEditedCard(index) {
        cards[index].name = document.getElementById(`editName-${index}`).value;
        cards[index].hp = document.getElementById(`editHp-${index}`).value;
        cards[index].pokeNum = document.getElementById(`editDex-${index}`).value;
        cards[index].stage = document.getElementById(`editStage-${index}`).value;
        cards[index].type = document.getElementById(`editType-${index}`).value;
        cards[index].holoType = document.getElementById(`editHolo-${index}`).value;

        localStorage.setItem("cards", JSON.stringify(cards));
    }

    function favoriteCard() {
        let favorite = document.getElementById("favButton");
        let card = cards[selectedCardIndex];
        
        if(card.fav) {
            card.fav = false;
            favorite.textContent = "☆";
        } else {
            card.fav = true;
            favorite.textContent = "★"
        }

        localStorage.setItem("cards", JSON.stringify(cards));
        displayBookPage();
        selectCard(selectedCardIndex);
       
    }
    function sortDuplicates() {
        isOldest = !isOldest;

        if(isOldest) {
            cards.sort(function(a, b) {
                return b.createdAt - a.createdAt;
            });
        } else {
            cards.sort(function(a, b) {
                return a.createdAt - b.createdAt;
            })
        }
        currentPage = 1;
        displayBookPage();
    }

    function sortCardName() {
        cards.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

        currentPage = 1;
        displayBookPage();
    }
    function sortCardType() {
        
        let typeOrder = ["Colorless", "Fire", "Water", "Grass", "Electric", "Dark", "Psychic", "Fighting", "Metal", "Dragon", "Fairy"];
        

        cards.sort(function(a, b) {
            let indexA = typeOrder.indexOf(a.type);
            let indexB = typeOrder.indexOf(b.type);
            return indexA - indexB;
        });

        currentPage = 1;
        displayBookPage();
    }
    function sortCardHp() {
        if(hpAscending) {
            hpAscending = false;
            cards.sort(function(a,b) {
                
                return  Number(a.hp) - Number(b.hp);
            });
        } else {
            hpAscending = true;
            cards.sort(function(a,b) {
                return Number(b.hp) - Number(a.hp);
            });
        }
        currentPage = 1;
        displayBookPage();
    }
    function sortCardStage() {
        let stageOrder = ["Stage 2", "Stage 1", "Basic"];
        cards.sort(function(a,b) {
            let indexA = stageOrder.indexOf(a.stage);
            let indexB = stageOrder.indexOf(b.stage);
            return indexA - indexB;
        })
        currentPage = 1;
        displayBookPage();
    }

    let currentTheme = "pastelSherbet";

    function applyTheme(themeName) {
        currentTheme = themeName;

        document.body.classList.remove("theme-pastelSherbet","theme-sleekModern","theme-mutedNeon");

        document.body.classList.add("theme-" + themeName);

        if(currentTheme === "mutedNeon" || currentTheme === "sleekModern") {
            settingsText = "#f2efe9";
        } else {
            settingsText = "#444";
        }
    }

    function setDefaultTheme() {
        localStorage.setItem("defaultTheme", currentTheme);
        showToast("Default Theme Saved!");
    }

    function loadDefaultTheme() {
        let savedTheme = localStorage.getItem("defaultTheme");

        if(savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme("pastelSherbet");
        }

        window.addEventListener("DOMContentLoaded", () => {
            loadDefaultTheme();

            document.body.style.visibility = "visible";
        })
    }

    function createCardId() {
        return Date.now() + "-" + Math.random().toString(36).slice(2,8);
    }

    function updateOldCards(cardList) {
        return cardList.map(card => {
            return {
                id: card.id || createCardId(),
                createdAt: card.createdAt || Date.now(),

                name: card.name || "",
                hp: card.hp || "",
                type: card.type || "",
                stage: card.stage || "",
                holoType: card.holoType || "",
                pokeNum: card.pokeNum || "",

                fav: card.fav || false,
                wishlist: card.wishlist || false,
                notes: card.notes || "",

                imageData: card.imageData || "",
                imageSource: card.imageSource || "",
                imageLayout: card.imageLayout || "",

                ...card
            };
        });
    }

    function showToast(message) {
        console.log("Toast is shown")
        let toast = document.getElementById("toast");

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    /*
        Draw the saved cards immediately when the page first loads.
    */

    let notesInput = document.getElementById("notesInput");
    let charCount = document.getElementById("charCount");

    if(notesInput && charCount) {
        notesInput.addEventListener("input", () => {
            charCount.textContent = `${notesInput.value.length} / 300`;
        });
    }

    fillTypeDropdown();
    loadDefaultTheme();


    cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards = updateOldCards(cards);
    localStorage.setItem("cards", JSON.stringify(cards));
    displayBookPage();