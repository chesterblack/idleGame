const maxGuys = 3;
const guyClickerButton = document.querySelector('.guy-clicker');
const guyCounter = document.querySelector('.guy-counter');
const root = document.documentElement;
const guyJumpRange = 750;
const guyMuseum = document.querySelector('.guy-collection');

let guyCollection = [];
let guyCount = parseInt(guyCounter.innerText);

guyClickerButton.addEventListener('click', () => {
    guyCount++;
    guyCounter.innerText = guyCount;

    let guy = createGuy();
    makeGuyJump(guy);
    saveGame();
});

function getCookies() {
    const cookies = Object.fromEntries(
        document.cookie.split('; ').map((entry) => entry.split('='))
    );
    return cookies;
}

function saveGame() {
    let url = '../save.php?guys=' + guyCount;
    let cookies = getCookies();

    console.log(cookies);

    if (cookies.saveid) {
        url += `&id=${cookies.saveid}`;
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

function createGuy() {
    let guy = document.createElement('div');
    let guyInner = document.createElement('img');

    const flipped = randomNumber(0,1);
    const guyID = randomNumber(1, maxGuys);

    if (upsert(guyCollection, {id: guyID})) {
        guyMuseum.innerHTML = '';

        for (let i = 0; i < guyCollection.length; i++) {
            const guyCollected = guyCollection[i];
            let guyExhibit = document.createElement('img');
            guyExhibit.src = `./guys/guy-${guyCollected.id}.png`;
            guyMuseum.appendChild(guyExhibit);
        }
    }

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

    document.querySelector('.guy-spawner').appendChild(guyJumper);

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

    setTimeout(() => {
        guyJumper.parentNode.removeChild(guyJumper);
    }, 800);
}