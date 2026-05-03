            // RANDOMLY GENERATED USERNAMES
            
            const adjectives = ["Swift", "Lucky", "Calm", "Bright", "Shadow", "Golden"];
            const collectorWords = ["Binder", "Holo", "Dex", "Pocket", "Booster", "Trainer"];

            function generateUsername() {
                let adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                let word = collectorWords[Math.floor(Math.random() * collectorWords.length)];
                let num = Math.floor(Math.random() * 1000);
                return adj + word + num;
            }

            function createLocalProfile() {
                let user = {
                    id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
                    username: generateUsername(),
                    createdAt: Date.now(),
                    createdAtReadable: new Date().toLocaleString()
                };

                localStorage.setItem("vaultUser", JSON.stringify(user));

                loadLocalProfile();
            }

            function loadLocalProfile() {
                let savedUser = localStorage.getItem("vaultUser");
                if(savedUser) {
                    let user = JSON.parse(savedUser);

                    document.getElementById("loginBox").style.display = "none";
                    document.getElementById("profileBox").style.display = "block";
                    document.getElementById("usernameDisplay").textContent = user.username;
                }
            }

            // CARDS API
            
            async function searchPokemonCard() {
                let searchText = document.getElementById("cardSearchInput").value.trim();
                let display = document.getElementById("apiCardDisplay");

                if(searchText === "") {
                    display.innerHTML = "<p>Please enter a card name.</p>";
                    return;
                }

                let response = await fetch(`/.netlify/functions/searchCards?query=${searchText}`);
                
                let result = await response.json();

                if(result.data.length === 0) {
                    display.innerHTML = "<p>No Cards Found.</p>";
                    return;
                }

                let card = result.data[0];

                display.innerHTML = `
                <div class="apiCardResult">
                    <h3>${card.name}</h3>
                    <img src="${card.images.large}" alt="${card.name}">
                </div>
                `;
            }

            async function randomCard() {
                let display = document.getElementById("apiCardDisplay");
                let randomDex = Math.floor(Math.random() * 1025) + 1;

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



            document.body.style.visibility = "visible";
            loadLocalProfile();