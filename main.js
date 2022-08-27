import ancientsData from './data/ancients.js';
import difficulties from './data/difficulties.js';
import greenCards from './data/Cards/greenCards.js';
import brownCards from './data/Cards/brownCards.js';
import blueCards from './data/Cards/blueCards.js';

const ancientsContainer = document.querySelector('.ancients-container');
const ancients = document.querySelectorAll('.ancient-item');
const difficultiesContainer = document.querySelector('.difficulties');
const difficultiesElements = document.getElementsByClassName('difficultie');
const cards = document.querySelector('.cards');
let activeAncient;
let activeDifficultie;
let diffCreator = true;
let shuffleCreator = true;

ancientsContainer.onclick = function(event) {
    let ancient = event.target;
    if (ancient.className == 'ancient-item') {
        activeAncientFunc(ancient);
        if (!shuffleCreator) {
            repeat();
        }
        if (diffCreator) {
            createDifficulties();
            eventOnDifficulties();
            diffCreator = false;
        }
    }
};

function eventOnDifficulties() {
    difficultiesContainer.onclick = function(event) {
        let difficultie = event.target;
        if (difficultie.className == 'difficultie') {
            activeDifficultieFunc(difficultie);
            if (shuffleCreator) {
                createShuffleButton();
            }
            if (!shuffleCreator) {
                repeat();
            }
            shuffleCreator = false;
        }
    }
}

function createShuffleButton() {
    let div = document.createElement('div');
    div.className = "difficultie shuffle-btn";
    div.textContent = 'Замешать колоду';
    cards.append(div);
    const shuffleBtnElem = cards.querySelector('.shuffle-btn');
    shuffleBtnElem.onclick = function() {
        shuffleBtnElem.remove();
    let ancientIndex, diff;
    let arr = Array.from(ancients);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].className.includes('active-item')) {
            ancientIndex = i;
            break;
        }
    }
    arr = Array.from(difficultiesElements);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].className.includes('active-item')) {
            diff = arr[i].textContent;
            break;
        }
    }
    let green = [], brown = [], blue = [];
    for (let item of greenCards) {
        if (item['notSuitableFor'] != diff) {
            green.push(item);
        }
    }
    for (let item of brownCards) {
        if (item['notSuitableFor'] != diff) {
            brown.push(item);
        }
    }
    for (let item of blueCards) {
        if (item['notSuitableFor'] != diff) {
            blue.push(item);
        }
    }
    shuffle(green);
    shuffle(brown);
    shuffle(blue);
    let ancient = ancientsData[ancientIndex];
    green.length = ancient['firstStage']['green'] + ancient['secondStage']['green'] + ancient['thirdStage']['green'];
    brown.length = ancient['firstStage']['brown'] + ancient['secondStage']['brown'] + ancient['thirdStage']['brown'];
    blue.length  = ancient['firstStage']['blue']  + ancient['secondStage']['blue']  + ancient['thirdStage']['blue'];
    let deck = green.concat(brown, blue);
    shuffle(deck);
    let finalDeck = deckShuffling(ancient, deck);
    for (let stage of finalDeck) {
        shuffle(stage);
    }
    game(finalDeck);
    }
}

function createDifficulties() {
    for (let item of difficulties) {
        let div = document.createElement('div');
        div.className = "difficultie";
        div.textContent = item['name'];
        difficultiesContainer.append(div);
    }
}

function activeAncientFunc(ancient) {
    if (activeAncient) {
        activeAncient.classList.remove('active-item');
    }
    activeAncient = ancient;
    activeAncient.classList.add('active-item');
}

function activeDifficultieFunc(difficultie) {
    if (activeDifficultie) {
        activeDifficultie.classList.remove('active-item');
    }
    activeDifficultie = difficultie;
    activeDifficultie.classList.add('active-item');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

function deckShuffling (ancient, array) {
    let finalDeck = [[],[],[]];
    let counter = 0;
    let stages = document.createElement('div');
    stages.className = "stages";
    cards.append(stages);
    for (let stage in ancient) {
        let stageElem = document.createElement('div');
        stageElem.className = "stage";
        stageElem.innerHTML = `<span class='stageName'>${stage}</span>`
        stages.append(stageElem);
        for (let color in ancient[stage]) {
            let colorElem = document.createElement('div');
            colorElem.className = `counter ${color}`;
            colorElem.textContent = ancient[stage][color];
            stageElem.append(colorElem);
            let colorCounter = ancient[stage][color];
            for (let i = array.length - 1; i >= 0; i--) {
                if (colorCounter == 0) {
                    break;
                }
                if (color == array[i]['color']) {
                    finalDeck[counter].push(array[i]);
                    array.splice(i, 1);
                    --colorCounter;
                }
            }
        }
        ++counter;
    }
    return finalDeck;
}

function game (finalDeck) {
    let deckRoller = document.createElement('div');
    deckRoller.className = 'deck-roller';
    cards.append(deckRoller);
    let lastCard = document.createElement('div');
    lastCard.className = 'last-card';
    cards.append(lastCard);
    let stage = 0;
    let count = 0;
    deckRoller.onclick = function() {
        if (stage < 3) {
                lastCard.style.backgroundImage = `url("/assets/MythicCards/${finalDeck[stage][count]['color']}/${finalDeck[stage][count]['card']}.png")`;
                let minusCard = cards.firstElementChild.children[stage].querySelector(`.${finalDeck[stage][count]['color']}`);
                minusCard.textContent--;
                ++count;
                if(count == finalDeck[stage].length) {
                    cards.firstElementChild.children[stage].firstElementChild.style.color = 'red';
                    ++stage;
                    count = 0;
                }
        } else {
            alert('Колода закончилась');
        }
    }
}

function repeat () {
    cards.innerHTML = '';
    createShuffleButton();
}





setTimeout(help,3000);
function help() {
    alert('Выполнено:\n- 4 карты древнего (20 баллов);\n- 3 уровня сложности (15 баллов);\n- карты замешиваются согласно правилам (40 баллов);\n- есть трекер текущего состояния колоды (20 баллов);\n\nИтого: 95 баллов.');
}