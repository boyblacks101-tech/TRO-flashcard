/* =========================================================
   TROVIRUSES FLASHCARDS
========================================================= */

const STORAGE_KEY = "troviruses_flashcards";

let data = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || {
    decks: [],
    xp: 0,
    level: 1
};

let activeDeckId = null;

let reviewCards = [];
let reviewIndex = 0;
let reviewFlipped = false;


/* ================= SAVE ================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* ================= ELEMENTS ================= */

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");

const deckList =
    document.getElementById("deckList");

const emptyDeck =
    document.getElementById("emptyDeck");

const deckModal =
    document.getElementById("deckModal");

const deckForm =
    document.getElementById("deckForm");

const createDeckButton =
    document.getElementById("createDeckButton");

const emptyCreateDeck =
    document.getElementById("emptyCreateDeck");

const closeDeckModal =
    document.getElementById("closeDeckModal");

const cancelDeck =
    document.getElementById("cancelDeck");

const deckViewPage =
    document.getElementById("deckViewPage");

const backToDecks =
    document.getElementById("backToDecks");

const activeDeckName =
    document.getElementById("activeDeckName");

const activeDeckDescription =
    document.getElementById(
        "activeDeckDescription"
    );

const activeDeckCardCount =
    document.getElementById(
        "activeDeckCardCount"
    );

const activeDeckMastered =
    document.getElementById(
        "activeDeckMastered"
    );

const cardList =
    document.getElementById("cardList");

const emptyCardState =
    document.getElementById(
        "emptyCardState"
    );

const cardModal =
    document.getElementById("cardModal");

const cardForm =
    document.getElementById("cardForm");

const addCardButton =
    document.getElementById(
        "addCardButton"
    );

const emptyAddCard =
    document.getElementById(
        "emptyAddCard"
    );

const closeCardModal =
    document.getElementById(
        "closeCardModal"
    );

const cancelCard =
    document.getElementById(
        "cancelCard"
    );


/* ================= PAGE NAV ================= */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    const page =
        document.getElementById(pageId);

    if (page) {

        page.classList.add("active");

    }


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


/* ================= DECK MODAL ================= */

function openDeckModal() {

    deckModal.classList.add("active");

    document
        .getElementById("deckName")
        ?.focus();

}


function closeDeckModalWindow() {

    deckModal.classList.remove(
        "active"
    );

    deckForm.reset();

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


/* ================= CREATE DECK ================= */

deckForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document
                .getElementById("deckName")
                .value
                .trim();

        const description =
            document
                .getElementById(
                    "deckDescription"
                )
                .value
                .trim();


        if (!name) return;


        const deck = {

            id:
                Date.now().toString(),

            name,

            description,

            language:
                "english",

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


/* ================= RENDER DECKS ================= */

function renderDecks() {

    if (!deckList) return;

    deckList.innerHTML = "";


    if (
        data.decks.length === 0
    ) {

        emptyDeck.style.display =
            "block";

        return;

    }


    emptyDeck.style.display =
        "none";


    data.decks.forEach(deck => {

        const card =
            document.createElement(
                "button"
            );

        card.className =
            "deck-card";


        card.innerHTML = `

            <div class="deck-icon">
                ▣
            </div>

            <div class="deck-content">

                <strong>
                    ${escapeHTML(
                        deck.name
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        deck.description ||
                        "Language collection"
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


        card.addEventListener(
            "click",
            () => {

                openDeck(deck.id);

            }
        );


        deckList.appendChild(card);

    });

}


/* ================= OPEN DECK ================= */

function openDeck(deckId) {

    const deck =
        data.decks.find(
            item =>
                item.id === deckId
        );


    if (!deck) return;


    activeDeckId =
        deckId;


    activeDeckName.textContent =
        deck.name;

    activeDeckDescription.textContent =
        deck.description ||
        "Your flashcards.";


    renderCards();

    showPage(
        "deckViewPage"
    );

}


/* ================= BACK ================= */

backToDecks?.addEventListener(
    "click",
    () => {

        activeDeckId = null;

        showPage(
            "decksPage"
        );

        renderDecks();

    }
);


/* ================= CARD MODAL ================= */

function openCardModal() {

    if (!activeDeckId) return;

    cardModal.classList.add(
        "active"
    );

    document
        .getElementById("cardFront")
        ?.focus();

}


function closeCardModalWindow() {

    cardModal.classList.remove(
        "active"
    );

    cardForm.reset();

}


addCardButton?.addEventListener(
    "click",
    openCardModal
);

emptyAddCard?.addEventListener(
    "click",
    openCardModal
);

closeCardModal?.addEventListener(
    "click",
    closeCardModalWindow
);

cancelCard?.addEventListener(
    "click",
    closeCardModalWindow
);


/* ================= CREATE CARD ================= */

cardForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const deck =
            data.decks.find(
                item =>
                    item.id === activeDeckId
            );


        if (!deck) return;


        const front =
            document
                .getElementById(
                    "cardFront"
                )
                .value
                .trim();


        const back =
            document
                .getElementById(
                    "cardBack"
                )
                .value
                .trim();


        if (!front || !back)
            return;


        const card = {

            id:
                Date.now().toString(),

            front,

            back,

            mastered:
                false,

            reviews:
                0,

            rating:
                null,

            createdAt:
                new Date().toISOString()

        };


        deck.cards.push(card);

        saveData();

        closeCardModalWindow();

        renderCards();

        renderDecks();

        updateHomeStats();

    }
);


/* ================= RENDER CARDS ================= */

function renderCards() {

    const deck =
        data.decks.find(
            item =>
                item.id === activeDeckId
        );


    if (!deck) return;


    cardList.innerHTML = "";


    activeDeckCardCount.textContent =
        deck.cards.length;


    activeDeckMastered.textContent =
        deck.cards.filter(
            card =>
                card.mastered
        ).length;


    if (
        deck.cards.length === 0
    ) {

        emptyCardState.style.display =
            "block";

        return;

    }


    emptyCardState.style.display =
        "none";


    deck.cards.forEach(card => {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "flashcard-item";


        element.innerHTML = `

            <div class="flashcard-front">

                <small>
                    FRONT
                </small>

                <strong>
                    ${escapeHTML(
                        card.front
                    )}
                </strong>

            </div>

            <div class="flashcard-back">

                <small>
                    BACK
                </small>

                <span>
                    ${escapeHTML(
                        card.back
                    )}
                </span>

            </div>

            <button
                class="delete-card"
                data-card-id="${card.id}"
            >
                ×
            </button>

        `;


        element
            .querySelector(
                ".delete-card"
            )
            .addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    deleteCard(
                        card.id
                    );

                }
            );


        cardList.appendChild(
            element
        );

    });

}


/* ================= DELETE CARD ================= */

function deleteCard(cardId) {

    const deck =
        data.decks.find(
            item =>
                item.id === activeDeckId
        );


    if (!deck) return;


    deck.cards =
        deck.cards.filter(
            card =>
                card.id !== cardId
        );


    saveData();

    renderCards();

    renderDecks();

    updateHomeStats();

}


/* =========================================================
   REVIEW SYSTEM
========================================================= */


/* ================= REVIEW ELEMENTS ================= */

const reviewModal =
    document.getElementById(
        "reviewModal"
    );

const reviewDeckTitle =
    document.getElementById(
        "reviewDeckTitle"
    );

const reviewCounter =
    document.getElementById(
        "reviewCounter"
    );

const reviewProgressBar =
    document.getElementById(
        "reviewProgressBar"
    );

const reviewCard =
    document.getElementById(
        "reviewCard"
    );

const reviewFront =
    document.getElementById(
        "reviewFront"
    );

const reviewBack =
    document.getElementById(
        "reviewBack"
    );

const reviewActions =
    document.getElementById(
        "reviewActions"
    );

const closeReview =
    document.getElementById(
        "closeReview"
    );


/* ================= START REVIEW ================= */

function startReview(deckId) {

    const deck =
        data.decks.find(
            item =>
                item.id === deckId
        );


    if (
        !deck ||
        deck.cards.length === 0
    ) {

        alert(
            "This deck has no cards yet."
        );

        return;

    }


    activeDeckId =
        deckId;


    reviewCards =
        [...deck.cards];


    reviewIndex = 0;

    reviewFlipped = false;


    reviewDeckTitle.textContent =
        deck.name;


    reviewModal.classList.add(
        "active"
    );


    showReviewCard();

}


/* ================= SHOW CARD ================= */

function showReviewCard() {

    if (
        !reviewCards.length
    ) return;


    const card =
        reviewCards[
            reviewIndex
        ];


    reviewFlipped = false;


    reviewCard.classList.remove(
        "flipped"
    );


    reviewFront.textContent =
        card.front;


    reviewBack.textContent =
        card.back;


    reviewCounter.textContent =
        `${reviewIndex + 1} / ${reviewCards.length}`;


    const progress =
        (
            reviewIndex /
            reviewCards.length
        ) * 100;


    reviewProgressBar.style.width =
        `${progress}%`;

}


/* ================= FLIP ================= */

reviewCard?.addEventListener(
    "click",
    () => {

        reviewFlipped =
            !reviewFlipped;


        reviewCard.classList.toggle(
            "flipped",
            reviewFlipped
        );

    }
);


/* ================= RATING ================= */

reviewActions
    ?.querySelectorAll(
        ".review-rating"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    !reviewFlipped
                ) {

                    return;

                }


                const rating =
                    button.dataset.rating;


                rateCard(
                    rating
                );

            }
        );

    });


/* ================= RATE CARD ================= */

function rateCard(rating) {

    const deck =
        data.decks.find(
            item =>
                item.id === activeDeckId
        );


    if (!deck) return;


    const card =
        deck.cards[
            reviewCards[
                reviewIndex
            ]
                ? deck.cards.find(
                    item =>
                        item.id ===
                        reviewCards[
                            reviewIndex
                        ].id
                )
                : 0
        ];


    if (!card) return;


    const xpRewards = {

        again: 1,

        hard: 3,

        good: 5,

        easy: 8

    };


    card.reviews += 1;

    card.rating =
        rating;


    if (
        rating === "good" ||
        rating === "easy"
    ) {

        card.mastered =
            true;

    }


    data.xp +=
        xpRewards[rating];


    updateLevel();

    saveData();

    updateXPUI();

    updateHomeStats();


    nextReviewCard();

}


/* ================= NEXT CARD ================= */

function nextReviewCard() {

    reviewIndex++;


    if (
        reviewIndex >=
        reviewCards.length
    ) {

        finishReview();

        return;

    }


    showReviewCard();

}


/* ================= FINISH ================= */

function finishReview() {

    reviewProgressBar.style.width =
        "100%";


    setTimeout(
        () => {

            reviewModal.classList.remove(
                "active"
            );


            alert(
                "Review complete! XP earned."
            );


            if (activeDeckId) {

                renderCards();

            }

        },
        250
    );

}


/* ================= CLOSE REVIEW ================= */

closeReview?.addEventListener(
    "click",
    () => {

        reviewModal.classList.remove(
            "active"
        );

    }
);


/* ================= REVIEW BUTTONS ================= */

document
    .getElementById(
        "continueButton"
    )
    ?.addEventListener(
        "click",
        () => {

            const deck =
                data.decks.find(
                    deck =>
                        deck.cards.length > 0
                );


            if (!deck) {

                showPage(
                    "decksPage"
                );

                return;

            }


            startReview(
                deck.id
            );

        }
    );


document
    .getElementById(
        "reviewDeckButton"
    )
    ?.addEventListener(
        "click",
        () => {

            if (!activeDeckId)
                return;


            startReview(
                activeDeckId
            );

        }
    );


/* ================= LEVEL ================= */

function updateLevel() {

    data.level =
        Math.floor(
            data.xp / 100
        ) + 1;

}


function updateXPUI() {

    const level =
        document.getElementById(
            "level"
        );

    const xp =
        document.getElementById(
            "xp"
        );

    const xpBar =
        document.getElementById(
            "xpBar"
        );


    if (
        !level ||
        !xp ||
        !xpBar
    ) return;


    const currentXP =
        data.xp % 100;


    level.textContent =
        data.level;


    xp.textContent =
        `${currentXP} XP`;


    xpBar.style.width =
        `${currentXP}%`;


    const profileLevel =
        document.getElementById(
            "profileLevel"
        );


    if (profileLevel) {

        profileLevel.textContent =
            data.level;

    }

}


/* ================= HOME STATS ================= */

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
            (
                total,
                deck
            ) =>
                total +
                deck.cards.length,
            0
        );


    const masteredCards =
        data.decks.reduce(
            (
                total,
                deck
            ) =>
                total +
                deck.cards.filter(
                    card =>
                        card.mastered
                ).length,
            0
        );


    if (deckStat)
        deckStat.textContent =
            data.decks.length;


    if (cardStat)
        cardStat.textContent =
            totalCards;


    if (masteredStat)
        masteredStat.textContent =
            masteredCards;

}


/* ================= WORLDS ================= */

document
    .querySelectorAll(
        ".world-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const world =
                    card.dataset.world;


                if (
                    world ===
                    "english"
                ) {

                    alert(
                        "English World connected."
                    );

                }


                if (
                    world ===
                    "spanish"
                ) {

                    alert(
                        "Spanish World coming soon."
                    );

                }

            }
        );

    });


/* ================= PROFILE ================= */

document
    .getElementById(
        "profileButton"
    )
    ?.addEventListener(
        "click",
        () => {

            showPage(
                "profilePage"
            );

        }
    );


/* ================= ESCAPE HTML ================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
         
