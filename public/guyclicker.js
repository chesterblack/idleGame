const guyClickerButton = document.querySelector('.guy-clicker');
const guyCounter = document.querySelector('.guy-counter');
const root = document.documentElement;
const guyJumpRange = 750;


let guyCount = 0;

guyClickerButton.addEventListener('click', () => {
    guyCount++;
    guyCounter.innerText = guyCount;
    createGuy();
});

function createGuy() {
    let guyJumper = document.createElement('div');

    let rand = Math.floor(Math.random() * (guyJumpRange - -guyJumpRange + 1) + -guyJumpRange);


    root.style.setProperty('--guy-direction-X', rand+'px');
    console.log(rand);

    guyJumper.classList.add('guy');
    guyClickerButton.appendChild(guyJumper);
    setTimeout(() => {
        guyJumper.parentNode.removeChild(guyJumper);
    }, 800);
}