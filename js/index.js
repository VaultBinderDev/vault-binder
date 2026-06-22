
// GLOBAL VARIABLES

const cards = JSON.parse(localStorage.getItem("cards")) || [];

const binders = JSON.parse(localStorage.getItem("binders")) || [];


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

function getCollectionStats() {
    const totalCards = cards.length;

    const favoriteCards = cards.filter(card => card.fav).length;

    const setsStarted = new Set(
        cards
            .map(card => card.setName?.trim().toLowerCase())
            .filter(Boolean)
    ).size;

    const bestSet = getBestCompletedSet();

    return {
        totalCards,
        favoriteCards,
        setsStarted,
        bestSet
    };
}

function getBestCompletedSet() {
    let bestSet = {
        name: "None Yet",
        percent: 0
    };

    featuredSets.forEach(set => {
        const progress = getSetProgress(
            set.title,
            set.totalCards
        );

        if(progress.percent > bestSet.percent) {
            bestSet = {
                name: set.title,
                percent: progress.percent
            };
        }
    });

    return bestSet;
}

// DISPLAY STATS

function displayStats() {
    const stats = getCollectionStats();

    document.getElementById("totalCardsStat").textContent = stats.totalCards;
    document.getElementById("setsStartedStat").textContent = stats.setsStarted;
    document.getElementById("favoriteCardsStat").textContent = stats.favoriteCards;
    document.getElementById("bestSetPercent").textContent = `${stats.bestSet.percent}%`;
    document.getElementById("bestSetName").textContent = stats.bestSet.name;
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

function toggleSetCard(button) {
    const setCard = button.closest(".setCard");
    setCard.classList.toggle("open");
}


window.onload = function() {
    // UPDATE BANNER ON STARTUP
    initializeBanner();
    // PAGE THEMES
    loadSavedTheme();
    displayStats();
    displayFeaturedSets();
}