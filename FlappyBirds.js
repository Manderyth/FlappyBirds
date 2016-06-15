var pony;
var rainbow;
var currentState;
var width;
var height;
var renderingContext;

var states = {
    Splash: 0,
    Game: 1,
    Score: 2
};

function main() {
    windowSetup(); //sets width and height
    canvasSetup(); //sets up the canvas size
    currentState = states.Splash; 
    document.body.appendChild(canvas);

    pony = new Pony();
    //rainbow = new RainbowCollection();

    loadGraphics();
}

function Pony() {
    this.x = 140;
    this.y =0;
}



function loadGraphics() {
    var img = new Image();
    img.src = "images/randbowDash.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = "Black";
        renderingContext.fillRect(0, 0, width, height);
        //backgroundsprite.draw(renderingContext, 0, height - backgroundsprite.height);
        //backgroundsprite.draw(renderingContext, backgroundsprite.width - backgroundsprite.height);
        ponysprite[0].draw(renderingContext, 5, 5, 142, 50);

        /*okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };*/

        //gameLoop();
    };
}

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    var inputEvent = "touchstart";

    if (width >= 500) {
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }
    document.addEventListener(inputEvent, onpress);
}

function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.style.border = "15px solid #FFC0CB";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function onpress(evt) {
    switch (currentState) {

        case states.Splash: // Start the game and update the sprite speed.
            currentState = states.Game;
            pony.jump();
            break;

        case states.Game: // The game is in progress. Update sprite speed.
            pony.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                //console.log('click');
                rainbow.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }
}