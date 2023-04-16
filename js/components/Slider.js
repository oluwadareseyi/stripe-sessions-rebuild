import Component from "../classes/Component";
import AutoBind from "../utils/bind";
import { getIndex } from "../utils/dom";

export default class extends Component {
  constructor() {
    super({
      element: "[data-slider]",
      elements: {
        slides: "[data-slide]",
        slideParent: "[data-slides]",
        prevButton: "[data-prev-button]",
        nextButton: "[data-next-button]",
      },
    });

    AutoBind(this);

    this.classes = {
      active: "c-slide--active",
      end: "c-slide--end",
      prepend: "c-slides--prepend",
      append: "c-slides--append",
    };

    this.elements.slides.forEach((slide, index) => {
      slide.innerHTML = `<h1 class="c-slide__inner">Slide ${index}</h1>`;
    });

    this.addEventListeners();
    this.autoPlay();
  }

  get slides() {
    return document.querySelectorAll("[data-slide]");
  }

  resetSlidesClasses() {
    const slides = this.slides;

    slides.forEach((slide) => {
      slide.classList.remove(this.classes.active);
    });
  }

  prependSlide() {
    // move last slide to the front
    const slides = this.slides;

    const lastSlide = slides[slides.length - 1];
    const firstSlide = slides[0];

    this.elements.slideParent.insertBefore(lastSlide, firstSlide);
    this.elements.slideParent.classList.add(this.classes.prepend);
    // add active class to the new first slide

    const delay = setTimeout(() => {
      this.elements.slideParent.classList.remove(this.classes.prepend);

      clearTimeout(delay);
    }, 600);
  }

  appendSlide() {
    // move first slide to the back
    const slides = this.slides;

    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];

    this.elements.slideParent.insertBefore(firstSlide, lastSlide.nextSibling);
    this.elements.slideParent.classList.add(this.classes.append);

    const delay = setTimeout(() => {
      this.elements.slideParent.classList.remove(this.classes.append);

      clearTimeout(delay);
    }, 600);
  }

  handleSlideChange(el) {
    const slide = el.closest("[data-slide]");

    const index = getIndex(slide);
    this.currentSlide = index;

    if (index === 2) {
      this.prependSlide();
    } else if (index === 7) {
      this.appendSlide();
    }

    this.resetSlidesClasses();
    slide.classList.add(this.classes.active);

    this.cancelAutoPlay();
    this.autoPlay();
  }

  playPreviousSlide() {
    // check for active slide
    const activeSlide = document.querySelector(`.${this.classes.active}`);

    // get previous slide
    const prevSlide = activeSlide.previousElementSibling;

    this.handleSlideChange(prevSlide);
  }

  playNextSlide() {
    // check for active slide
    const activeSlide = document.querySelector(`.${this.classes.active}`);

    // get next slide
    const nextSlide = activeSlide.nextElementSibling;

    this.handleSlideChange(nextSlide);
  }

  addEventListeners() {
    const slides = this.slides;
    const { prevButton, nextButton, slideParent } = this.elements;

    slides.forEach((slide) => {
      slide.addEventListener("click", (el) => {
        this.handleSlideChange(el.target);
      });
    });

    prevButton.addEventListener("click", () => {
      this.playPreviousSlide();
    });

    nextButton.addEventListener("click", () => {
      this.playNextSlide();
    });

    slideParent.addEventListener("mouseenter", this.cancelAutoPlay);
    slideParent.addEventListener("mouseleave", this.autoPlay);
  }

  autoPlay() {
    this.interval = setInterval(() => {
      this.playNextSlide();
    }, 5000);
  }

  cancelAutoPlay() {
    clearInterval(this.interval);
  }
}
