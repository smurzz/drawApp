// Created: Sofya Murzakova
// Run: with a live local server

// array for keeping track of lines (row of shapes)
var lines = [];
var currentLine = [];
var point;
var modus;
// canvas options 
var widthContainer;
var heightContainer;
var myCanvas;
var myGraphics;
// sidebar options
var brushForm;
var brushRound;
var sliderRound;
var brushSquare;
var sliderSquare;
var brushText;
var inputText;
var textValue;
var sliderText;
var brushColor;
var colorValue;
var brushSize;
var eraser;
// navigation options (toolbar)
var zoomIn;
var zoomOut;
var undoButton;
var redoButton;
var clearButton;
var saveButton;
// other variables (in development)
var linesAfterUndo = [];
var deletedLines = [];
var buttonSound;

function setup() {
    // canvas size is the size of parent container
    widthContainer = document.getElementById('canvas').offsetWidth;
    heightContainer = document.getElementById('canvas').offsetHeight;
    myCanvas = createCanvas(widthContainer, heightContainer);
    myCanvas.parent('canvas');
    myCanvas.id("myCanvas");
    myGraphics = createGraphics(widthContainer, heightContainer);
    myGraphics.parent('canvas');
    myGraphics.background(255);
    // slider text-size
    var contSlider = document.getElementById("contForSlider");
    sliderText = createSlider(6, 56, 14, 2);
    sliderText.parent(contSlider);
    sliderText.addClass("slider");
    sliderText.id("sliderText");
    sliderText.style('display', 'none');

    defineButtonsAndEvents();
}

function draw() {
    // default values
    defineDefaultValues();
    // output shape
    lines.forEach(function (line) {
        beginShape();
        line.forEach(function (lpoint) {
            myGraphics.fill(lpoint.color);
            myGraphics.noStroke();
            if (lpoint.form === 'round') {
                myGraphics.ellipse(lpoint.x, lpoint.y, lpoint.size);
            }
            if (lpoint.form === 'square') {
                myGraphics.rect(lpoint.x, lpoint.y, lpoint.size);
            }
            if (lpoint.form === 'textInput') {
                myGraphics.textSize(lpoint.size);
                myGraphics.text(lpoint.text, lpoint.x, lpoint.y);
            }
        });
        endShape();
    });
    if (myGraphics) {
        image(myGraphics, widthContainer, heightContainer);
        image(myGraphics, 0, 0, widthContainer, heightContainer);
    }
}

// define default
function defineDefaultValues(){
    // default values
    if (colorValue !== '#ffffff') { colorValue = brushColor.value; }
    if (brushForm === undefined) { brushForm = 'round'; }
    if (brushForm === 'round') {
        brushSize = sliderRound.value;
    } else if (brushForm === 'square') {
        brushSize = sliderSquare.value;
    } else { brushSize = sliderText.value() }
    if (modus === undefined) { modus = 'mouseInput' }
    // input moduses
    if (modus === 'mouseInput' && mouseIsPressed) { pointIsByMouse(colorValue, brushSize, brushForm); }
    if (modus === 'keyboardInput' && keyIsPressed) { pointIsByKey(colorValue, brushSize, brushForm); }
    if (brushForm === 'textInput' && mouseIsPressed) { textIsByMouse(colorValue, brushSize, brushForm); }
}

// difine all button and events
function defineButtonsAndEvents(){
    // definitions of buttons and inputs
    brushColor = document.getElementById('colorP');
    brushRound = document.getElementById('round');
    brushSquare = document.getElementById('square');
    brushText = document.getElementById('textInput');
    clearButton = document.getElementById('clearButton');
    undoButton = document.getElementById('undoButton');
    redoButton = document.getElementById('redoButton');
    sliderRound = document.getElementById("sliderRound");
    sliderSquare = document.getElementById("sliderSquare");
    eraser = document.getElementById('eraser');
    zoomIn = document.getElementById('zoomIn');
    zoomOut = document.getElementById('zoomOut');
    saveButton = document.getElementById('saveButton');
    // events and actions
    brushRoundClicked();
    brushSquareClicked();
    brushTextClicked();
    brushColorClicked();
    clearAllClicked();
    undoButtonClicked();
    redoButtonClicked();
    eraserClicked();
    zoomInClicked();
    zoomOutClicked();
    savePaintClicked();
}

// sound by button-clicking
function preload() {
    buttonSound = loadSound('sound/pressButton.mp3');
}

// point builder with MOUSE
function pointIsByMouse(colorValue, brushSize, brushForm) {
    var xKey = mouseX;
    var yKey = mouseY;

    point = {
        x: xKey,
        y: yKey,
        color: colorValue,
        size: brushSize,
        form: brushForm
    }
    currentLine.push(point);
}

// point builder with KEYBOARD
function pointIsByKey(colorValue, brushSize, brushForm) {
    var xKey; var yKey;
    if (lines.length <= 1) {
        xKey = myCanvas.width / 2;
        yKey = myCanvas.height / 2;
    } else {
        var lastLine = lines.at(lines.length - 1);
        xKey = lastLine.at(lastLine.length - 1).x;
        yKey = lastLine.at(lastLine.length - 1).y;
    }
    xKey = constrain(xKey, 0, widthContainer);
    yKey = constrain(yKey, 0, heightContainer);

    if (keyCode == UP_ARROW) {
        yKey -= 5;
    } else if (keyCode === DOWN_ARROW) {
        yKey += 5;
    } else if (keyCode === LEFT_ARROW) {
        xKey -= 5;
    } else if (keyCode === RIGHT_ARROW) {
        xKey += 5;
    }
    point = {
        x: xKey,
        y: yKey,
        color: colorValue,
        size: brushSize,
        form: brushForm
    }
    currentLine.push(point);
}

// text builder with MOUSE
function textIsByMouse(colorValue, brushSize, brushForm) {
    textValue = inputText.value();
    var xKey = mouseX;
    var yKey = mouseY;

    if (((xKey >= 0 && xKey <= widthContainer) && (yKey >= 0 && yKey <= heightContainer))) {
        point = {
            x: xKey,
            y: yKey,
            color: colorValue,
            size: brushSize,
            form: brushForm,
            text: textValue
        }
        currentLine.push(point);
    }
}

// assign ROUND-form of brush by clicking of ROUND-botton 
function brushRoundClicked() {
    brushRound.addEventListener('click', function () {
        buttonSound.play();
        brushForm = brushRound.getAttribute('id');
        if (sliderRound.style.display === 'block') {
            sliderRound.style.display = 'none';
        } else {
            sliderRound.style.display = 'block';
        }
    }, false);
}

// assign SQUARE-form of brush clicking of SQUARE-botton 
function brushSquareClicked() {
    brushSquare.addEventListener('click', function () {
        buttonSound.play();
        brushForm = brushSquare.getAttribute('id');
        if (sliderSquare.style.display === 'block') {
            sliderSquare.style.display = 'none';
        } else {
            sliderSquare.style.display = 'block';
        }
    }, false);
}

// assign TEXT-form of brush clicking of TEXTINPUT-botton 
function brushTextClicked() {
    brushText.addEventListener('click', function () {
        buttonSound.play();
        brushForm = brushText.getAttribute('id');

        if (sliderText.style('display') === 'block') {
            sliderText.style('display', 'none');
            inputText.remove();
        } else {
            sliderText.style('display', 'block');
            inputText = createInput("Enter text..");
            inputText.position(40, 50);
        }
    }, false);
}

// assign color-value by clicking on COLOR-button
function brushColorClicked() {
    brushColor.addEventListener('click', function () {
        buttonSound.play();
        colorValue = brushColor.value;
    }, false);
}

// delete all graphics from canvas
function clearAllClicked() {
    clearButton.addEventListener('click', function () {
        buttonSound.play();
        clearGraphics();
        myGraphics = createGraphics(widthContainer, heightContainer);
        myGraphics.parent('canvas');
        myGraphics.background(255);
    }, false);
}

// clear graphics
function clearGraphics(){
    clear();
    if(myGraphics){
        myGraphics.remove();
        myGraphics = null;
    }
    currentLine = [];
    lines = [];
}

// resize canvas by depending on device-screen
function windowResized() {
    widthContainer = document.getElementById("canvas").offsetWidth;
    heightContainer = document.getElementById("canvas").offsetHeight;
    resizeCanvas(widthContainer, heightContainer);
}

// change brash to ERASER (white-color)
function eraserClicked() {
    eraser.addEventListener('click', function () {
        buttonSound.play();
        colorValue = '#ffffff';
    }, false);
}

// add array of points (line) to lines-array by MOUSE-CLICK 
function mousePressed() {
    if (currentLine.length !== 0 && modus == "mouseInput") {
        currentLine = [];
        lines.push(currentLine);
    }
}

// add array of points (line) to lines-array by KEYPRESS
// assign other key-commands
function keyPressed(e) {
    if (keyCode === DELETE) {
        clearGraphics();
        myGraphics = createGraphics(widthContainer, heightContainer);
        myGraphics.parent('canvas');
    } else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        previousDelete();
    } else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
        previousAdd();
    } else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        save(myGraphics, 'myDrawing.jpg');
    } else if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        if (modus === 'mouseInput') {
            window.alert('Keyboard input is activated.');
            modus = 'keyboardInput';
        } else {
            window.alert('Mouse input is activated.');
            modus = 'mouseInput';
        }
    } else if (currentLine.length !== 0 && (brushForm === 'textInput' || modus == "keyboardInput")) {
        lines.push(currentLine);
    } 
}

// save graphics in png-format
function savePaintClicked() {
    saveButton.addEventListener('click', function () {
        buttonSound.play();
        save(myGraphics, 'myDrawing.jpg');
    }, false);
}

// undo by button-clicking
function undoButtonClicked() {
    undoButton.addEventListener('click', function () {
        buttonSound.play();
        previousDelete();
    }, false);
}

// redo by button-clicking
function redoButtonClicked() {
    redoButton.addEventListener('click', function () {
        buttonSound.play();
        previousAdd();
    }, false);
}

// delete last line
function previousDelete(){
    if (lines.length === 0) { return null; }
    if (linesAfterUndo.length === 0){
        deletedLines.push(lines.pop());
        linesAfterUndo = [...lines];
        clearGraphics();
    } else {
        deletedLines.push(linesAfterUndo.pop());
        clearGraphics();
    }
    lines = linesAfterUndo;

    myGraphics = createGraphics(widthContainer, heightContainer);
    myGraphics.parent('canvas');
    myGraphics.background(255);
    redraw();
}

// return last line
function previousAdd(){
    if (deletedLines.length === 0) { return null; }
    lines.push(deletedLines.pop());
    redraw();
}

// zoom canvas by MOUSE-WHEELING
window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        zoomInAction();
    }
    else {
        zoomOutAction();
    }
});

// zoom-in canvas by button-clicking
function zoomInClicked() {
    zoomIn.addEventListener('click', function () {
        buttonSound.play();
        zoomInAction();
    }, false);
}

// zoom-out canvas by button-clicking
function zoomOutClicked() {
    zoomOut.addEventListener('click', function () {
        buttonSound.play();
        zoomOutAction();
    }, false);
}

// zoom-out action
function zoomOutAction() {
    widthContainer *= 0.95;
    heightContainer *= 0.95;
    document.getElementById('canvas').style.width = `${widthContainer *= 0.95}px`;
    document.getElementById('canvas').style.height = `${heightContainer *= 0.95}px`;
    resizeCanvas(widthContainer, heightContainer);
    resizeGraphics(widthContainer, heightContainer);
}

// zoom-in action
function zoomInAction() {
    widthContainer *= 1.05;
    heightContainer *= 1.05;
    document.getElementById('canvas').style.width = `${widthContainer *= 1.05}px`;
    document.getElementById('canvas').style.height = `${heightContainer *= 1.05}px`;
    resizeCanvas(widthContainer, heightContainer);
    resizeGraphics(widthContainer, heightContainer);
}

// resize GRATHICS
function resizeGraphics(newWidth, newHeight) {
    var newPG = createGraphics(newWidth, newHeight);
    newPG.image(myGraphics, 0, 0, newPG.width, newPG.height);
    clearGraphics();
    myGraphics = newPG;
    newPG.remove();
}