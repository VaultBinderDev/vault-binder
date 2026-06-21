/*                                                                                                         
                                                                                         
                                           bbbbbbbb                                      
                   lllllll                 b::::::b                              lllllll 
                   l:::::l                 b::::::b                              l:::::l 
                   l:::::l                 b::::::b                              l:::::l 
                   l:::::l                  b:::::b                              l:::::l 
   ggggggggg   gggggl::::l    ooooooooooo   b:::::bbbbbbbbb      aaaaaaaaaaaaa    l::::l 
  g:::::::::ggg::::gl::::l  oo:::::::::::oo b::::::::::::::bb    a::::::::::::a   l::::l 
 g:::::::::::::::::gl::::l o:::::::::::::::ob::::::::::::::::b   aaaaaaaaa:::::a  l::::l 
g::::::ggggg::::::ggl::::l o:::::ooooo:::::ob:::::bbbbb:::::::b           a::::a  l::::l 
g:::::g     g:::::g l::::l o::::o     o::::ob:::::b    b::::::b    aaaaaaa:::::a  l::::l 
g:::::g     g:::::g l::::l o::::o     o::::ob:::::b     b:::::b  aa::::::::::::a  l::::l 
g:::::g     g:::::g l::::l o::::o     o::::ob:::::b     b:::::b a::::aaaa::::::a  l::::l 
g::::::g    g:::::g l::::l o::::o     o::::ob:::::b     b:::::ba::::a    a:::::a  l::::l 
g:::::::ggggg:::::gl::::::lo:::::ooooo:::::ob:::::bbbbbb::::::ba::::a    a:::::a l::::::l
 g::::::::::::::::gl::::::lo:::::::::::::::ob::::::::::::::::b a:::::aaaa::::::a l::::::l
  gg::::::::::::::gl::::::l oo:::::::::::oo b:::::::::::::::b   a::::::::::aa:::al::::::l
    gggggggg::::::gllllllll   ooooooooooo   bbbbbbbbbbbbbbbb     aaaaaaaaaa  aaaallllllll
            g:::::g                                                                      
gggggg      g:::::g                                                                      
g:::::gg   gg:::::g                                                                      
 g::::::ggg:::::::g                                                                      
  gg:::::::::::::g                                                                       
    ggg::::::ggg                                                                         
       gggggg                                                                                                                             
                                                                                         
*/

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

let settingsText = "";

let editModeIndex = -1;

let cards = JSON.parse(localStorage.getItem("cards")) || [];


/*                                                                                                                                       
                                                                                                                                              
                                                                                                                 
            dddddddd                                                                                             
            d::::::d  iiii                                       lllllll                                         
            d::::::d i::::i                                      l:::::l                                         
            d::::::d  iiii                                       l:::::l                                         
            d:::::d                                              l:::::l                                         
    ddddddddd:::::d iiiiiii     ssssssssss   ppppp   ppppppppp    l::::l   aaaaaaaaaaaaayyyyyyy           yyyyyyy
  dd::::::::::::::d i:::::i   ss::::::::::s  p::::ppp:::::::::p   l::::l   a::::::::::::ay:::::y         y:::::y 
 d::::::::::::::::d  i::::i ss:::::::::::::s p:::::::::::::::::p  l::::l   aaaaaaaaa:::::ay:::::y       y:::::y  
d:::::::ddddd:::::d  i::::i s::::::ssss:::::spp::::::ppppp::::::p l::::l            a::::a y:::::y     y:::::y   
d::::::d    d:::::d  i::::i  s:::::s  ssssss  p:::::p     p:::::p l::::l     aaaaaaa:::::a  y:::::y   y:::::y    
d:::::d     d:::::d  i::::i    s::::::s       p:::::p     p:::::p l::::l   aa::::::::::::a   y:::::y y:::::y     
d:::::d     d:::::d  i::::i       s::::::s    p:::::p     p:::::p l::::l  a::::aaaa::::::a    y:::::y:::::y      
d:::::d     d:::::d  i::::i ssssss   s:::::s  p:::::p    p::::::p l::::l a::::a    a:::::a     y:::::::::y       
d::::::ddddd::::::ddi::::::is:::::ssss::::::s p:::::ppppp:::::::pl::::::la::::a    a:::::a      y:::::::y        
 d:::::::::::::::::di::::::is::::::::::::::s  p::::::::::::::::p l::::::la:::::aaaa::::::a       y:::::y         
  d:::::::::ddd::::di::::::i s:::::::::::ss   p::::::::::::::pp  l::::::l a::::::::::aa:::a     y:::::y          
   ddddddddd   dddddiiiiiiii  sssssssssss     p::::::pppppppp    llllllll  aaaaaaaaaa  aaaa    y:::::y           
                                              p:::::p                                         y:::::y            
                                              p:::::p                                        y:::::y             
                                             p:::::::p                                      y:::::y              
                                             p:::::::p                                     y:::::y               
                                             p:::::::p                                    yyyyyyy                
                                             ppppppppp                                                           
                                                                                                                 
                                                                                                                                              
                                                                                                                                                                      
*/

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

    // CODE FOR TOTAL CARDS STATS
    let totalCount = document.getElementById("binderCount");

    if (totalCount) {
        totalCount.textContent = cardList.length;
    }
    //------------------------------

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
                <button onclick="event.stopPropagation(); openEditDrawer('${card.id}')">
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
            <button onclick="event.stopPropagation(); favoriteCard('${card.id}')">★</button>
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

/*
                                                                                                          
                                                                                                          
  iiii                                                                                                    
 i::::i                                                                                                   
  iiii                                                                                                    
                                                                                                          
iiiiiii    mmmmmmm    mmmmmmm     aaaaaaaaaaaaa     ggggggggg   ggggg    eeeeeeeeeeee        ssssssssss   
i:::::i  mm:::::::m  m:::::::mm   a::::::::::::a   g:::::::::ggg::::g  ee::::::::::::ee    ss::::::::::s  
 i::::i m::::::::::mm::::::::::m  aaaaaaaaa:::::a g:::::::::::::::::g e::::::eeeee:::::eess:::::::::::::s 
 i::::i m::::::::::::::::::::::m           a::::ag::::::ggggg::::::gge::::::e     e:::::es::::::ssss:::::s
 i::::i m:::::mmm::::::mmm:::::m    aaaaaaa:::::ag:::::g     g:::::g e:::::::eeeee::::::e s:::::s  ssssss 
 i::::i m::::m   m::::m   m::::m  aa::::::::::::ag:::::g     g:::::g e:::::::::::::::::e    s::::::s      
 i::::i m::::m   m::::m   m::::m a::::aaaa::::::ag:::::g     g:::::g e::::::eeeeeeeeeee        s::::::s   
 i::::i m::::m   m::::m   m::::ma::::a    a:::::ag::::::g    g:::::g e:::::::e           ssssss   s:::::s 
i::::::im::::m   m::::m   m::::ma::::a    a:::::ag:::::::ggggg:::::g e::::::::e          s:::::ssss::::::s
i::::::im::::m   m::::m   m::::ma:::::aaaa::::::a g::::::::::::::::g  e::::::::eeeeeeee  s::::::::::::::s 
i::::::im::::m   m::::m   m::::m a::::::::::aa:::a gg::::::::::::::g   ee:::::::::::::e   s:::::::::::ss  
iiiiiiiimmmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaa   gggggggg::::::g     eeeeeeeeeeeeee    sssssssssss    
                                                             g:::::g                                      
                                                 gggggg      g:::::g                                      
                                                 g:::::gg   gg:::::g                                      
                                                  g::::::ggg:::::::g                                      
                                                   gg:::::::::::::g                                       
                                                     ggg::::::ggg                                         
                                                        gggggg                                            
*/

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

function viewImage() {
    let imageInput =
        document.getElementById("editImageInput");

    let previewBox =
        document.getElementById("imageView");

    let file = imageInput.files[0];

    if (!file) {

        previewBox.innerHTML =
            "<p>No image for this card.</p>";

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
    }); 
}


/*
                                                                                                                   
                                                                                     dddddddd                      
                                                                                     d::::::d                      
                                                                                     d::::::d                      
                                                                                     d::::::d                      
                                                                                     d:::::d                       
    cccccccccccccccc       aaaaaaaaaaaaa        rrrrr   rrrrrrrrr            ddddddddd:::::d          ssssssssss   
  cc:::::::::::::::c       a::::::::::::a       r::::rrr:::::::::r         dd::::::::::::::d        ss::::::::::s  
 c:::::::::::::::::c       aaaaaaaaa:::::a      r:::::::::::::::::r       d::::::::::::::::d      ss:::::::::::::s 
c:::::::cccccc:::::c                a::::a      rr::::::rrrrr::::::r     d:::::::ddddd:::::d      s::::::ssss:::::s
c::::::c     ccccccc         aaaaaaa:::::a       r:::::r     r:::::r     d::::::d    d:::::d       s:::::s  ssssss 
c:::::c                    aa::::::::::::a       r:::::r     rrrrrrr     d:::::d     d:::::d         s::::::s      
c:::::c                   a::::aaaa::::::a       r:::::r                 d:::::d     d:::::d            s::::::s   
c::::::c     ccccccc     a::::a    a:::::a       r:::::r                 d:::::d     d:::::d      ssssss   s:::::s 
c:::::::cccccc:::::c     a::::a    a:::::a       r:::::r                 d::::::ddddd::::::dd     s:::::ssss::::::s
 c:::::::::::::::::c     a:::::aaaa::::::a       r:::::r                  d:::::::::::::::::d     s::::::::::::::s 
  cc:::::::::::::::c      a::::::::::aa:::a      r:::::r                   d:::::::::ddd::::d      s:::::::::::ss  
    cccccccccccccccc       aaaaaaaaaa  aaaa      rrrrrrr                    ddddddddd   ddddd       sssssssssss    
                                                                                                                   
                                                                                                                   
                                                                                                                   
                                                                                                                   
                                                                                                                   
                                                                                                                   
                                                                                                                                                                                                     
*/


// ADD CARD

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

// FAVORITE CARD

function favoriteCard(cardId) {
    selectedCardIndex = cardId;
    const card = cards.find(card => card.id === cardId);

    if(!card) return;

    card.fav = !card.fav;

    if(card.fav) {
        showToast(`${card.name} was favorited!`);
    } else {
        showToast("Card was unfavorited");
    }

    saveCards();
    displayBookPage();
    
}

// DELETE CARD

function deleteCard(index) {

    cards.splice(index, 1);

    saveCards();

    selectedCardIndex = null;

    displayBookPage();
}

function openEditDrawer(cardId) {
    selectedCardIndex = cardId;
    const card = cards.find(card => card.id === cardId);

    if(!card) return;
    document.getElementById("imageView").innerHTML = 
    card.imageData 
    ? `<img src="${card.imageData}" alt="Editable Image">` 
    : `<div>No Image</div>`;

    document.getElementById("editCardName").value = card.name || "";
    document.getElementById("editSetName").value = card.setName || "";
    document.getElementById("editCardNumber").value = card.cardNum || "";
    document.getElementById("editQuantity").value = card.quantity || "";

    document.getElementById("editRarity").value = card.cardRarity || "";
    document.getElementById("editVariant").value = card.cardVariant || "";
    document.getElementById("editCondition").value = card.cardCondition || "";
    document.getElementById("editStatus").value = card.cardStatus || "";

    document.getElementById("editDrawer").classList.add("open");
}

// SAVE EDITED CARD

function saveEditedCard() {
    
    const card = cards.find(card => card.id === selectedCardIndex);

    if(!card) return;


    const imageInput = document.getElementById("editImageInput");
    const newFile = imageInput.files[0];

    function finishSavingEdit() {
        card.name = document.getElementById("editCardName").value.trim() || card.name;
        card.setName = document.getElementById("editSetName").value.trim() || card.setName;
        card.cardNum = document.getElementById("editCardNumber").value.trim() || card.cardNum;
        card.quantity = document.getElementById("editQuantity").value.trim() || card.quantity;

        card.cardRarity = document.getElementById("editRarity").value.trim() || card.cardRarity;
        card.cardVariant = document.getElementById("editVariant").value.trim() || card.cardVariant;
        card.cardCondition = document.getElementById("editCondition").value.trim() || card.cardCondition;
        card.cardStatus = document.getElementById("editStatus").value.trim() || card.cardStatus;

        saveCards();
        displayBookPage();

        imageInput.value = "";
        document.getElementById("editDrawer").classList.remove("open");

        showToast("Card updated!");
    }

    if(newFile) {
        compressImage(newFile, function(compressedImage) {
            card.imageData = compressedImage;
            finishSavingEdit();
        });
    } else {
        finishSavingEdit();
    }

    
}





/*
                                                                                             
                                                   bbbbbbbb                                  
         tttt                                      b::::::b                                  
      ttt:::t                                      b::::::b                                  
      t:::::t                                      b::::::b                                  
      t:::::t                                       b:::::b                                  
ttttttt:::::ttttttt           aaaaaaaaaaaaa         b:::::bbbbbbbbb             ssssssssss   
t:::::::::::::::::t           a::::::::::::a        b::::::::::::::bb         ss::::::::::s  
t:::::::::::::::::t           aaaaaaaaa:::::a       b::::::::::::::::b      ss:::::::::::::s 
tttttt:::::::tttttt                    a::::a       b:::::bbbbb:::::::b     s::::::ssss:::::s
      t:::::t                   aaaaaaa:::::a       b:::::b    b::::::b      s:::::s  ssssss 
      t:::::t                 aa::::::::::::a       b:::::b     b:::::b        s::::::s      
      t:::::t                a::::aaaa::::::a       b:::::b     b:::::b           s::::::s   
      t:::::t    tttttt     a::::a    a:::::a       b:::::b     b:::::b     ssssss   s:::::s 
      t::::::tttt:::::t     a::::a    a:::::a       b:::::bbbbbb::::::b     s:::::ssss::::::s
      tt::::::::::::::t     a:::::aaaa::::::a       b::::::::::::::::b      s::::::::::::::s 
        tt:::::::::::tt      a::::::::::aa:::a      b:::::::::::::::b        s:::::::::::ss  
          ttttttttttt         aaaaaaaaaa  aaaa      bbbbbbbbbbbbbbbb          sssssssssss    
                                                                                             
                                                                                             
                                                                                             
                                                                                             
                                                                                             
                                                                                             
                                                                                                                                                                                                                                                
*/

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


/*
                                                                                                                        
                                                                                                                        
                                                      tttt                                                              
                                                   ttt:::t                                                              
                                                   t:::::t                                                              
                                                   t:::::t                                                              
nnnn  nnnnnnnn            ooooooooooo        ttttttt:::::ttttttt             eeeeeeeeeeee             ssssssssss        
n:::nn::::::::nn        oo:::::::::::oo      t:::::::::::::::::t           ee::::::::::::ee         ss::::::::::s       
n::::::::::::::nn      o:::::::::::::::o     t:::::::::::::::::t          e::::::eeeee:::::ee     ss:::::::::::::s      
nn:::::::::::::::n     o:::::ooooo:::::o     tttttt:::::::tttttt         e::::::e     e:::::e     s::::::ssss:::::s     
  n:::::nnnn:::::n     o::::o     o::::o           t:::::t               e:::::::eeeee::::::e      s:::::s  ssssss      
  n::::n    n::::n     o::::o     o::::o           t:::::t               e:::::::::::::::::e         s::::::s           
  n::::n    n::::n     o::::o     o::::o           t:::::t               e::::::eeeeeeeeeee             s::::::s        
  n::::n    n::::n     o::::o     o::::o           t:::::t    tttttt     e:::::::e                ssssss   s:::::s      
  n::::n    n::::n     o:::::ooooo:::::o           t::::::tttt:::::t     e::::::::e               s:::::ssss::::::s     
  n::::n    n::::n     o:::::::::::::::o           tt::::::::::::::t      e::::::::eeeeeeee       s::::::::::::::s      
  n::::n    n::::n      oo:::::::::::oo              tt:::::::::::tt       ee:::::::::::::e        s:::::::::::ss       
  nnnnnn    nnnnnn        ooooooooooo                  ttttttttttt           eeeeeeeeeeeeee         sssssssssss         
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                        
*/

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


/*
                                                                                                                          
                                                                                                                          
                                                               tttt            iiii                                       
                                                            ttt:::t           i::::i                                      
                                                            t:::::t            iiii                                       
                                                            t:::::t                                                       
    ssssssssss      ooooooooooo   rrrrr   rrrrrrrrr   ttttttt:::::ttttttt    iiiiiiinnnn  nnnnnnnn       ggggggggg   ggggg
  ss::::::::::s   oo:::::::::::oo r::::rrr:::::::::r  t:::::::::::::::::t    i:::::in:::nn::::::::nn    g:::::::::ggg::::g
ss:::::::::::::s o:::::::::::::::or:::::::::::::::::r t:::::::::::::::::t     i::::in::::::::::::::nn  g:::::::::::::::::g
s::::::ssss:::::so:::::ooooo:::::orr::::::rrrrr::::::rtttttt:::::::tttttt     i::::inn:::::::::::::::ng::::::ggggg::::::gg
 s:::::s  ssssss o::::o     o::::o r:::::r     r:::::r      t:::::t           i::::i  n:::::nnnn:::::ng:::::g     g:::::g 
   s::::::s      o::::o     o::::o r:::::r     rrrrrrr      t:::::t           i::::i  n::::n    n::::ng:::::g     g:::::g 
      s::::::s   o::::o     o::::o r:::::r                  t:::::t           i::::i  n::::n    n::::ng:::::g     g:::::g 
ssssss   s:::::s o::::o     o::::o r:::::r                  t:::::t    tttttt i::::i  n::::n    n::::ng::::::g    g:::::g 
s:::::ssss::::::so:::::ooooo:::::o r:::::r                  t::::::tttt:::::ti::::::i n::::n    n::::ng:::::::ggggg:::::g 
s::::::::::::::s o:::::::::::::::o r:::::r                  tt::::::::::::::ti::::::i n::::n    n::::n g::::::::::::::::g 
 s:::::::::::ss   oo:::::::::::oo  r:::::r                    tt:::::::::::tti::::::i n::::n    n::::n  gg::::::::::::::g 
  sssssssssss       ooooooooooo    rrrrrrr                      ttttttttttt  iiiiiiii nnnnnn    nnnnnn    gggggggg::::::g 
                                                                                                                  g:::::g 
                                                                                                      gggggg      g:::::g 
                                                                                                      g:::::gg   gg:::::g 
                                                                                                       g::::::ggg:::::::g 
                                                                                                        gg:::::::::::::g  
                                                                                                          ggg::::::ggg    
                                                                                                             gggggg       
*/

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


/*
                                                                                                                                             
                                                                                                                                             
                                              tttt               tttt            iiii                                                        
                                           ttt:::t            ttt:::t           i::::i                                                       
                                           t:::::t            t:::::t            iiii                                                        
                                           t:::::t            t:::::t                                                                        
    ssssssssss       eeeeeeeeeeee    ttttttt:::::tttttttttttttt:::::ttttttt    iiiiiiinnnn  nnnnnnnn       ggggggggg   ggggg    ssssssssss   
  ss::::::::::s    ee::::::::::::ee  t:::::::::::::::::tt:::::::::::::::::t    i:::::in:::nn::::::::nn    g:::::::::ggg::::g  ss::::::::::s  
ss:::::::::::::s  e::::::eeeee:::::eet:::::::::::::::::tt:::::::::::::::::t     i::::in::::::::::::::nn  g:::::::::::::::::gss:::::::::::::s 
s::::::ssss:::::se::::::e     e:::::etttttt:::::::tttttttttttt:::::::tttttt     i::::inn:::::::::::::::ng::::::ggggg::::::ggs::::::ssss:::::s
 s:::::s  ssssss e:::::::eeeee::::::e      t:::::t            t:::::t           i::::i  n:::::nnnn:::::ng:::::g     g:::::g  s:::::s  ssssss 
   s::::::s      e:::::::::::::::::e       t:::::t            t:::::t           i::::i  n::::n    n::::ng:::::g     g:::::g    s::::::s      
      s::::::s   e::::::eeeeeeeeeee        t:::::t            t:::::t           i::::i  n::::n    n::::ng:::::g     g:::::g       s::::::s   
ssssss   s:::::s e:::::::e                 t:::::t    tttttt  t:::::t    tttttt i::::i  n::::n    n::::ng::::::g    g:::::g ssssss   s:::::s 
s:::::ssss::::::se::::::::e                t::::::tttt:::::t  t::::::tttt:::::ti::::::i n::::n    n::::ng:::::::ggggg:::::g s:::::ssss::::::s
s::::::::::::::s  e::::::::eeeeeeee        tt::::::::::::::t  tt::::::::::::::ti::::::i n::::n    n::::n g::::::::::::::::g s::::::::::::::s 
 s:::::::::::ss    ee:::::::::::::e          tt:::::::::::tt    tt:::::::::::tti::::::i n::::n    n::::n  gg::::::::::::::g  s:::::::::::ss  
  sssssssssss        eeeeeeeeeeeeee            ttttttttttt        ttttttttttt  iiiiiiii nnnnnn    nnnnnn    gggggggg::::::g   sssssssssss    
                                                                                                                    g:::::g                  
                                                                                                        gggggg      g:::::g                  
                                                                                                        g:::::gg   gg:::::g                  
                                                                                                         g::::::ggg:::::::g                  
                                                                                                          gg:::::::::::::g                   
                                                                                                            ggg::::::ggg                     
                                                                                                               gggggg                                       
*/

function toggleSettings() {

    let popup = document.getElementById("settingsPopup");

    settingsOpen = !settingsOpen;

    if (settingsOpen) {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}

/*
                                                                                              
                                                                                              
                                                                                              
                                                                                              
                                                                                              
                                                                                              
ppppp   ppppppppp     aaaaaaaaaaaaa     ggggggggg   ggggg    eeeeeeeeeeee        ssssssssss   
p::::ppp:::::::::p    a::::::::::::a   g:::::::::ggg::::g  ee::::::::::::ee    ss::::::::::s  
p:::::::::::::::::p   aaaaaaaaa:::::a g:::::::::::::::::g e::::::eeeee:::::eess:::::::::::::s 
pp::::::ppppp::::::p           a::::ag::::::ggggg::::::gge::::::e     e:::::es::::::ssss:::::s
 p:::::p     p:::::p    aaaaaaa:::::ag:::::g     g:::::g e:::::::eeeee::::::e s:::::s  ssssss 
 p:::::p     p:::::p  aa::::::::::::ag:::::g     g:::::g e:::::::::::::::::e    s::::::s      
 p:::::p     p:::::p a::::aaaa::::::ag:::::g     g:::::g e::::::eeeeeeeeeee        s::::::s   
 p:::::p    p::::::pa::::a    a:::::ag::::::g    g:::::g e:::::::e           ssssss   s:::::s 
 p:::::ppppp:::::::pa::::a    a:::::ag:::::::ggggg:::::g e::::::::e          s:::::ssss::::::s
 p::::::::::::::::p a:::::aaaa::::::a g::::::::::::::::g  e::::::::eeeeeeee  s::::::::::::::s 
 p::::::::::::::pp   a::::::::::aa:::a gg::::::::::::::g   ee:::::::::::::e   s:::::::::::ss  
 p::::::pppppppp      aaaaaaaaaa  aaaa   gggggggg::::::g     eeeeeeeeeeeeee    sssssssssss    
 p:::::p                                         g:::::g                                      
 p:::::p                             gggggg      g:::::g                                      
p:::::::p                            g:::::gg   gg:::::g                                      
p:::::::p                             g::::::ggg:::::::g                                      
p:::::::p                              gg:::::::::::::g                                       
ppppppppp                                ggg::::::ggg                                         
                                            gggggg                                            
*/



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



/*
                                                                                                        
            dddddddd                                                            ''''''                  
            d::::::d                                                            '::::'                  
            d::::::d                                                            '::::'                  
            d::::::d                                                            ':::''                  
            d:::::d                                                            ':::'                    
    ddddddddd:::::drrrrr   rrrrrrrrr   aaaaaaaaaaaaa     ggggggggg   ggggg     ''''   nnnn  nnnnnnnn    
  dd::::::::::::::dr::::rrr:::::::::r  a::::::::::::a   g:::::::::ggg::::g            n:::nn::::::::nn  
 d::::::::::::::::dr:::::::::::::::::r aaaaaaaaa:::::a g:::::::::::::::::g            n::::::::::::::nn 
d:::::::ddddd:::::drr::::::rrrrr::::::r         a::::ag::::::ggggg::::::gg            nn:::::::::::::::n
d::::::d    d:::::d r:::::r     r:::::r  aaaaaaa:::::ag:::::g     g:::::g               n:::::nnnn:::::n
d:::::d     d:::::d r:::::r     rrrrrrraa::::::::::::ag:::::g     g:::::g               n::::n    n::::n
d:::::d     d:::::d r:::::r           a::::aaaa::::::ag:::::g     g:::::g               n::::n    n::::n
d:::::d     d:::::d r:::::r          a::::a    a:::::ag::::::g    g:::::g               n::::n    n::::n
d::::::ddddd::::::ddr:::::r          a::::a    a:::::ag:::::::ggggg:::::g               n::::n    n::::n
 d:::::::::::::::::dr:::::r          a:::::aaaa::::::a g::::::::::::::::g               n::::n    n::::n
  d:::::::::ddd::::dr:::::r           a::::::::::aa:::a gg::::::::::::::g               n::::n    n::::n
   ddddddddd   dddddrrrrrrr            aaaaaaaaaa  aaaa   gggggggg::::::g               nnnnnn    nnnnnn
                                                                  g:::::g                               
                                                      gggggg      g:::::g                               
                                                      g:::::gg   gg:::::g                               
                                                       g::::::ggg:::::::g                               
                                                        gg:::::::::::::g                                
                                                          ggg::::::ggg                                  
                                                             gggggg                                     
                                                                                                        
            dddddddd                                                                                    
            d::::::d                                                                                    
            d::::::d                                                                                    
            d::::::d                                                                                    
            d:::::d                                                                                     
    ddddddddd:::::drrrrr   rrrrrrrrr      ooooooooooo   ppppp   ppppppppp                               
  dd::::::::::::::dr::::rrr:::::::::r   oo:::::::::::oo p::::ppp:::::::::p                              
 d::::::::::::::::dr:::::::::::::::::r o:::::::::::::::op:::::::::::::::::p                             
d:::::::ddddd:::::drr::::::rrrrr::::::ro:::::ooooo:::::opp::::::ppppp::::::p                            
d::::::d    d:::::d r:::::r     r:::::ro::::o     o::::o p:::::p     p:::::p                            
d:::::d     d:::::d r:::::r     rrrrrrro::::o     o::::o p:::::p     p:::::p                            
d:::::d     d:::::d r:::::r            o::::o     o::::o p:::::p     p:::::p                            
d:::::d     d:::::d r:::::r            o::::o     o::::o p:::::p    p::::::p                            
d::::::ddddd::::::ddr:::::r            o:::::ooooo:::::o p:::::ppppp:::::::p                            
 d:::::::::::::::::dr:::::r            o:::::::::::::::o p::::::::::::::::p                             
  d:::::::::ddd::::dr:::::r             oo:::::::::::oo  p::::::::::::::pp                              
   ddddddddd   dddddrrrrrrr               ooooooooooo    p::::::pppppppp                                
                                                         p:::::p                                        
                                                         p:::::p                                        
                                                        p:::::::p                                       
                                                        p:::::::p                                       
                                                        p:::::::p                                       
                                                        ppppppppp                                       
                                                                                                        
*/

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

//
// LOG IN START UP
//


            // // RANDOMLY GENERATED USERNAMES
            
            // const adjectives = ["Swift", "Lucky", "Calm", "Bright", "Shadow", "Golden"];
            // const collectorWords = ["Binder", "Holo", "Dex", "Pocket", "Booster", "Trainer"];

            // function generateUsername() {
            //     let adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            //     let word = collectorWords[Math.floor(Math.random() * collectorWords.length)];
            //     let num = Math.floor(Math.random() * 1000);
            //     return adj + word + num;
            // }

            // function createLocalProfile() {
            //     let user = {
            //         id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
            //         username: generateUsername(),
            //         createdAt: Date.now(),
            //         createdAtReadable: new Date().toLocaleString()
            //     };

            //     localStorage.setItem("vaultUser", JSON.stringify(user));

            //     loadLocalProfile();
            // }

            // function loadLocalProfile() {
            //     let savedUser = localStorage.getItem("vaultUser");
            //     if(savedUser) {
            //         let user = JSON.parse(savedUser);

                    
            //         document.getElementById("profileBox").style.display = "block";
            //         document.getElementById("usernameDisplay").textContent = user.username;
            //     }
            // }


/*
                                                                                                                
                                                                                                                
  iiii                                                                                            tttt          
 i::::i                                                                                        ttt:::t          
  iiii                                                                                         t:::::t          
                                                                                               t:::::t          
iiiiiii    mmmmmmm    mmmmmmm   ppppp   ppppppppp      ooooooooooo   rrrrr   rrrrrrrrr   ttttttt:::::ttttttt    
i:::::i  mm:::::::m  m:::::::mm p::::ppp:::::::::p   oo:::::::::::oo r::::rrr:::::::::r  t:::::::::::::::::t    
 i::::i m::::::::::mm::::::::::mp:::::::::::::::::p o:::::::::::::::or:::::::::::::::::r t:::::::::::::::::t    
 i::::i m::::::::::::::::::::::mpp::::::ppppp::::::po:::::ooooo:::::orr::::::rrrrr::::::rtttttt:::::::tttttt    
 i::::i m:::::mmm::::::mmm:::::m p:::::p     p:::::po::::o     o::::o r:::::r     r:::::r      t:::::t          
 i::::i m::::m   m::::m   m::::m p:::::p     p:::::po::::o     o::::o r:::::r     rrrrrrr      t:::::t          
 i::::i m::::m   m::::m   m::::m p:::::p     p:::::po::::o     o::::o r:::::r                  t:::::t          
 i::::i m::::m   m::::m   m::::m p:::::p    p::::::po::::o     o::::o r:::::r                  t:::::t    tttttt
i::::::im::::m   m::::m   m::::m p:::::ppppp:::::::po:::::ooooo:::::o r:::::r                  t::::::tttt:::::t
i::::::im::::m   m::::m   m::::m p::::::::::::::::p o:::::::::::::::o r:::::r                  tt::::::::::::::t
i::::::im::::m   m::::m   m::::m p::::::::::::::pp   oo:::::::::::oo  r:::::r                    tt:::::::::::tt
iiiiiiiimmmmmm   mmmmmm   mmmmmm p::::::pppppppp       ooooooooooo    rrrrrrr                      ttttttttttt  
                                 p:::::p                                                                        
                                 p:::::p                                                                        
                                p:::::::p                                                                       
                                p:::::::p                                                                       
                                p:::::::p                                                                       
                                ppppppppp                                                                       
                                                                                                                
*/
function exportVaultData() {
    const vaultData = {
        vaultUser,
        cards,
        binders,
        activeBinderIndex
    };

    const jsonString = JSON.stringify(vaultData, null, 2);

    document.getElementById("vaultDataBox").value = jsonString;

    showToast(
        `${vaultUser.username} | ${cards.length} cards exported.`
    );
}

function importVaultData() {
    const vaultDataBox = document.getElementById("vaultDataBox");

    if(!vaultDataBox.value.trim()) {
        showToast("Nothing to import")
        return;
    }

    try {
        const importedData = JSON.parse(vaultDataBox.value);

        vaultUser = importedData.vaultUser || vaultUser;
        cards = importedData.cards || [];
        binders = importedData.binders || binders;
        activeBinderIndex = importedData.activeBinderIndex ?? 0;
        currentPage = 1;

        localStorage.setItem("vaultUser", JSON.stringify(vaultUser));
        saveCards();
        saveBinders()
        saveActiveBinder();

        displayTabs();
        displayBookPage();
        showToast("Vault Imported!")
    } catch (error) {
        showToast("Invalid JSON");
        console.error(error);
    }
}

function copyVaultData() {
    const vaultDataBox = document.getElementById("vaultDataBox");

    navigator.clipboard.writeText(vaultDataBox.value);

    showToast("Vault Data Copied Successfully!");
}


 
/*                                                                                             
                         tttt            iiii  lllllll   iiii          tttt                               
                      ttt:::t           i::::i l:::::l  i::::i      ttt:::t                               
                      t:::::t            iiii  l:::::l   iiii       t:::::t                               
                      t:::::t                  l:::::l              t:::::t                               
uuuuuu    uuuuuuttttttt:::::ttttttt    iiiiiii  l::::l iiiiiiittttttt:::::tttttttyyyyyyy           yyyyyyy
u::::u    u::::ut:::::::::::::::::t    i:::::i  l::::l i:::::it:::::::::::::::::t y:::::y         y:::::y 
u::::u    u::::ut:::::::::::::::::t     i::::i  l::::l  i::::it:::::::::::::::::t  y:::::y       y:::::y  
u::::u    u::::utttttt:::::::tttttt     i::::i  l::::l  i::::itttttt:::::::tttttt   y:::::y     y:::::y   
u::::u    u::::u      t:::::t           i::::i  l::::l  i::::i      t:::::t          y:::::y   y:::::y    
u::::u    u::::u      t:::::t           i::::i  l::::l  i::::i      t:::::t           y:::::y y:::::y     
u::::u    u::::u      t:::::t           i::::i  l::::l  i::::i      t:::::t            y:::::y:::::y      
u:::::uuuu:::::u      t:::::t    tttttt i::::i  l::::l  i::::i      t:::::t    tttttt   y:::::::::y       
u:::::::::::::::uu    t::::::tttt:::::ti::::::il::::::li::::::i     t::::::tttt:::::t    y:::::::y        
 u:::::::::::::::u    tt::::::::::::::ti::::::il::::::li::::::i     tt::::::::::::::t     y:::::y         
  uu::::::::uu:::u      tt:::::::::::tti::::::il::::::li::::::i       tt:::::::::::tt    y:::::y          
    uuuuuuuu  uuuu        ttttttttttt  iiiiiiiilllllllliiiiiiii         ttttttttttt     y:::::y           
                                                                                       y:::::y            
                                                                                      y:::::y             
                                                                                     y:::::y              
                                                                                    y:::::y               
                                                                                   yyyyyyy                
                                                                                                          
                                                                                                          
*/


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


/*
                                                                                                                          
                                                                                                                          
                          tttt                                                        tttt                      ^^^       
                       ttt:::t                                                     ttt:::t                     ^:::^      
                       t:::::t                                                     t:::::t                    ^:::::^     
                       t:::::t                                                     t:::::t                   ^:::::::^    
    ssssssssss   ttttttt:::::ttttttt      aaaaaaaaaaaaa  rrrrr   rrrrrrrrr   ttttttt:::::ttttttt            ^:::::::::^   
  ss::::::::::s  t:::::::::::::::::t      a::::::::::::a r::::rrr:::::::::r  t:::::::::::::::::t           ^:::::^:::::^  
ss:::::::::::::s t:::::::::::::::::t      aaaaaaaaa:::::ar:::::::::::::::::r t:::::::::::::::::t          ^:::::^ ^:::::^ 
s::::::ssss:::::stttttt:::::::tttttt               a::::arr::::::rrrrr::::::rtttttt:::::::tttttt         ^^^^^^^   ^^^^^^^
 s:::::s  ssssss       t:::::t              aaaaaaa:::::a r:::::r     r:::::r      t:::::t                                
   s::::::s            t:::::t            aa::::::::::::a r:::::r     rrrrrrr      t:::::t                                
      s::::::s         t:::::t           a::::aaaa::::::a r:::::r                  t:::::t                                
ssssss   s:::::s       t:::::t    tttttta::::a    a:::::a r:::::r                  t:::::t    tttttt                      
s:::::ssss::::::s      t::::::tttt:::::ta::::a    a:::::a r:::::r                  t::::::tttt:::::t                      
s::::::::::::::s       tt::::::::::::::ta:::::aaaa::::::a r:::::r                  tt::::::::::::::t                      
 s:::::::::::ss          tt:::::::::::tt a::::::::::aa:::ar:::::r                    tt:::::::::::tt                      
  sssssssssss              ttttttttttt    aaaaaaaaaa  aaaarrrrrrr                      ttttttttttt                        
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
*/
loadSavedTheme();

// PAGE CHANGE DISPLAY
document.getElementById("pageSlider").oninput = function () {
    currentPage = Number(this.value);
    displayBookPage();
}

// DISPLAY TABS
displayTabs();

cards = JSON.parse(
    localStorage.getItem("cards")
) || [];

cards = updateOldCards(cards);

localStorage.setItem(
    "cards",
    JSON.stringify(cards)
);


// DEFAULT DISPLAY
displayBookPage();