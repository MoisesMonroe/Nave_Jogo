const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colisaoGif = document.getElementById('colisaoGif');
const explosaoAudio = new Audio('audio/explosaoaudio.mp3');

function bateu() {
    return (nave.x < inimigo.x + inimigo.width &&
        nave.x + nave.width > inimigo.x &&
        nave.y < inimigo.y + inimigo.height &&
        nave.y + nave.height > inimigo.y);
}

function colisaoTiro(tiro, alvo) {
    return (tiro.x < alvo.x + alvo.width &&
        tiro.x + tiro.width > alvo.x &&
        tiro.y < alvo.y + alvo.height &&
        tiro.y + tiro.height > alvo.y);
}

let cenario = {
    x: -400,
    y: 0,
    width: 1800,
    height: 700,
    img: new Image()
};

cenario.img.src = 'img/cenario.png';

let nave = {
    x: canvas.width / 2,
    y: canvas.height - 160,
    width: 100,
    height: 164,
    img: new Image(),
};

nave.img.src = 'img/heroi.png';

let inimigo = {
    x: canvas.width / 2,
    y: 20,
    width: 100,
    height: 164,
    img: new Image()
};

inimigo.img.src = 'img/inimigo.png';

let tiros = [];

function drawNave() {
    ctx.drawImage(cenario.img, cenario.x, cenario.y, cenario.width, cenario.height);
    ctx.drawImage(nave.img, nave.x, nave.y, nave.width, nave.height);
    ctx.drawImage(inimigo.img, inimigo.x, inimigo.y, inimigo.width, inimigo.height);
}

function drawTiros() {
    let tiroColidiu = false;
    tiros.forEach((tiro, index) => {
        ctx.fillStyle = 'orange';
        ctx.fillRect(tiro.x, tiro.y, tiro.width, tiro.height);
        tiro.y -= tiro.speed;

        if (tiro.direction === 'up' && colisaoTiro(tiro, inimigo)) {
            tiros.splice(index, 1);
            explosaoAudio.play();
            exibirGifColisaoInimigo();
            tiroColidiu = true;
        }

        if (tiro.direction === 'down' && colisaoTiro(tiro, nave)) {
            tiros.splice(index, 1);
            explosaoAudio.play();
            exibirGifColisaoNave();
            tiroColidiu = true;
        }
    });
}

function exibirGifColisaoNave() {
    colisaoGif.style.left =  nave.x + 'px';
    colisaoGif.style.top = nave.y + 'px';
    colisaoGif.style.display = 'block';

    setTimeout(() => {
        colisaoGif.style.display = 'none';
    }, 1700);
}

function exibirGifColisaoInimigo() {
    colisaoGif.style.left =  inimigo.x + 'px';
    colisaoGif.style.top = inimigo.y + 'px';
    colisaoGif.style.display = 'block';

    setTimeout(() => {
        colisaoGif.style.display = 'none';
    }, 1700);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNave();
    drawTiros();

    if (bateu()) {
        colisao.style.display = 'block';
    } else {
        colisao.style.display = 'none';
    }

    requestAnimationFrame(draw);
}

function moveNave(e) {
    switch (e.key) {
        case 'w':
            nave.y -= 10;
            break;
        case 's':
            nave.y += 10;
            break;
        case 'a':
            nave.x -= 10;
            break;
        case 'd':
            nave.x += 10;
            break;
        case 'e':
            atirar();
            break;
        case 'ArrowUp':
            inimigo.y -= 10;
            break;
        case 'ArrowDown':
            inimigo.y += 10;
            break;
        case 'ArrowLeft':
            inimigo.x -= 10;
            break;
        case 'ArrowRight':
            inimigo.x += 10;
            break;
        case ' ':
            inimigoTiro();
            break;
    }
    console.log(bateu());
}

function atirar() {
    tiros.push({
        x: nave.x + nave.width / 2 - 2.5,
        y: nave.y,
        width: 5,
        height: 20,
        speed: 5,
        direction: 'up'
    });
}

function inimigoTiro() {
    tiros.push({
        x: inimigo.x + inimigo.width / 2 - 2.5,
        y: inimigo.y + inimigo.height / 100 - 2.5,
        width: 5,
        height: 20,
        speed: 5,
        direction: 'down'
    });
}

nave.img.onload = function () {
    draw();
};

document.addEventListener('keydown', moveNave);
