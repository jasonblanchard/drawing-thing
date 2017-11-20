import Rx from 'rxjs';

import imagePath from './rhino.png';

export default {
  init() {
    this.img = new Image();
    this.canvas = document.querySelector('.canvas');
    this.ctx = this.canvas.getContext('2d');
    this.color = document.querySelector('.color');

    this.img.src = imagePath;
    this.img.onload = () => {
      this.ctx.drawImage(this.img, 0, 0);
      this.img.style.display = 'none';
    }
  },

  renderColor(x, y) {
    var pixel = this.ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ', ' + data[1] +
    ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    this.color.style.background =  rgba;
    this.color.textContent = rgba;
  },

  run() {
    const mouseDown = Rx.Observable.fromEvent(this.canvas, 'mousedown');
    const mouseUp = Rx.Observable.fromEvent(this.canvas, 'mouseup');
    const isClicked = Rx.Observable.merge(mouseDown, mouseUp)
      .map(event => event.type === 'mousedown')
      .startWith(false);
    const mouseMove = Rx.Observable.fromEvent(this.canvas, 'mousemove');

    const selectionState = Rx.Observable.combineLatest(mouseMove, isClicked, (event, isClicked) => ({ event, isClicked }))
      .filter(({ event, isClicked }) => isClicked)
      .map(({ event }) => ({ mouseX: event.layerX, mouseY: event.layerY }))
      .map(({ mouseX, mouseY }) => state => ({ ...state, ...{ mouseX, mouseY } }));

    const state = Rx.Observable.merge(
      selectionState
    ).scan((state, changeFn) => changeFn(state), {
      mouseX: 0,
      mouseY: 0
    });

    state.subscribe(state => {
      this.renderColor(state.mouseX, state.mouseY);
    });
  }
}
