/* eslint-disable no-unused-vars */

window.onload = function main() {
    const colorBlue = document.querySelector('#blue');
    const colorRed = document.querySelector('#red');
    const colorWhite = document.querySelector('#white');
    const mainFrame = document.querySelector('#mainFrame');
    const framesBody = document.querySelector('#frames');
    const addBtn = document.querySelector('#addBtn');
    const deleteBtn = document.querySelector('#deleteBtn');
    const copyBtn = document.querySelector('#copyBtn');
    const figure = document.querySelectorAll('.figure');
    const playBtn = document.querySelector('#playBtn');
    const stopBtn = document.querySelector('#stopBtn');
    const fullBtn = document.querySelector('#fullScreen');
    const rngValue = document.querySelector('#rangeValue');
    const colors = [colorBlue, colorRed, colorWhite];

    let previewBlock = document.querySelector('#previewBlock');
    let activeFrame = document.querySelector('.activeFrame');

    let frames = document.querySelectorAll('.frame');
    let rng = document.querySelector('#range');

    rng.value = parseInt(rng.value, 10);
    rng.value = 2;

    let fpsValue = null;
    let activeFigure = null;
    let number = 1;
    let counter = 0;
    let frameRate = rng.value;
    let prevFrame = null;
    let frame = null;

    function drawFigures(elem, index) {
        const ctx = elem.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'white';

        if (index === 0) {
            ctx.moveTo(0, 0);
            ctx.lineTo(50, 0);
            ctx.lineTo(50, 50);
            ctx.lineTo(0, 50);
        }
        if (index === 1) {
            ctx.moveTo(0, 0);
            ctx.lineTo(75, 0);
            ctx.lineTo(75, 75);
            ctx.lineTo(0, 75);
        }
        if (index === 2) {
            ctx.arc(25, 25, 25, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        if (index === 3) {
            ctx.moveTo(30, 0);
            ctx.lineTo(60, 50);
            ctx.lineTo(0, 50);
        }
        if (index === 4) {
            ctx.moveTo(30, 0);
            ctx.lineTo(60, 15);
            ctx.lineTo(60, 45);
            ctx.lineTo(30, 60);
            ctx.lineTo(0, 45);
            ctx.lineTo(0, 15);
        }
        ctx.fill();
    }

    function pickColor() {
        figure.forEach(elem => {
            const ctx = elem.getContext('2d');
            ctx.fillStyle = this.style.backgroundColor;
            ctx.fill();
        });
    }

    (function setupColors() {
        colorBlue.style.backgroundColor = window.getComputedStyle(
            colorBlue
        ).backgroundColor;
        colorRed.style.backgroundColor = window.getComputedStyle(
            colorRed
        ).backgroundColor;
        colorWhite.style.backgroundColor = window.getComputedStyle(
            colorWhite
        ).backgroundColor;
    })();

    function setFrame(copy) {
        frames = document.querySelectorAll('.frame');

        frames.forEach(elem => {
            if (elem.classList.contains('activeFrame')) {
                activeFrame = elem;
            }
        });

        if (copy === 1) {
            if (activeFigure[0] === undefined) return 0;
            frame = activeFigure[0].cloneNode(true);

            if (activeFrame.contains(frame)) return 0;

            const ctx = frame.getContext('2d');
            ctx.drawImage(activeFigure[0], 0, 0);

            activeFrame.appendChild(frame);
            return 0;
        }

        frame = this.cloneNode(true);
        activeFigure = activeFrame.getElementsByTagName('*');

        const ctx = frame.getContext('2d');
        ctx.drawImage(this, 0, 0);

        if (activeFrame.contains(frame)) {
            return 0;
        }

        if (activeFrame.contains(activeFigure[0])) {
            activeFrame.removeChild(activeFigure[0]);
        }

        activeFrame.appendChild(frame);

        return frame;
    }

    function drawValue() {
        rngValue.innerHTML = rng.value;
        frameRate = rng.value;
        return frameRate;
    }

    function makeActive() {
        frames = document.querySelectorAll('.frame');

        frames.forEach(elem => {
            if (elem.classList.contains('activeFrame')) {
                elem.classList.remove('activeFrame');
            }
        });

        this.classList.add('activeFrame');

        activeFrame = this;

        prevFrame = this;
    }

    function addFrame() {
        if (number === 24) return 0;

        const div = document.createElement('div');
        frames = document.querySelectorAll('.frame');
        frames.forEach(elem => {
            if (elem.classList.contains('activeFrame')) {
                elem.classList.remove('activeFrame');
            }
        });

        div.classList.add('frame', 'activeFrame');
        div.id = `frame-${number + 1}`;
        framesBody.appendChild(div);

        frames = document.querySelectorAll('.frame');
        frames[number - 1].classList.remove('activeFrame');
        prevFrame = frames[number];

        frames[number].addEventListener('click', makeActive);

        number += 1;

        return 1;
    }

    function removeFrame() {
        if (number === 1) return 0;
        frames = document.querySelectorAll('.frame');

        for (let i = 0; i < frames.length; i += 1) {
            if (frames[i].classList.contains('activeFrame')) {
                if (i !== 0) {
                    frames[i - 1].classList.add('activeFrame');
                    activeFrame = frames[i - 1];
                } else {
                    frames[i + 1].classList.add('activeFrame');
                    activeFrame = frames[i + 1];
                }

                framesBody.removeChild(frames[i]);
                number -= 1;
                counter -= 1;
                break;
            }
        }

        return 1;
    }

    function copyFrame() {
        frames = document.querySelectorAll('.frame');

        frames.forEach(elem => {
            if (elem.classList.contains('activeFrame')) {
                activeFigure = activeFrame.getElementsByTagName('*');
                activeFrame = elem;
            }
        });

        addFrame();

        setFrame(1);
    }

    function startAnimation(flag) {
        rng = document.querySelector('#range');
        frames = document.querySelectorAll('.frame');
        previewBlock = document.querySelector('#previewBlock');
        rng.value = parseInt(rng.value, 10);

        fpsValue = 1000 / rng.value;

        stopBtn.addEventListener('click', () => {
            rng.value = 0;
            drawValue();
        });

        function animateFrame(currFrame) {
            activeFigure = currFrame.getElementsByTagName('*');

            if (activeFigure[0] === undefined) return 0;
            frame = activeFigure[0].cloneNode(true);

            const ctx = frame.getContext('2d');
            ctx.drawImage(activeFigure[0], 0, 0);

            if (previewBlock.getElementsByTagName('canvas')[0]) {
                previewBlock.removeChild(previewBlock.getElementsByTagName('canvas')[0]);
            }

            previewBlock.appendChild(frame);

            return 1;
        }

        if (counter < frames.length) {
            if (rng.value != 0) {
                animateFrame(frames[counter]);
                counter += 1;
            }
        } else counter = 0;

        setTimeout(startAnimation, fpsValue);
        return 1;
    }

    function fullScreen() {
        if (previewBlock.fullscreenElement) {
            previewBlock.exitFullscreen();
        } else {
            previewBlock.requestFullscreen();
        }
    }

    frames[0].addEventListener('click', makeActive);

    rng.addEventListener('input', drawValue);

    figure.forEach((elem, index) => {
        drawFigures(elem, index);
        elem.addEventListener('click', setFrame);
    });

    addBtn.addEventListener('click', addFrame);

    deleteBtn.addEventListener('click', removeFrame);

    copyBtn.addEventListener('click', copyFrame);

    colors.forEach(elem => elem.addEventListener('click', pickColor));

    playBtn.addEventListener('click', startAnimation);

    fullBtn.addEventListener('click', fullScreen);

    startAnimation(1);
};
