const cards = JSON.parse(localStorage.getItem("cards")) || [];

// FUTURE THUMBNAIL TECH 

function thumbnailCreation(file, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
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

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

function loadThumbnails() {
    let images = cards.map(card => card.imageData);

    for(card of cards) {
        if(!card) return;
        for(image of images) {

        thumbnailCreation(image, function (compressedImage) {
            document.getElementById("sortThumbnail").innerHTML = 
            card.imageData
            ? `<img src="${card.imageData}" alt="Compressed Thumbnail">` 
            : `<div>No Image</div>`;
        });
        }
    }

}

window.onload() = function() {
    loadThumbnails();
}