
// GLOBAL VARIABLES

let cards = JSON.parse(localStorage.getItem("cards")) || [];

// ⚪ Not Started,🟢 Beginner,🔵 Started,🟡 Almost Complete,🏆Set Mastery

const featuredSets = [
    {
        year: 2023,
        code: "MEW",
        name: "Scarlet & Violet-151",
        totalCards: 207,
        badge: "⚪ Not Started"

    },
    {
        year: 2021,
        code: "EVS",
        name: "Evolving Skies",
        totalCards: 237,
        badge: "⚪ Not Started"

    },
    {
        year: 1999,
        code: "BS",
        name: "Base Set",
        totalCards: 102,
        badge: "⚪ Not Started"

    },
    {
        year: 2023,
        code: "CRZ",
        name: "Crown Zenith",
        totalCards: 230,
        badge: "⚪ Not Started"

    },
    {
        year: 2000,
        code: "TR",
        name: "Team Rocket",
        totalCards: 83,
        badge: "⚪ Not Started"

    },
    {
        year: 2019,
        code: "HIF",
        name: "Hidden Fates",
        totalCards: 163,
        badge: "⚪ Not Started"

    },
    {
        year: 2000,
        code: "NEO",
        name: "Neo Genesis",
        totalCards: 111,
        badge: "⚪ Not Started"

    },
    {
        year: 2024,
        code: "PAF",
        name: "Paldean Fates",
        totalCards: 245,
        badge: "⚪ Not Started"

    },
    {
        year: 2003,
        code: "SKY",
        name: "Skyridge",
        totalCards: 182,
        badge: "⚪ Not Started"

    },
    {
        year: 1999,
        code: "JUN",
        name: "Jungle",
        totalCards: 64,
        badge: "⚪ Not Started"

    }
];


// TIME TO POPULATE SETS FROM SET NAMES 


function normalizeSetName(name) {
    return (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSetProgress(setName, totalCards) {

    const targetSetName = normalizeSetName(setName);

    const setCards = cards.filter(card => 
        normalizeSetName(card.setName) === targetSetName
    );

    const uniqueCardNumbers = new Set(
        setCards.map(card => card.cardNum)
    );

    const collected = uniqueCardNumbers.size;

    const missing = Math.max(totalCards - collected, 0);

    const percent = Math.floor(
        (collected / totalCards) * 100
    );

    return {
        collected,
        missing,
        percent
    };
}

// DISPLAY SETS

function displayFeaturedSets() {
    const container = document.getElementById("setProgressList");

    let html = "";

    featuredSets.forEach(set => {
        const progress = getSetProgress(set.title, set.totalCards);
        html += `
            <div class="setCard"> <!--  EACH SET CARD  --> 
                <div class="setHeader" onclick="toggleSetCard(this)">
                    <span>(${set.year}) | (${set.code}) | ${set.name}</span>
                    <span>${set.badge}</span>
                </div>

                <span class="setArrow">▼</span>
                <div class="setDetails">
                    <p>Progress</p>
                    <div class="progressBar">
                        <div class="progressFill" style="width: ${progress.percent};"></div>
                    </div>
                    <p>${progress.percent} | ${progress.collected}/${set.totalCards}</p>
                    <br>
                    <p>Collected: ${progress.collected}</p>
                    <p>Missing: ${progress.missing}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


// CARDS API
function showLoading() {
    document.getElementById("apiCardDisplay").innerHTML = `
        <div class="loadingSpinner"></div>
        <p>Loading Card...</p>
    `;
}


async function searchPokemonCard() {
    let searchText = document.getElementById("cardSearchInput").value.trim();
    let display = document.getElementById("apiCardDisplay");

    if(searchText === "") {
        display.innerHTML = "<p>Please enter a card name.</p>";
        return;
    }
    showLoading();
    let response = await fetch(`/.netlify/functions/searchCards?query=name:${searchText}`);
    
    let result = await response.json();

    if(result.data.length === 0) {
        display.innerHTML = "<p>No Cards Found.</p>";
        return;
    }

    let card = result.data[0];

    display.innerHTML = `
    <div class="apiCardResult">
        <h2>${card.name}</h2>
        <img src="${card.images.large}" alt="${card.name}">
    </div>
    `;
}

async function randomCard() {
    let display = document.getElementById("apiCardDisplay");
    let randomDex = Math.floor(Math.random() * 1025) + 1;

    showLoading();
    let response = await fetch(`/.netlify/functions/searchCards?query=nationalPokedexNumbers:${randomDex}`);

    let result = await response.json();

    if(result.data.length === 0) {
        display.innerHTML = "Card Not Displayed. Please Try Again.";
    }

    let card = result.data[0];

    display.innerHTML = `
    <div class="apiCardResult">
        <h2>#${randomDex} ${card.name}</h2>
        <img src="${card.images.large}" alt="${card.name}">
    </div>
    `;
}
function toggleSetCard(button) {
    const setCard = button.closest(".setCard");
    setCard.classList.toggle("open");
}


window.onload = function() {
    displayFeaturedSets();
}