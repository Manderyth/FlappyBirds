var pony;
var rainbow;
var currentState;
var width;
var height;
var renderingContext;
var frames = 0;

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
    this.y = 200;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [3,2,1,0];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdlePony();
        } else { // Game state
            this.updatePlayingFish();
        }
    };



    this.updateIdlePony = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.draw = function (renderingContext) {
            renderingContext.save();

            renderingContext.translate(this.x, this.y);
            renderingContext.rotate(this.rotation);

            var n = this.animation[this.frame];

            ponysprite[n].draw(renderingContext, -ponysprite[n].width / 2, -ponysprite[n].height / 2);

            renderingContext.restore();
        };
    }



function loadGraphics() {
    var img = new Image();
    img.src = "images/randbowDash_newLegs.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = "Black";
        renderingContext.fillRect(0, 0, width, height);
        //ponysprite[0].draw(renderingContext, 120, 195, 142, 50);

        gameLoop();
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


function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}



function update() {
    frames++;

    /*if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 14;
    }

    if (currentState === states.Game) {
        rainbow.update();
    }*/

    pony.update();

}


function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    //backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    //backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    //corals.draw(renderingContext);
    pony.draw(renderingContext);}

    /*if (currentState === states.Score) {
        okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}*/




function onpress(evt) {
    switch (currentState) {

        case states.Splash: // Start the game.
            currentState = states.Game;
            pony.jump();
            break;

        case states.Game: // The game is in progress.
            pony.jump();
            break;

        case states.Score: //Character crashed
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

