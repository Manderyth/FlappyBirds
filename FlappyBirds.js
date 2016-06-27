var pony;
var rainbow;
var currentState;
var width;
var height;
var renderingContext;
var okButton;
var frames = 0;
var score = 0;
var highscore = 0;

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
    $(document.body).append("<button id='resetbutton'>Click to Reset</button>");
    pony = new Pony();
    rainbow = new RainbowCollection();

    loadGraphics();
}

function RainbowCollection() {
    this._rainbow = [];

    this.reset = function () {
        this._rainbow = [];
    };


    this.add = function () {
        this._rainbow.push(new Rainbow());
    };


    this.update = function () {
        if (frames % 100 === 0) {
            this.add();
        }

        for (var i = 0, len = this._rainbow.length; i < len; i++) {
            var rainbow = this._rainbow[i];

            if (i === 0) {
                rainbow.detectCollision();
            }

            rainbow.x -= 2;
            if (rainbow.x < -rainbow.width) {
                this._rainbow.splice(i, 1);
                i--;
                len--;
            }
        }
    };


    this.draw = function () {
        for (var i = 0, len = this._rainbow.length; i < len; i++) {
            var rainbow = this._rainbow[i];
            rainbow.draw();
        }
    };
}


function Rainbow() {
    this.x = 500;
    this.y = height - (rainbowsprite.height + 120 + 200 * Math.random());
    this.width = rainbowsprite.width;
    this.height = rainbowsprite.height;


    this.detectCollision = function () {

        var cx = Math.min(Math.max(pony.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(pony.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(pony.y, this.y + this.height + 110), this.y + 2 * this.height + 80);

        var dx = pony.x - cx;
        var dy1 = pony.y - cy1;
        var dy2 = pony.y - cy2;

        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = pony.radius * pony.radius;

        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        rainbowsprite.draw(renderingContext, this.x, this.y);
        rainbowsprite.draw(renderingContext, this.x, this.y + 110 + this.height);
    }
}


function Pony() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [3, 2, 1, 0];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.jump = function () {
        this.velocity = -this._jump;
    };

    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdlePony();
        } else {
            this.updatePlayingPony();
        }
    };


    this.updateIdlePony = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };


    this.updatePlayingPony = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;


        // Change to the score state when fish touches the ground
        if (this.y >= height + 50) {
            this.y = height + 50;


            if (currentState === states.Game) {
                currentState = states.Score;
            }


            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }


        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.Score;
        }

        // When fish lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
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
    img.src = "images/raindbowDashSprite.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = "White";

        /*okButton = {
         x: (width - okButtonSprite.width) / 2,
         y: height - 200,
         width: okButtonSprite.width,
         height: okButtonSprite.height
         };*/

        gameLoop();
    };

}

function windowSetup() {
    width = window.innerWidth;
    height = window.innerHeight;
    var inputEvent = "touchstart";

    if (width >= 500) {
        width = 480;
        height = 530;
        inputEvent = "mousedown";
    }
    document.addEventListener(inputEvent, onpress);
}

function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "15px solid #FFC0CB";
    canvas.id = "canvaswindow";
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

    if (currentState === states.Score) {
     highscorecalc();
     }

    if (currentState === states.Game) {
        rainbow.update();
    }

    pony.update();
    scorecalculation();

}


function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);
    //backgroundsprite.draw(renderingContext);

    // Draw background sprites
    //backgroundsprite.draw(renderingContext, 0, height - backgroundSprite.height);
    //backgroundsprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    rainbow.draw(renderingContext);
    pony.draw(renderingContext);
}

/*if (currentState === states.Score) {
 okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
 }*/

// Draw foreground sprites
//foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
//foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);


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
        {

            //Check if within the okButton
            /*if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
             okButton.y < mouseY && mouseY < okButton.y + okButton.height
             ) {*/
            rainbow.reset();
            currentState = states.Splash;
            score = 0;
        }
            break;

    }

}


function scorecalculation() {
        for (i = 0; i < rainbow._rainbow.length; i++) {
        if (rainbow._rainbow[i].x === pony.x) {
            score++;
        }
    }
    document.getElementById('myscore').innerHTML = score;

}

function highscorecalc() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        document.getElementById('myhighscore').innerHTML = highscore;
        score = 0
    }
    else {
        score = 0
    }

    /*highscore = localStorage.getItem("highscore");
    if(highscore !== null){
        if (score > highscore) {
            localStorage.setItem("highscore", score );
        }
    }else{
        localStorage.setItem("highscore", score );
    }*/
}