const canvas = document.querySelector('.draw-canvas');
const context = canvas.getContext('2d');
const btnClear = document.querySelector('.btn-clear');
const xVal = document.querySelector('.val-x');
const xVal2 = document.querySelector('.val-x2');
const yVal = document.querySelector('.val-y');
const yVal2 = document.querySelector('.val-y2');
let isDrawing = false;
let x = 0;
let y = 0;
let offsetX;
let offsetY;

function startup() {
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleCancel);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('mousedown', (e) => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    canvas.addEventListener('mouseout', (e) => {
        isDrawing = false;
    });

    btnClear.addEventListener('click', (e) => clearArea());
}
  
document.addEventListener('DOMContentLoaded', startup);
  
const ongoingTouches = [];
  
function handleStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;

    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
}
  
function handleMove(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        const color = 'black';
        const idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            context.beginPath();
            context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
            context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
            context.lineWidth = '1';
            context.strokeStyle = color;
            context.lineJoin = 'round';
            context.closePath();
            context.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        }
    }
}
  
function handleEnd(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    console.log(touches);


    for (let i = 0; i < touches.length; i++) {
        const color = 'black';
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            context.lineWidth = '1';
            context.fillStyle = color;
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
}
  
function handleCancel(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}

function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY };
}
  
function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;

        if (id === idToFind) {
            return i;
        }
    }

    return -1;  // not found
}
  
function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = '1';
    context.lineJoin = 'round';
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();

    updateCanvasInfo(x1, y1, x2, y2);
}

function clearArea() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    clearCanvasInfo();
}

function updateCanvasInfo(x1, y1, x2, y2) {
    xVal.textContent = x1;
    xVal2.textContent = x2;
    yVal.textContent = y1;
    yVal2.textContent = y2;
}

function clearCanvasInfo() {
    xVal.textContent = '';
    xVal2.textContent = '';
    yVal.textContent = ''; 
    yVal2.textContent = ''; 
}