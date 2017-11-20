import Rx from 'rxjs';

import test from './test.js';

import './index.css';
import imagePath from './rhino.png';

var img = new Image();
var canvas = document.querySelector('.canvas');
var ctx = canvas.getContext('2d');
var color = document.querySelector('.color');

img.src = imagePath;
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};

function renderColor(x, y) {
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  color.style.background =  rgba;
  color.textContent = rgba;
}

const mouseDown = Rx.Observable.fromEvent(canvas, 'mousedown');
const mouseUp = Rx.Observable.fromEvent(canvas, 'mouseup');
const isClicked = Rx.Observable.merge(mouseDown, mouseUp)
  .map(event => event.type === 'mousedown')
  .startWith(false);
const mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');

Rx.Observable.combineLatest(mouseMove, isClicked, (event, isClicked) => ({ event, isClicked }))
  .filter(({ event, isClicked }) => isClicked)
  .map(({ event }) => ({ mouseX: event.layerX, mouseY: event.layerY }))
  .subscribe(({ mouseX, mouseY }) => {
    renderColor(mouseX, mouseY)
  })
