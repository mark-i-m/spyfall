
// A bunch of things on the website.
const forms = document.getElementById("forms");
const formNew = document.getElementById("form-new");
const formJoin = document.getElementById("form-join");
const formNPlayers = document.getElementById("n-players");
const gameIdText = document.getElementById("game-id-text");
const playerNum = document.getElementById("player-num");
const gameIdDisplay = document.getElementById("game-id-display");
const ready = document.getElementById("ready");
const game = document.getElementById("game");
const spyText = document.getElementById("spy");
const locationBox = document.getElementById("location");
const locationText = document.getElementById("location-text");
const locationsList = document.getElementById("location-list");
const shareLink = document.getElementById("share-link");

// Some game variables.

let gameId = 0;

const locations = [
    "Beach", "Bank", "Airplane", "House", "Church", "Cruise Ship", "Military Base",
    "Hospital", "Restaurant", "Salon", "Barber shop", "Dungeon", "Classroom",
    "Desert Island", "Meadow", "Farm", "Highway", "Office", "Subway tunnel",
    "Train station", "Grocery Store", "Circus", "Movie theatre", "Casino",
    "Bank", "Embassy", "Submarine", "Pirate ship", "The International Space Station",
    "Airport", "McMurdo Station, Antarctica"
];

// Some utilities.

function hide(elem) {
    elem.style.display = "none";
}

function show(elem) {
    elem.style.display = "block";
}

function genGameId(numPlayers) {
    // Generate 3 random characters.
    const letters =
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    // Returns a random 3 character string.
    return "" + numPlayers + letters;
}

function nPlayersFromGameId(gameId) {
    let leadingNumbers = "";
    for (let i = 0; i < gameId.length; ++i) {
        if (gameId.charAt(i) <= '9' &&
            gameId.charAt(i) >= '0')
        {
            leadingNumbers += gameId.charAt(i);
        } else {
            break;
        }
    }

    return parseInt(leadingNumbers);
}

function locationFromGameId(gameId) {
    let rand = 0;
    for (let i = 0; i < gameId.length; ++i) {
        if (gameId.charAt(i) <= '9' &&
            gameId.charAt(i) >= '0')
        {
            continue;
        } else {
            rand += gameId.charCodeAt(i);
        }
    }

    return rand % locations.length;
}

function spyNumberFromGameId(gameId) {
    const nPlayers = nPlayersFromGameId(gameId);
    return gameId.charCodeAt(gameId.length - 1) % nPlayers;
}

function populateLocationsList() {
    let list = document.createElement("ul");

    for (loc in locations) {
        let item = document.createElement("li");
        item.textContent = locations[loc];
        item.setAttribute("class", "location");

        list.appendChild(item);
    }

    locationsList.appendChild(list);
}

// Handlers

function newGame() {
    // Update number of players.
    const numberOfPlayers = parseInt(formNPlayers.value);

    // Compute a new game id at random.
    gameId = genGameId(numberOfPlayers);

    gameIdDisplay.textContent = gameId;
    shareLink.href = "https://mark-i-m.github.io/spyfall/?game=" + gameId;

    hide(forms);
    show(ready);
}

function joinGame() {
    // Get the game id.
    gameId = gameIdText.value;

    gameIdDisplay.textContent = gameId;

    hide(forms);
    show(ready);
}

function startGame() {
    // Figure out what are the location and the player's role based on player
    // number and game ID.
    const nPlayers = nPlayersFromGameId(gameId);
    const locationId = locationFromGameId(gameId);
    const spyNumber = spyNumberFromGameId(gameId);

    const playerId = parseInt(playerNum.value);

    const isSpy = playerId == spyNumber;

    if (isSpy) {
        show(spyText);
        hide(locationBox);
    } else {
        locationText.textContent = locations[locationId];
        show(locationBox);
        hide(spyText);
    }

    populateLocationsList();

    hide(ready);
    show(game);
}

function loaded() {
    // Check if there is a gameId in the query string.

    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get("game");

    if (gameId !== null) {
        gameIdText.value = gameId;
        gameIdText.disabled = true;
    }
}
