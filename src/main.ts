import "./style.css";
import HaloSlider from "./HaloSlider";

new HaloSlider(".halo-slider");

const ringEl = document.getElementById("ring");
const canvasEl = <HTMLCanvasElement>document.getElementById("canvas");

if (ringEl && canvasEl) {
  canvasEl.width = ringEl.clientWidth;
  canvasEl.height = ringEl.clientHeight;

  const ctx = canvasEl.getContext("2d");

  if (ctx) {
    ctx.ellipse(
      ringEl.clientWidth / 2,
      ringEl.clientHeight / 2,
      ringEl.clientWidth / 2,
      ringEl.clientHeight / 2,
      0,
      0,
      Math.PI * 2,
    );

    ctx.stroke();
  }
}
