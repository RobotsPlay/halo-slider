import "./style.css";

class HaloSlider {
  sliderEl: HTMLElement | null = null;
  radius: number = 0;
  slides: HTMLElement[] = [];
  offset: number = 0;
  currentRotation: number = 0;
  currentSlideIndex: number = 0;

  /**
   * Creates an instance of HaloSlider.
   * @param {string} selector - The CSS selector for the slider element.
   */
  constructor(selector: string) {
    this.sliderEl = document.querySelector(selector);

    if (!this.sliderEl) {
      throw new Error("Element not found");
    }

    this.radius = this.sliderEl ? this.sliderEl.clientWidth / 2 : 0;
    this.slides = [
      ...this.sliderEl.querySelectorAll<HTMLElement>(".halo-slide"),
    ];

    this.createSlides();

    const nextBtn = this.sliderEl.querySelector(".halo-slider-next");
    const prevBtn = this.sliderEl.querySelector(".halo-slider-prev");

    nextBtn?.addEventListener("click", this.onClickNext.bind(this));
    prevBtn?.addEventListener("click", this.onClickPrev.bind(this));
  }

  /**
   * Creates the slides and positions them in a circular layout.
   */
  createSlides() {
    this.offset = this.getOffsetDegrees(this.slides.length);

    this.slides.forEach((slideEl, index) => {
      const [xpos, ypos] = this.getCirclePosition(index);
      slideEl.style.setProperty("--xpos", `${xpos}px`);
      slideEl.style.setProperty("--ypos", `${ypos}px`);
      slideEl.addEventListener("click", this.onClickSlide.bind(this));
    });
  }

  /**
   * Calculates the offset degrees based on the number of slides.
   * @param {number} count - The number of slides.
   * @returns {number} The offset degrees.
   */
  getOffsetDegrees(count: number) {
    return 360 / count;
  }

  /**
   * Calculates the position of a slide in the circular layout.
   * @param {number} index - The index of the slide.
   * @returns {[number, number]} The x and y positions of the slide.
   */
  getCirclePosition(index: number) {
    const degree = index * this.offset;
    const y = this.radius * Math.cos((Math.PI * 2 * degree) / 360);
    const x = this.radius * Math.sin((Math.PI * 2 * degree) / 360);

    return [x, y];
  }

  /**
   * Gets the index of a slide element.
   * @param {HTMLElement} slideEl - The slide element.
   * @returns {number} The index of the slide element.
   */
  getSlideIndex(slideEl: HTMLElement) {
    return this.slides.indexOf(slideEl);
  }

  /**
   * Handles the click event on a slide.
   * @param {Event} e - The click event.
   */
  onClickSlide(e: Event) {
    const slideEl = e?.target as HTMLElement;
    if (!slideEl) return;

    const newIndex = this.getSlideIndex(slideEl);

    this.rotateSlider(newIndex);
  }

  /**
   * Handles the click event on the next button.
   * @param {Event} e - The click event.
   */
  onClickNext(e: Event) {
    e?.preventDefault();
    let index = this.currentSlideIndex + 1;
    index = index >= this.slides.length ? 0 : index;
    this.rotateSlider(index);
  }

  /**
   * Handles the click event on the previous button.
   * @param {Event} e - The click event.
   */
  onClickPrev(e: Event) {
    e?.preventDefault();
    let index = this.currentSlideIndex - 1;
    index = index < 0 ? this.slides.length - 1 : index;
    this.rotateSlider(index);
  }

  /**
   * Rotates the slider to the specified slide index.
   * @param {number} newIndex - The new slide index.
   */
  rotateSlider(newIndex: number) {
    let indexOffset = newIndex - this.currentSlideIndex;
    indexOffset =
      indexOffset < 0 ? indexOffset + this.slides.length : indexOffset;

    this.currentSlideIndex = newIndex;

    let degree = indexOffset * this.offset;
    degree = degree > 180 ? degree - 360 : degree;

    this.currentRotation = this.currentRotation + degree;

    this.sliderEl?.style.setProperty(
      "--rotation",
      `${this.currentRotation}deg`,
    );
    this.alignSlides();
  }

  /**
   * Aligns the slides to match the current rotation.
   */
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
