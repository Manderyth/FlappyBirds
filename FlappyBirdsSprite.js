var
    ponysprite,
    toprainbowsprite,
    bottomrainbowsprite,
    backgroundsprite;

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
        x, y, this.width, this.height);
};

function initSprites(img) {
      ponysprite = [
          new Sprite (img, 3, 1, 100, 44), //x, y, width, height
          new Sprite (img, 103, 1, 100, 44), //x is horizontal, y is vertical
          new Sprite (img, 203, 1, 100, 44),
          new Sprite (img, 303, 1, 100, 44),
      ]
   };

function cloudSprite(cloud, x, y, width, height) {
    this.cloud = cloud;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
        x, y, this.width, this.height);
};

function bgSprite(cloud) {
    backgroundsprite = new cloudSprite(cloud)
};


/* old sprite sheet
function initSprites(img) {
    ponysprite = [
        new Sprite (img, 5, 45, 42, 28), //x, y, width, height
        new Sprite (img, 50, 45, 42, 28), //x is horizontal, y is vertical
        new Sprite (img, 95, 45, 42, 28),
        new Sprite (img, 140, 45, 42, 28),
    ]
};*/