'use strict';

var connection;
var touchData;
var circle;

function setup() {
  noCursor();
  background(0);
  createCanvas(displayWidth, displayHeight);

  connection = new WebSocket("ws://{{$}}/ws");
  connection.onmessage = function (event) {
    touchData = JSON.parse(event.data);

    circle = new Circle(touchData.x, touchData.y);
    Circle.map[circle.key] = circle;
  }
}

function draw() {
  clear();
  background(0);
  noFill();
  Circle.drawAll();
}

function touchEnded() {
    circle = new Circle(touchX, touchY);
    Circle.map[circle.key] = circle;

    if (!connection) return
    touchData = JSON.stringify({x: touchX, y: touchY});
    connection.send(touchData);
}
