const cards = JSON.parse(localStorage.getItem("cards")) || [];

function displaySort() {
    let cardDisplay = document.getElementById("thumbnailCards");

    let cardsHTML = "";
    for (let i = 0; i < cards.length; i++) {
        cardsHTML += `
            <div class="thumbnailCard">
                <div class="sortThumbnail"></div>
                <p>--------------</p>
                <div class="sortButtons">
                    <button>Info</button>
                </div>
            </div>
        `;
    }

    cardDisplay.innerHTML = `
        <div class="rowOfCards">${cardsHTML}</div>
    `;
}



function thumbnailCreation(dataUrl, callback) {
    const img = new Image();

    img.onload = function () {
        const canvas = document.createElement("canvas");

        const maxHeight = 120;
        const scale = maxHeight / img.height;

        canvas.width = img.width * scale;
        canvas.height = maxHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.75);
        callback(compressedImage);
    };

    img.src = dataUrl;
}

function loadThumbnails() {
    const thumbnailEls = document.querySelectorAll(".sortThumbnail");

    cards.forEach((card, index) => {
        const targetEl = thumbnailEls[index];
        if (!card || !targetEl) return; // safe here, just skips this one

        if (!card.imageData) {
            targetEl.innerHTML = `<div>No Image</div>`;
            return;
        }

        thumbnailCreation(card.imageData, function (compressedImage) {
            targetEl.innerHTML = `<img src="${compressedImage}" alt="Compressed Thumbnail">`;
        });
    });
}

window.onload = function() {
    loadThumbnails();
    displaySort();
}