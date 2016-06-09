'use strict';

Circle.map = {};
Circle.count = 0;

Circle.COLORS = [[204, 102, 0], [204, 153, 0], [153, 51, 0]];

function Circle(x, y) {
  var randomColorIdx = Math.floor(Math.random() * Circle.COLORS.length);
  this.color = Circle.COLORS[randomColorIdx];

  this.key = ++Circle.count;

  this.x = x;
  this.y = y;

  this.radius = 5;
  this.maxSize = 175 + Math.random() * 175;
  this.age = 0;
}

Circle.drawAll = function () {
  var key, circle;

  for (key in Circle.map) {
    circle = Circle.map[key];
    circle.getOlder();
    circle.grow();
    circle.draw();
  }
};

Circle.prototype.getOlder = function () {
  this.age += 1;
};


Circle.prototype.grow = function () {
  var isRetractable = ~~(this.age % 30) > 22;

  this.radius += (isRetractable ? -0.75 : 0.75);

  this._maybeExplode();
};

Circle.prototype.draw = function () {
  stroke.apply(null, this.color);
  ellipse(this.x, this.y, this.radius, this.radius);
};

Circle.prototype._maybeExplode = function () {
  var didReachMaxSize = this.radius > this.maxSize;
  var key, circle;

  // Explode when too big.
  if (didReachMaxSize) {
    this._explode();
  }

  // Explode in case of collisions.
  for (key in Circle.map) {
    if (key == this.key) continue;
    
    circle = Circle.map[key]; 
    if (this._isColliding(circle)) this._explode();
  }
};

Circle.prototype._explode = function () {
  delete Circle.map[this.key];
};

Circle.prototype._isColliding = function (other) {
  var distance = Math.sqrt(
    Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
  );
  return distance < (this.radius + other.radius) / 2;
};
