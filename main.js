// Disse arrays bliver oprettet, så vi kan bruge dem senere i koden.

let questions = {
    neverHaveIEver: [],
    category: [],
    mostLikelyTo: [],
    bonusMessages: [],
    unhinged: []
};

// Spørgsmålene bliver hentet ind fra JSON filen, og lagt ind i de ovenstående arrays.
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        questions.neverHaveIEver = data.neverHaveIEver;
        questions.category = data.category;
        questions.mostLikelyTo = data.mostLikelyTo;
        questions.bonusMessages = data.bonusMessages;
        questions.unhinged = data.unhinged;
    })
    .catch(error => console.error("Error fetching questions:", error));

let easterEggInput = ""; // indeholder keystroke inputtet for easteregget.
let unhingedModeActivated = false;

document.addEventListener("touchstart", () => {
    tapCount++;

    // Hvis brugeren har trykket tre gange hurtigt, aktiverer vi easter egg
    if (tapCount === 3) {
        unlockUnhingedMode();
        tapCount = 0; // Nulstil tap count efter aktivering
    }

    // Nulstil tap count efter en kort forsinkelse, hvis der ikke er flere hurtige tryk
    if (tapTimer) {
        clearTimeout(tapTimer);
    }
    tapTimer = setTimeout(() => {
        tapCount = 0;
    }, 500); // Taps skal ske inden for 500ms
});

function unlockUnhingedMode() {
    unhingedModeActivated = true; // hvis unhingedmode er låst op, vil denne være true.
    document.getElementById("mode-title").textContent = "UNHINGED MODE UNLOCKED!";}

// denne funktion lytter efter keystrokes for at låse op for unhinged spørgsmål.
document.addEventListener("keydown", (event) => {
    easterEggInput += event.key.toLowerCase();

    // denne tjekker om inputtet er lig "easteregg"
    if (easterEggInput.includes("easteregg")) {
        unlockUnhingedMode();
        easterEggInput = ""; // nulstiller easteregg inputtet.
    }

    // denne laver en limit på inputtet, funktionen tjekker efter.
    if (easterEggInput.length > 20) {
        easterEggInput = easterEggInput.slice(-20);
    }
});

// Når man trykker på en specifik gamemode, bliver alt nulstillet og gamemoden dukker op på h1
document.getElementById("modeSelect").addEventListener("change", () => {
    const modeSelect = document.getElementById("modeSelect").value;

    // Dette opdaterer overskriften med det valgte gamemode
    if (modeSelect === "neverHaveIEver") {
        document.getElementById("mode-title").textContent = "Jeg har aldrig..";
    } else if (modeSelect === "mostLikelyTo") {
        document.getElementById("mode-title").textContent = "Hvem er mest tilbøjelig til..";
    } else if (modeSelect === "category") {
        document.getElementById("mode-title").textContent = "Kategori..";
    } else {
        // Standard tekst, hvis ingen specifik tilstand er valgt
        document.getElementById("mode-title").textContent = "Jeg har aldrig..";
    }

    // Ryd bonusDisplay og result, hvis den eksisterer
    const bonusDisplay = document.getElementById("drinkMessage");
    const result = document.getElementById("result")
    if (bonusDisplay) {
        bonusDisplay.textContent = "";
    } else if (result) {
        result.textContent= ""
    }
});


// Funktionen sørger for at fjerne et spørgsmål, der allerede har været. Funktionen laver derudover en nulstil knap, når der ikke er flere spørgsmål tilbage i vores JSON objekter.
function selectAndRemoveQuestion(array) {
    if (array.length === 0) {
        document.getElementById("mode-title").textContent = "Ingen flere spørgsmål!";
        document.getElementById("result").textContent = "";

        const resetButton = document.createElement("button");
        resetButton.textContent = "Nulstil Spørgsmål";
        document.body.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            location.reload();
        })

    } // Dette else statement returnerer det sprøgsmål, der lige er blevet fjernet vha. splice metoden.
        else {
        const randomIndex = Math.floor(Math.random() * array.length);
        const question = array[randomIndex];
        array.splice(randomIndex, 1);
        return question;
    }
}

function randomChoice() {
    const modeSelect = document.getElementById("modeSelect").value;
    let selectedQuestion;

    // Brug brugerens valg fra dropdown-menuen, hvis et specifikt gamemode er valgt
    if (modeSelect === "neverHaveIEver") {
        document.getElementById("mode-title").textContent = "Jeg har aldrig..";
        selectedQuestion = selectAndRemoveQuestion(questions.neverHaveIEver);
    } else if (modeSelect === "mostLikelyTo") {
        document.getElementById("mode-title").textContent = "Hvem er mest tilbøjelig til..";
        selectedQuestion = selectAndRemoveQuestion(questions.mostLikelyTo);
    } else if (modeSelect === "category") {
        document.getElementById("mode-title").textContent = "Kategori..";
        selectedQuestion = selectAndRemoveQuestion(questions.category);
    } else {
        // Hvis der ikke er valgt en specifik tilstand, bruger vi standardfordelingen
        const randomMode = Math.random();

        if (randomMode >= 0.00 && randomMode <= 0.20) {
            // Kategori (20% chance for at få denne gamemode)
            document.getElementById("mode-title").textContent = "Kategori..";
            selectedQuestion = selectAndRemoveQuestion(questions.category);
        } else if (randomMode >= 0.21 && randomMode <= 0.40) {
            // Hvem er mest tilbøjelig til (19% chance for at få denne gamemode)
            document.getElementById("mode-title").textContent = "Hvem er mest tilbøjelig til..";
            selectedQuestion = selectAndRemoveQuestion(questions.mostLikelyTo);
        } else if (unhingedModeActivated && randomMode >= 0.41 && randomMode <= 0.60) {
            // Hvis easteregg er aktiveret , er der en 19% chance for, at få denne gamemode)
            document.getElementById("mode-title").textContent = "UNHINGED";
            selectedQuestion = selectAndRemoveQuestion(questions.unhinged);
        }
        else {
            // Jeg har aldrig (40% chance for at få denne gamemode)
            document.getElementById("mode-title").textContent = "Jeg har aldrig..";
            selectedQuestion = selectAndRemoveQuestion(questions.neverHaveIEver);
        }
    }

    // Viser det valgte spørgsmål, hvis der er et tilgængeligt spørgsmål
    if (selectedQuestion) {
        document.getElementById("result").textContent = selectedQuestion;
    }

    // Her rydes bonusDisplay, hvis den altså eksisterer, inden der vises et nyt spørgsmål
    const bonusDisplay = document.getElementById("drinkMessage");
    if (bonusDisplay) {
        bonusDisplay.textContent = "";
    }

    // Der er kun 25% chance for at få en bonusbesked, så længe der stadig er elementer i det sorterede array.
    if (Math.random() <= 0.50 && questions.bonusMessages.length > 0) {
        showDrinkMessage();
    }

    // Funktion til at vise en bonusbesked, hvis betingelserne er opfyldt
    function showDrinkMessage() {
        // Denne sortere allerede viste bonusbeskeder vha. funktionen. Vi bruger denne nye array med de sorterede bonusbeskeder senere i koden.
        const bonusMessage = selectAndRemoveQuestion(questions.bonusMessages);

        // Hvis ID elementet allerede eksisterer, gemmes det i variablen 'bonusDisplay'
        const bonusDisplay = document.getElementById("drinkMessage");

        // Dette sætter tekstindholdet for bonusDisplay til den tilfældige bonusbesked (se variablen bonusMessage).
        bonusDisplay.textContent = bonusMessage;
        bonusDisplay.style.visibility = "visible";
        document.body.appendChild(bonusDisplay);
    }
}

