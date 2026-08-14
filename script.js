/* =========================================================
   TROVIRUSES FLASHCARDS
   Current HTML-compatible version
========================================================= */

const STORAGE_KEY = "troviruses_flashcards";

let data = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || {
    decks: [],
    xp: 0,
    level: 1,
    language: "english"
};


/* =========================================================
   ELEMENTS
========================================================= */

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");

const profileButton =
    document.getElementById("profileButton");

const continueButton =
    document.getElementById("continueButton");

const createDeckButton =
    document.getElementById("createDeckButton");

const emptyCreateDeck =
    document.getElementById("emptyCreateDeck");

const deckModal =
    document.getElementById("deckModal");

const deckForm =
    document.getElementById("deckForm");

const closeDeckModal =
    document.getElementById("closeDeckModal");

const cancelDeck =
    document.getElementById("cancelDeck");

const deckList =
    document.getElementById("deckList");

const emptyDeck =
    document.getElementById("emptyDeck");


/* =========================================================
   SAVE
========================================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const target =
        document.getElementById(pageId);


    if (!target) return;


    target.classList.add("active");


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });

}


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            showPage(
                item.dataset.page
            );

        }
    );

});


/* =========================================================
   PROFILE
========================================================= */

profileButton?.addEventListener(
    "click",
    () => {

        showPage("profilePage");

    }
);


/* =========================================================
   DECK MODAL
========================================================= */

function openDeckModal() {

    if (!deckModal) return;

    deckModal.classList.add("active");

    document
        .getElementById("deckName")
        ?.focus();

}


function closeDeckModalWindow() {

    if (!deckModal) return;

    deckModal.classList.remove("active");

    deckForm?.reset();

}


createDeckButton?.addEventListener(
    "click",
    openDeckModal
);


emptyCreateDeck?.addEventListener(
    "click",
    openDeckModal
);


closeDeckModal?.addEventListener(
    "click",
    closeDeckModalWindow
);


cancelDeck?.addEventListener(
    "click",
    closeDeckModalWindow
);


/* =========================================================
   CREATE DECK
========================================================= */

deckForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document
                .getElementById("deckName")
                ?.value
                .trim();


        const description =
            document
                .getElementById(
                    "deckDescription"
                )
                ?.value
                .trim();


        if (!name) return;


        const deck = {

            id:
                Date.now().toString(),

            name,

            description:
                description ||
                "Language collection",

            language:
                data.language || "english",

            cards: [],

            createdAt:
                new Date().toISOString()

        };


        data.decks.push(deck);


        saveData();

        closeDeckModalWindow();

        renderDecks();

        updateHomeStats();

    }
);


/* =========================================================
   RENDER DECKS
========================================================= */

function renderDecks() {

    if (!deckList) return;


    deckList.innerHTML = "";


    const language =
        data.language || "english";


    const visibleDecks =
        data.decks.filter(
            deck =>
                deck.language === language
        );


    if (
        visibleDecks.length === 0
    ) {

        if (emptyDeck) {

            emptyDeck.style.display =
                "block";

        }

        return;

    }


    if (emptyDeck) {

        emptyDeck.style.display =
            "none";

    }


    visibleDecks.forEach(deck => {

        const element =
            document.createElement("button");


        element.type = "button";

        element.className =
            "deck-card";


        element.innerHTML = `

            <div class="deck-icon">
                ▣
            </div>

            <div class="deck-content">

                <strong>
                    ${escapeHTML(deck.name)}
                </strong>

                <span>
                    ${escapeHTML(
                        deck.description
                    )}
                </span>

            </div>

            <div class="deck-meta">

                <strong>
                    ${deck.cards.length}
                </strong>

                <small>
                    cards
                </small>

            </div>

            <b>
                →
            </b>

        `;


        element.addEventListener(
            "click",
            () => {

                openDeck(deck);

            }
        );


        deckList.appendChild(element);

    });

}


/* =========================================================
   OPEN DECK
========================================================= */

function openDeck(deck) {

    if (!deck) return;


    alert(
        `${deck.name}\n\nCards: ${deck.cards.length}\n\nDeck system is ready for the next step.`
    );

}


/* =========================================================
   WORLDS
========================================================= */

document
    .querySelectorAll(".world-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const world =
                    card.dataset.world;


                if (
                    world === "english"
                ) {

                    data.language =
                        "english";

                    saveData();

                    renderDecks();

                    showPage("decksPage");

                    return;

                }


                if (
                    world === "spanish"
                ) {

                    data.language =
                        "spanish";

                    saveData();

                    renderDecks();

                    showPage("decksPage");

                    return;

                }


                if (
                    world === "cyber"
                ) {

                    alert(
                        "Cyber Security does not belong to the flashcard app."
                    );

                }

            }
        );

    });


/* =========================================================
   CONTINUE REVIEW
========================================================= */

continueButton?.addEventListener(
    "click",
    () => {

        const deck =
            data.decks.find(
                deck =>
                    deck.cards &&
                    deck.cards.length > 0
            );


        if (!deck) {

            showPage("decksPage");

            return;

        }


        alert(
            `Continue Review\n\n${deck.name}\n${deck.cards.length} cards`
        );

    }
);


/* =========================================================
   XP
========================================================= */

function updateLevel() {

    data.level =
        Math.floor(
            data.xp / 100
        ) + 1;

}


function updateXPUI() {

    const level =
        document.getElementById("level");

    const xp =
        document.getElementById("xp");

    const xpBar =
        document.getElementById("xpBar");

    const profileLevel =
        document.getElementById(
            "profileLevel"
        );


    updateLevel();


    const currentXP =
        data.xp % 100;


    if (level) {

        level.textContent =
            data.level;

    }


    if (xp) {

        xp.textContent =
            `${currentXP} XP`;

    }


    if (xpBar) {

        xpBar.style.width =
            `${currentXP}%`;

    }


    if (profileLevel) {

        profileLevel.textContent =
            data.level;

    }

}


/* =========================================================
   HOME STATS
========================================================= */

function updateHomeStats() {

    const deckStat =
        document.getElementById(
            "deckStat"
        );

    const cardStat =
        document.getElementById(
            "cardStat"
        );

    const masteredStat =
        document.getElementById(
            "masteredStat"
        );


    const totalCards =
        data.decks.reduce(
            (total, deck) =>
                total +
                deck.cards.length,
            0
        );


    const masteredCards =
        data.decks.reduce(
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
            data.decks.length;

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


/* =========================================================
   CONTINUE TEXT
========================================================= */

function updateContinueText() {

    const continueText =
        document.getElementById(
            "continueText"
        );


    if (!continueText) return;


    const cards =
        data.decks.reduce(
            (total, deck) =>
                total +
                deck.cards.length,
            0
        );


    if (cards === 0) {

        continueText.textContent =
            "No cards to review yet";

    } else {

        continueText.textContent =
            `${cards} cards ready to review`;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   MODAL OUTSIDE CLICK
========================================================= */

deckModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deckModal
        ) {

            closeDeckModalWindow();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateLevel();

updateXPUI();

updateHomeStats();

updateContinueText();

renderDecks();

showPage("homePage");
