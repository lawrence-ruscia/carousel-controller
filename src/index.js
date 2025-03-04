import './style.css';

export default class CarouselController {
  #currentSlideClassName;

  #currentIndicatorClassName;

  constructor({
    carousel,
    prevButton,
    trackContainer,
    track,
    slides,
    nextButton,
    nav,
    currentSlideClassName,
    currentIndicatorClassName,
  }) {
    this.carousel = carousel;
    this.prevButton = prevButton;
    this.trackContainer = trackContainer;
    this.track = track;
    this.slides = Array.from(slides);
    this.nextButton = nextButton;
    this.nav = nav;
    this.indicators = this.#createIndicators();
    this.#currentSlideClassName = currentSlideClassName;
    this.#currentIndicatorClassName = currentIndicatorClassName;

    this.#init();
  }

  #init() {
    this.#arrangeSlides();
    this.#setUpEventListeners();
    this.#displaySlides();
  }

  #setUpEventListeners() {
    // Handle next button cick
    this.nextButton.addEventListener('click', () => {
      this.#moveToNextSlide();
    });

    // Handle previous button click
    this.prevButton.addEventListener('click', () => {
      const currentSlide = document.querySelector(
        `.${this.#currentSlideClassName}`
      );

      const prevSlide = currentSlide.previousElementSibling;
      const currentIndicator = this.nav.querySelector(
        '.carousel__indicator--current'
      );
      const prevIndicator = currentIndicator.previousElementSibling;
      const targetIndex = this.slides.findIndex((slide) => slide === prevSlide);

      this.#moveSlide(currentSlide, prevSlide);
      this.#updateIndicator(currentIndicator, prevIndicator);
      this.#toggleSlideButton(targetIndex);
    });

    // Handle Nav indicators
    this.nav.addEventListener('click', (e) => {
      const targetIndicator = e.target.closest('button');

      if (!targetIndicator) return;

      const currentSlide = this.track.querySelector(
        `.${this.#currentSlideClassName}`
      );
      const currentIndicator = this.nav.querySelector(
        '.carousel__indicator--current'
      );
      const targetIndex = this.indicators.findIndex(
        (indicator) => indicator === targetIndicator
      );
      const targetSlide = this.slides[targetIndex];

      this.#moveSlide(currentSlide, targetSlide);
      this.#updateIndicator(currentIndicator, targetIndicator);
      this.#toggleSlideButton(targetIndex);
    });
  }

  #moveToNextSlide() {
    const currentSlide = document.querySelector(
      `.${this.#currentSlideClassName}`
    );

    const nextSlide = currentSlide.nextElementSibling;

    const currentIndicator = this.nav.querySelector(
      '.carousel__indicator--current'
    );
    const nextIndicator = currentIndicator.nextElementSibling;
    const targetIndex = this.slides.findIndex((slide) => slide === nextSlide);

    this.#moveSlide(currentSlide, nextSlide);
    this.#updateIndicator(currentIndicator, nextIndicator);
    this.#toggleSlideButton(targetIndex);
  }

  #resetSlide() {
    const currentSlide = document.querySelector(
      `.${this.#currentSlideClassName}`
    );
    const firstSlide = this.track.firstElementChild;

    const currentIndicator = this.nav.querySelector(
      '.carousel__indicator--current'
    );

    const nextIndicator = this.nav.firstElementChild;

    this.#moveSlide(currentSlide, firstSlide);
    this.#updateIndicator(currentIndicator, nextIndicator);
    this.#toggleSlideButton(0); // resetting the slide always results in the first slide
  }

  #displaySlides() {
    const SLIDE_INTERVAL = 5000;

    setInterval(() => {
      const currentSlide = document.querySelector(
        `.${this.#currentSlideClassName}`
      );
      const targetIndex = this.slides.findIndex(
        (slide) => slide === currentSlide
      );

      if (targetIndex === this.slides.length - 1) {
        this.#resetSlide();
        return;
      }

      this.#moveToNextSlide();
    }, SLIDE_INTERVAL);
  }

  #createIndicators() {
    const indicators = [];

    this.slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.classList.add('carousel__indicator');

      if (index === 0) button.classList.add('carousel__indicator--current');

      // Append to Nav
      this.nav.appendChild(button);

      indicators.push(button);
    });

    return indicators;
  }

  #arrangeSlides() {
    this.slides.forEach(this.#setSlidePosition);
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  #setSlidePosition(slide, index) {
    // Get current width relative to the viewport
    const slideWidth = slide.getBoundingClientRect().width;

    // This wil position the slides next to each other
    slide.style.left = `${slideWidth * index}px`;
  }

  #moveSlide(currentSlide, targetSlide) {
    const currentSlideClassName = this.#currentSlideClassName;
    // This will make it appear as if the track slides are being moved
    this.track.style.transform = `translateX(-${targetSlide.style.left})`;

    // Assign current slide state
    currentSlide.classList.remove(currentSlideClassName);
    targetSlide.classList.add(currentSlideClassName);
  }

  #updateIndicator(current, target) {
    current.classList.remove(this.#currentIndicatorClassName);
    target.classList.add(this.#currentIndicatorClassName);
  }

  #toggleSlideButton(targetIndex) {
    const hideClassName = 'hide-button';

    const slidesLength = this.slides.length;

    if (targetIndex === 0) {
      this.prevButton.classList.add(hideClassName);
      this.nextButton.classList.remove(hideClassName);
      return;
    }

    if (targetIndex === slidesLength - 1) {
      this.prevButton.classList.remove(hideClassName);
      this.nextButton.classList.add(hideClassName);
      return;
    }

    this.prevButton.classList.remove(hideClassName);
    this.nextButton.classList.remove(hideClassName);
  }
}

const carousel = document.querySelector('.carousel');
const prevButton = document.querySelector('.carousel__button--left');
const trackContainer = document.querySelector('.carousel__track-container');
const track = document.querySelector('.carousel__track');
const slides = document.querySelectorAll('.carousel__slide');
const nextButton = document.querySelector('.carousel__button--right');
const nav = document.querySelector('.carousel__nav');
const indicators = document.querySelectorAll('.carousel__indicator');
const currentSlideClassName = 'carousel__slide--current';
const currentIndicatorClassName = 'carousel__indicator--current';

const controller = new CarouselController({
  carousel,
  prevButton,
  trackContainer,
  track,
  slides,
  nextButton,
  nav,
  currentSlideClassName,
  currentIndicatorClassName,
});
