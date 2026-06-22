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
