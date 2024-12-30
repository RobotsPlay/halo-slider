import "./style.css";

const ringEl = document.getElementById("ring");
const canvasEl = <HTMLCanvasElement>document.getElementById("canvas");

if (ringEl && canvasEl) {
  canvasEl.width = ringEl.clientWidth;
  canvasEl.height = ringEl.clientHeight;

  const ctx = canvasEl.getContext("2d");

  ctx?.ellipse(
    ringEl.clientWidth / 2,
    ringEl.clientHeight / 2,
    ringEl.clientWidth / 2,
    ringEl.clientHeight / 2,
    0,
    0,
    Math.PI * 2,
  );

  ctx?.stroke();
  const { x, y } = pointOnEllipse(
    ringEl.clientWidth / 2,
    ringEl.clientHeight / 2,
    ringEl.clientWidth / 2,
    ringEl.clientHeight / 2,
    180 / 57.2958,
  );

  drawCircle(ctx, x, y, 5, "#000000");
}

function pointOnEllipse(centerX, centerY, radiusX, radiusY, angle) {
  const x = centerX + radiusX * Math.cos(angle);
  const y = centerY + radiusY * Math.sin(angle);
  return { x, y };
}

function drawCircle(ctx, x, y, radius = 10, fill = "#000000") {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}
