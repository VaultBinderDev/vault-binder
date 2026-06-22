// THEMES 

function setTheme(themeName) {
    document.body.classList.remove(
        "theme-classic",
        "theme-metallic",
        "theme-leather",
        "theme-carbon"
    );

    document.body.classList.add(themeName);
    localStorage.setItem("theme", themeName);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "theme-classic";

    document.body.classList.add(savedTheme);

    const radio = document.querySelector(`input[value="${savedTheme}"]`);

    if(radio) {
        radio.checked = true;
    }
}


// UPDATE BANNER FOR THE SITE 

function createUpdateBanner() {
    const banner = document.createElement("div");

    banner.id = "updateBanner";
    banner.className = "updateBanner";

    banner.innerHTML = `
        <button class="bannerCloseBtn"
                onclick="closeUpdateBanner()">×</button>
        <strong>Vault Binder Beta</strong>
        <p>
            Welcome to the public beta! Please export your collection 
            regularly while new features are beind added.
        </p>
    `;

    document.body.prepend(banner);
}

function closeUpdateBanner() {
    localStorage.setItem("bannerClosed", "true");

    const banner = document.getElementById("updateBanner");

    if(banner) {
        banner.remove();
    }
}

function initializeBanner() {
    const closed = localStorage.getItem("bannerClosed");

    if(closed === "true") return;

    createUpdateBanner();
}