import "./style.css";

const sliderEl = document.querySelector(".halo-slider");
const radius = sliderEl ? sliderEl.clientWidth / 2 : 0;
const slides = document.querySelectorAll<HTMLElement>(".halo-slide");

const offset = getOffsetDegrees(slides.length);

slides.forEach((slide, index) => {
  const [xpos, ypos] = getCirclePosition(index);
  slide.style.setProperty("--xpos", `${xpos}px`);
  slide.style.setProperty("--ypos", `${ypos}px`);
});

function getOffsetDegrees(count: number) {
  return 360 / count;
}

function getCirclePosition(index: number) {
  const degree = index * offset;
  const y = radius * Math.cos((Math.PI * 2 * degree) / 360);
  const x = radius * Math.sin((Math.PI * 2 * degree) / 360);

  return [x, y];
}
