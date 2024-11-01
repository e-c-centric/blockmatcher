const images = [
    'images/rubber_band.jpg',
    'images/cellotape.jpg',
    'images/pen.jpg',
    'images/fire.jpg',
    'images/scissors.jpg',
    'images/glue.jpg',
    'images/marker.jpg',
    'images/tape_measure.jpg',
];
const gridSize = 8;
const grid = document.getElementById('grid');
let score = 0;
let draggedBlock = null;
let draggedBlockId = null;
let timer = 60;
let timerInterval;

function createGrid() {
    grid.innerHTML = ''; 
    for (let i = 0; i < gridSize * gridSize; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        const img = document.createElement('img');
        img.src = images[Math.floor(Math.random() * images.length)];
        block.appendChild(img);
        block.setAttribute('data-id', i);
        block.setAttribute('draggable', true);
        grid.appendChild(block);

        block.addEventListener('dragstart', handleDragStart);
        block.addEventListener('dragover', handleDragOver);
        block.addEventListener('drop', handleDrop);
    }
}

function handleDragStart(event) {
    draggedBlock = event.target;
    draggedBlockId = event.target.parentNode.getAttribute('data-id');
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    const targetBlock = event.target.closest('.block');
    const targetBlockId = targetBlock.getAttribute('data-id');
    if (targetBlock && targetBlock !== draggedBlock.parentNode) {
        const draggedImage = draggedBlock.src;
        const targetImage = targetBlock.querySelector('img').src;

        draggedBlock.src = targetImage;
        targetBlock.querySelector('img').src = draggedImage;

        checkMatches();
    }
}

function checkMatches() {
    let matches = [];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize - 2; col++) {
            const firstBlock = getBlock(row, col);
            const secondBlock = getBlock(row, col + 1);
            const thirdBlock = getBlock(row, col + 2);
            if (firstBlock && secondBlock && thirdBlock &&
                firstBlock.querySelector('img').src === secondBlock.querySelector('img').src &&
                firstBlock.querySelector('img').src === thirdBlock.querySelector('img').src) {
                matches.push(firstBlock, secondBlock, thirdBlock);
            }
        }
    }

    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize - 2; row++) {
            const firstBlock = getBlock(row, col);
            const secondBlock = getBlock(row + 1, col);
            const thirdBlock = getBlock(row + 2, col);
            if (firstBlock && secondBlock && thirdBlock &&
                firstBlock.querySelector('img').src === secondBlock.querySelector('img').src &&
                firstBlock.querySelector('img').src === thirdBlock.querySelector('img').src) {
                matches.push(firstBlock, secondBlock, thirdBlock);
            }
        }
    }

    if (matches.length > 0) {
        animateMatches(matches);
    }
}

function getBlock(row, col) {
    return grid.children[row * gridSize + col];
}

function animateMatches(blocks) {
    blocks.forEach(block => {
        block.classList.add('wiggle');
    });

    setTimeout(() => {
        clearBlocks(blocks);
    }, 500); 
}

function clearBlocks(blocks) {
    blocks.forEach(block => {
        block.classList.remove('wiggle');
        block.querySelector('img').src = 'images/empty.png'; 
        score += 10; 
    });
    updateScore();
    setTimeout(fillEmptyBlocks, 500); 
}

function fillEmptyBlocks() {
    Array.from(grid.children).forEach((block, index) => {
        if (block.querySelector('img').src.includes('empty.png')) {
            block.querySelector('img').src = images[Math.floor(Math.random() * images.length)];
        }
    });
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function updateTimer() {
    timer--;
    document.getElementById('timer').innerText = `Time: ${timer}`;
    if (timer <= 0) {
        clearInterval(timerInterval);
        showModal();
    }
}

function showModal() {
    document.getElementById('final-score').innerText = score;
    document.getElementById('modal').style.display = 'flex';
}

function startGame() {
    score = 0;
    timer = 60;
    updateScore();
    document.getElementById('timer').innerText = `Time: ${timer}`;
    document.getElementById('restart').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    createGrid();
    timerInterval = setInterval(updateTimer, 1000);
}

document.getElementById('restart').addEventListener('click', startGame);
document.getElementById('modal-restart').addEventListener('click', startGame);

startGame();
checkMatches();