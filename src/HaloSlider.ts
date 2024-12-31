class HaloSlide {
  slideEl: HTMLElement;
  currentAngle: number = 0;
  targetAngle: number = 0;
  xPos: number = 0;
  yPos: number = 0;

  constructor(slideEl: HTMLElement) {
    if (!slideEl) {
      throw new Error("Element not found");
    }

    this.slideEl = slideEl;
  }

  updatePosition(
    xpos: number,
    ypos: number,
    angle: number,
    updateTarget = false,
  ) {
    this.xPos = xpos;
    this.yPos = ypos;
    this.currentAngle = angle;
    this.slideEl.style.setProperty("--xpos", `${xpos}px`);
    this.slideEl.style.setProperty("--ypos", `${ypos}px`);

    if (updateTarget) {
      this.targetAngle = angle;
    }
  }

  updateScale(radius: number) {
    let newScale = 0.55 + (this.yPos / (radius * 2)) * 0.45;
    this.slideEl.style.setProperty("--scale", `${newScale}`);
  }
}

class HaloSlider {
  sliderEl: HTMLElement | null = null;
  ringEl: HTMLElement | null = null;
  radiusX: number = 0;
  radiusY: number = 0;
  slides: HaloSlide[] = [];
  offset: number = 0;
  currentRotation: number = 0;
  currentSlideIndex: number = 0;
  lastTick: number = 0;
  currentAngle: number = 0;

  /**
   * Creates an instance of HaloSlider.
   * @param {string} selector - The CSS selector for the slider element.
   */
  constructor(selector: string) {
    this.sliderEl = document.querySelector(selector);

    if (!this.sliderEl) {
      throw new Error("Element not found");
    }

    this.ringEl = this.sliderEl.querySelector(".halo-slider--ring");

    this.radiusX = this.ringEl ? this.ringEl.clientWidth / 2 : 0;
    this.radiusY = this.ringEl ? this.ringEl.clientHeight / 2 : 0;

    this.createSlides();

    const nextBtn = this.sliderEl.querySelector(".halo-slider--next");
    const prevBtn = this.sliderEl.querySelector(".halo-slider--prev");

    nextBtn?.addEventListener("click", this.onClickNext.bind(this));
    prevBtn?.addEventListener("click", this.onClickPrev.bind(this));
  }

  /**
   * Creates the slides and positions them in a circular layout.
   */
  createSlides() {
    const slides = this.sliderEl?.querySelectorAll(".halo-slider--slide") || [];
    this.offset = this.getOffsetDegrees(slides.length);

    slides.forEach((slideEl, index) => {
      const angle = (0 - index) * this.offset;
      const [xpos, ypos] = this.getCirclePosition(angle);

      const haloSlide = new HaloSlide(slideEl as HTMLElement);
      haloSlide.updatePosition(xpos, ypos, angle, true);
      haloSlide.updateScale(this.radiusY);

      slideEl.addEventListener("click", this.onClickSlide.bind(this));

      this.slides.push(haloSlide);
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

  getPointOnEllipse(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    angle: number,
  ) {
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    return [x, y];
  }

  degreesToRadians(degrees: number) {
    return degrees / 57.2958;
  }

  /**
   * Calculates the position of a slide in the circular layout.
   * @param {number} index - The index of the slide.
   * @returns {[number, number]} The x and y positions of the slide.
   */
  getCirclePosition(degree: number) {
    return this.getPointOnEllipse(
      this.radiusX,
      this.radiusY,
      this.radiusX,
      this.radiusY,
      this.degreesToRadians(degree + 90),
    );
  }

  /**
   * Gets the index of a slide element.
   * @param {HTMLElement} slideEl - The slide element.
   * @returns {number} The index of the slide element.
   */
  getSlideIndex(slideEl: HTMLElement) {
    const slide = this.slides.find((slide) => slide.slideEl === slideEl);

    if (slide) {
      return this.slides.indexOf(slide);
    }

    return -1;
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

    this.startAnimation(degree);
  }

  startAnimation(offset = 0) {
    this.slides.forEach((slide) => {
      slide.targetAngle = slide.currentAngle + offset;
    });
    window.requestAnimationFrame(this.doAnimation.bind(this));
  }

  doAnimation(timestamp: number) {
    if (this.lastTick === 0) {
      this.lastTick = timestamp;
    }
    const elapsed = timestamp - this.lastTick;
    let stillAnimating = false;

    this.slides.forEach((slide) => {
      let angle = Math.min(
        slide.currentAngle + 0.15 * elapsed,
        slide.targetAngle,
      );

      if (slide.targetAngle < slide.currentAngle) {
        angle = Math.max(
          slide.currentAngle - 0.15 * elapsed,
          slide.targetAngle,
        );
      }

      const [xpos, ypos] = this.getPointOnEllipse(
        this.radiusX,
        this.radiusY,
        this.radiusX,
        this.radiusY,
        this.degreesToRadians(angle + 90),
      );
      slide.updatePosition(xpos, ypos, angle);
      slide.updateScale(this.radiusY);

      if (slide.currentAngle !== slide.targetAngle) {
        stillAnimating = true;
      }
    });

    this.lastTick = timestamp;

    if (stillAnimating) {
      requestAnimationFrame(this.doAnimation.bind(this));
    } else {
      this.lastTick = 0;
    }
  }
}

export default HaloSlider;
