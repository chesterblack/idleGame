const maxGuys = 4;
const guyClickerButton = document.querySelector('.guy-clicker');
const autoGuyButton = document.querySelector('.autoguy-upgrade');
const guySpawner = document.querySelector('.guy-spawner');
const autoGuyPriceSign = document.querySelector('.autoguy-cost');
const guyCounter = document.querySelector('.guy-counter');
const guyJumpRange = 750;
const guyMuseum = document.querySelector('.guy-collection');
const gpsCounter = document.querySelector('.gps');

let guyCollection = [];
let guyCount = parseInt(guyCounter.innerText);

let autoGuyer;
let autoGuyUpgradeCost = 100;
let gps = .5;

window.onload = () => {
    for (let i = 0; i < guyMuseum.children.length; i++) {
        const guyExhibit = guyMuseum.children[i];
        guyCollection.push({id: parseInt(guyExhibit.dataset.guyid)});
    }
    let cookies = getCookies();
    if (cookies.guycount) {
        guyCount = parseInt(cookies.guycount);
        updateGuyCount();
        saveGame();
    }
}


autoGuyButton.addEventListener('click', () => {
    if (guyCount < autoGuyUpgradeCost) {
        alert('Not enough guys!');
        return;
    }

    guyCount -= autoGuyUpgradeCost;
    gps = gps * 2;
    autoGuyUpgradeCost = autoGuyUpgradeCost * 2;
    let autoguySpeed = (1 / gps) * 1000;
    clearInterval(autoGuyer);
    autoGuyer = window.setInterval(autoGuyerisation, autoguySpeed);
    autoGuyPriceSign.innerText = autoGuyUpgradeCost;
    updateGuyCount();
    gpsCounter.innerText = gps;
});

guyClickerButton.addEventListener('click', () => {
    guyCount++;
    updateGuyCount();

    let guy = createGuy();
    makeGuyJump(guy);
    saveGameLocally();
});

function updateGuyCount() {
    guyCounter.innerText = guyCount;
}

function saveGameLocally() {
    document.cookie = `guycount=${guyCount}; path=/`;
}

function getCookies() {
    const cookies = Object.fromEntries(
        document.cookie.split('; ').map((entry) => entry.split('='))
    );
    return cookies;
}

function saveGame() {
    let url = '../save.php?guys=' + guyCount;
    let cookies = getCookies();

    if (cookies.saveid) {
        url += `&id=${cookies.saveid}`;
    }

    for (let i = 0; i < guyCollection.length; i++) {
        const guyID = guyCollection[i].id;
        url += `&museum[]=${guyID}`;
    }

    fetch (url, {method: 'GET'})
        .then (response => response.text())
        .then ((response) => {
            if (response) {
                document.cookie = `saveid=${response}; path=/`;
            }
        })
}

function upsert(array, element) {
    const i = array.findIndex(_element => _element.id === element.id);
    if (i > -1) {
        array[i] = element;
        return false;
    } else {
        array.push(element);
        return true;
    };
}

function addGuyToMuseum(guy) {
    if (upsert(guyCollection, {id: guy})) {
        guyMuseum.innerHTML = '';
        for (let i = 0; i < guyCollection.length; i++) {
            const guyCollected = guyCollection[i];
            let guyExhibit = document.createElement('img');
            guyExhibit.src = `./guys/guy-${guyCollected.id}.png`;
            guyExhibit.setAttribute('data-guyid', guyCollected.id);
            guyMuseum.appendChild(guyExhibit);
        }
    }
}

function createGuy() {
    let guy = document.createElement('div');
    let guyInner = document.createElement('img');

    const flipped = randomNumber(0,1);
    const guyID = randomNumber(1, maxGuys);

    addGuyToMuseum(guyID);
    guyInner.src = `./guys/guy-${guyID}.png`;

    if (flipped) {
        guy.classList.add('flipped');
    }
    guy.classList.add('guy');
    guyInner.classList.add('guy-inner');

    guy.appendChild(guyInner);

    return guy;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeGuyJump(guy) {
    let guyJumper = guy;
    let guyJumperInner = guy.querySelector('.guy-inner');
    let rand = randomNumber(-guyJumpRange, guyJumpRange);

    guySpawner.querySelector('.portal').animate([
        {
            rotate: '0deg',
        },
        {
            rotate: '180deg',
            easing: 'ease-in-out',
        }
    ], 500);

    guySpawner.appendChild(guyJumper);

    guyJumper.animate([
        {
            top: '0',
            easing: 'ease-out'
        },
        {
            top: '-50px',
            offset: 0.2,
            easing: 'ease-in-out'
        },
        {
            top: '500px',
            offset: 1,
            easing: 'ease-in'
        }
    ], 1000);

    guyJumperInner.animate([
        {
            left: '0',
            easing: 'ease-in'
        },
        {
            left: rand+'px',
            easing: 'ease-out'
        }
    ], 1000);

    guyJumperInner.animate([
        {
            opacity: '100%',
            offset: 0.7
        },
        {
            opacity: '0%'
        }
    ], 800)

    setTimeout(() => {
        guyJumper.parentNode.removeChild(guyJumper);
    }, 800);
}

function toggleAutoGuyer() {
    if (autoGuyerActive) {
        autoGuyerActive = false;
        clearInterval(autoGuyer);
        autoGuyButton.innerText = "ok yea let the guys flow";
    } else {
        autoGuyerActive = true;
        autoGuyer = window.setInterval(autoGuyerisation, 500);
        autoGuyButton.innerText = "wait no stop";
    }
}

function autoGuyerisation() {
    guyClickerButton.click();
}