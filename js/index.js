

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
            
            document.body.style.visibility = "visible";
            loadLocalProfile();