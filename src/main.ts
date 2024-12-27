import "./style.css";

class HaloSlider {
  sliderEl: HTMLElement | null = null;
  radius: number = 0;
  slides: HTMLElement[] = [];
  offset: number = 0;
  currentRotation: number = 0;

  constructor(selector: string) {
    this.sliderEl = document.querySelector(selector);

    if (!this.sliderEl) {
      throw new Error("Element not found");
    }

    this.radius = this.sliderEl ? this.sliderEl.clientWidth / 2 : 0;
    this.slides = [...document.querySelectorAll<HTMLElement>(".halo-slide")];

    this.createSlides();
  }

  createSlides() {
    const slideEls = document.querySelectorAll<HTMLElement>(".halo-slide");
    this.offset = this.getOffsetDegrees(slideEls.length);

    slideEls.forEach((slideEl, index) => {
      const [xpos, ypos] = this.getCirclePosition(index);
      slideEl.style.setProperty("--xpos", `${xpos}px`);
      slideEl.style.setProperty("--ypos", `${ypos}px`);
      slideEl.addEventListener("click", (e) => {
        this.onClickSlide(e);
      });
      this.slides.push(slideEl);
    });
  }

  getOffsetDegrees(count: number) {
    return 360 / count;
  }

  getCirclePosition(index: number) {
    const degree = index * this.offset;
    const y = this.radius * Math.cos((Math.PI * 2 * degree) / 360);
    const x = this.radius * Math.sin((Math.PI * 2 * degree) / 360);

    return [x, y];
  }

  getSlideIndex(slideEl: HTMLElement) {
    return this.slides.indexOf(slideEl);
  }

  onClickSlide(e: MouseEvent) {
    const slideEl = e?.target as HTMLElement;
    if (!slideEl) return;

    const index = this.getSlideIndex(slideEl);
    const degree = index * this.offset;

    this.rotateSlider(degree);
  }

  rotateSlider(degree: number) {
    this.currentRotation = degree;

    this.sliderEl?.style.setProperty(
      "--rotation",
      `${this.currentRotation}deg`,
    );
    this.alignSlides();
  }

  alignSlides() {
    this.slides.forEach((slideEl) => {
      slideEl?.style.setProperty(
        "--rotation",
        `${0 - this.currentRotation}deg`,
      );
    });
  }
}

new HaloSlider(".halo-slider");
