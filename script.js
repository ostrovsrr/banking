'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const learnBtn = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const contents = document.querySelectorAll('.operations__content');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

learnBtn.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (e) {
    e.preventDefault();

    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;

    // delete all active classes from tabs
    tabs.forEach(tab => {
      tab.classList.remove('operations__tab--active');
    });
    // delete all active classes from contents
    contents.forEach(content => {
      content.classList.remove('operations__content--active');
    });
    // add active to current tab
    clicked.classList.add('operations__tab--active');
    // add active to current content
    const dataNumActive = clicked.dataset.tab;
    document
      .querySelector(`.operations__content--${dataNumActive}`)
      .classList.add('operations__content--active');
  });
const nav = document.querySelector('.nav');

const bluring = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', bluring.bind(0.5));
nav.addEventListener('mouseout', bluring.bind(1));

// Sticky Navigation Unefficient Approach
// window.addEventListener('scroll', function () {
//   const sec1Rect = section1.getBoundingClientRect();
//   if (sec1Rect.y < 0) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

const header = document.querySelector('.header');

let headerObsFn = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
let headerObserver = new IntersectionObserver(headerObsFn, {
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});

headerObserver.observe(header);

let sectionsObsFn = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
let sectionsObserver = new IntersectionObserver(sectionsObsFn, {
  threshold: 0.12,
});

document.querySelectorAll('.section').forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

let imgObserveFn = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(imgObserveFn, {
  threshold: 0,
  rootMargin: '200px',
});
document
  .querySelectorAll('img[data-src]')
  .forEach(img => imgObserver.observe(img));

// Slider implementation
const sliderImplementation = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnSliderLeft = document.querySelector('.slider__btn--left');
  const btnSliderRight = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions Slider
  const goToSlide = function (num) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - num)}%)`;
    });
    num++;
  };
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnSliderRight.addEventListener('click', nextSlide);

  btnSliderLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  document.querySelector('.dots').addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const activateDot = function (index) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${index}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    goToSlide(0);
    slides.forEach((_, index) => {
      document
        .querySelector('.dots')
        .insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${index}"></button>`
        );
    });
    activateDot(0);
  };
  init();
};
sliderImplementation();
