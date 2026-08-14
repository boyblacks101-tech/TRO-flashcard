/* =========================
   TROVIRUSES FLASHCARDS
   LANGUAGE EDITION
========================= */

const STORAGE_KEY = "troviruses_flashcards";

let state = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || {
    xp: 0,
    level: 1,
    playerName: "Player",
    decks: []
};


/* =========================
   SAVE
========================= */

function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


/* =========================
   ELEMENTS
========================= */

const pages = document.querySelectorAll(".page");

const navItems = document.querySelectorAll(".nav-item");

const xpElement = document.getElementById("xp");

const levelElement = document.getElementById("level");

const xpBar = document.getElementById("xpBar");

const profileLevel =
    document.getElementById("profileLevel");

const playerName =
    document.getElementById("playerName");

const deckList =
    document.getElementById("deckList");

const emptyDeck =
    document.getElementById("emptyDeck");

const deckStat =
    document.getElementById("deckStat");

const cardStat =
    document.getElementById("cardStat");

const masteredStat =
    document.getElementById("masteredStat");

const deckModal =
    document.getElementById("deckModal");

const deckForm =
    document.getElementById("deckForm");

const deckName =
    document.getElementById("deckName");

const deckDescription =
    document.getElementById("deckDescription");



/* =========================
   NAVIGATION
========================= */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active");

    }


    navItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.page === pageId
        ) {

            item.classList.add("active");

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        showPage(item.dataset.page);

    });

});


/* =========================
   WORLD BUTTONS
========================= */

document
    .querySelectorAll(".world-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const world =
                    card.dataset.world;

                if (world === "english") {

                    createLanguageDeck(
                        "English"
                    );

                }

                if (world === "spanish") {

                    createLanguageDeck(
                        "Spanish"
                    );

                }

            }
        );

    });



/* =========================
   LANGUAGE ENTRY
========================= */

function createLanguageDeck(language) {

    const existing =
        state.decks.find(
            deck =>
                deck.language === language
        );


    if (!existing) {

        state.decks.push({

            id: Date.now(),

            name:
                `${language} Vocabulary`,

            description:
                `Your ${language} vocabulary collection.`,

            language,

            cards: [],

            createdAt:
                new Date().toISOString()

        });


        saveState();

    }


    renderDecks();

    showPage("decksPage");

}



/* =========================
   DECK MODAL
========================= */

function openDeckModal() {

    deckModal.classList.add("active");

    deckName.focus();

}


function closeDeckModal() {

    deckModal.classList.remove("active");

    deckForm.reset();

}


document
    .getElementById("createDeckButton")
    ?.addEventListener(
        "click",
        openDeckModal
    );


document
    .getElementById("emptyCreateDeck")
    ?.addEventListener(
        "click",
        openDeckModal
    );


document
    .getElementById("closeDeckModal")
    ?.addEventListener(
        "click",
        closeDeckModal
    );


document
    .getElementById("cancelDeck")
    ?.addEventListener(
        "click",
        closeDeckModal
    );


deckModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === deckModal
        ) {

            closeDeckModal();

        }

    }
);



/* =========================
   CREATE DECK
========================= */

deckForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            deckName.value.trim();

        const description =
            deckDescription.value.trim();


        if (!name) return;


        const deck = {

            id: Date.now(),

            name,

            description:
                description ||
                "Language collection",

            language: "English",

            cards: [],

            createdAt:
                new Date().toISOString()

        };


        state.decks.push(deck);


        saveState();

        renderDecks();

        closeDeckModal();

        showPage("decksPage");

    }
);



/* =========================
   RENDER DECKS
========================= */

function renderDecks() {

    if (!deckList) return;


    deckList.innerHTML = "";


    if (state.decks.length === 0) {

        emptyDeck.style.display = "block";

    } else {

        emptyDeck.style.display = "none";

    }


    state.decks.forEach(deck => {

        const card =
            document.createElement("div");

        card.className = "deck-card";


        const icon =
            document.createElement("div");

        icon.className = "deck-icon";

        icon.textContent =
            deck.language === "Spanish"
                ? "Ñ"
                : "文";


        const content =
            document.createElement("div");


        const title =
            document.createElement("strong");

        title.textContent =
            deck.name;


        const description =
            document.createElement("span");

        description.textContent =
            `${deck.cards.length} cards · ${
                deck.language || "English"
            }`;


        content.appendChild(title);

        content.appendChild(description);


        card.appendChild(icon);

        card.appendChild(content);


        card.addEventListener(
            "click",
            () => {

                openDeck(deck.id);

            }
        );


        deckList.appendChild(card);

    });


    updateStats();

}



/* =========================
   OPEN DECK
========================= */

function openDeck(deckId) {

    const deck =
        state.decks.find(
            item =>
                item.id === deckId
        );


    if (!deck) return;


    /*
        مرحله بعدی اینجا می‌آید:

        Deck Screen
        Add Card
        Edit Card
        Delete Card
        Review
        Spaced Repetition
    */


    alert(
        `${deck.name}\n\n` +
        `${deck.cards.length} cards\n` +
        `${deck.language || "English"}`
    );

}



/* =========================
   STATS
========================= */

function updateStats() {

    const totalCards =
        state.decks.reduce(
            (total, deck) =>
                total + deck.cards.length,
            0
        );


    const masteredCards =
        state.decks.reduce(
            (total, deck) =>
                total +
                deck.cards.filter(
                    card =>
                        card.mastered
                ).length,
            0
        );


    if (deckStat) {

        deckStat.textContent =
            state.decks.length;

    }


    if (cardStat) {

        cardStat.textContent =
            totalCards;

    }


    if (masteredStat) {

        masteredStat.textContent =
            masteredCards;

    }

}



/* =========================
   XP
========================= */

function updateXP() {

    const xpNeeded =
        state.level * 100;


    const currentXP =
        state.xp % xpNeeded;


    const percentage =
        Math.min(
            (currentXP / xpNeeded) * 100,
            100
        );


    if (xpElement) {

        xpElement.textContent =
            `${state.xp} XP`;

    }


    if (levelElement) {

        levelElement.textContent =
            state.level;

    }


    if (profileLevel) {

        profileLevel.textContent =
            state.level;

    }


    if (playerName) {

        playerName.textContent =
            state.playerName;

    }


    if (xpBar) {

        xpBar.style.width =
            `${percentage}%`;

    }

}



/* =========================
   ADD XP
========================= */

function addXP(amount) {

    state.xp += amount;


    const required =
        state.level * 100;


    if (
        state.xp >= required
    ) {

        state.level++;

    }


    saveState();

    updateXP();

}



/* =========================
   PROFILE
========================= */

document
    .getElementById("profileButton")
    ?.addEventListener(
        "click",
        () => {

            showPage("profilePage");

        }
    );



/* =========================
   CONTINUE
========================= */

document
    .getElementById("continueButton")
    ?.addEventListener(
        "click",
        () => {

            const deck =
                state.decks.find(
                    item =>
                        item.cards.length > 0
                );


            if (!deck) {

                showPage("decksPage");

                return;

            }


            openDeck(deck.id);

        }
    );



/* =========================
   INITIALIZE
========================= */

function init() {

    renderDecks();

    updateXP();

    updateStats();

}


init();
