let slideIndex = 0;
let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("demo");
let captionText = document.getElementById("caption");
let autoSlideInterval;

function initSlider() {
  showSlide(slideIndex);
  autoSlideInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 4000); 
}

function showSlide(n) {
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("show");
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex].classList.add("show");
  dots[slideIndex].classList.add("active");
  captionText.innerHTML = dots[slideIndex].alt;
}

function plusSlides(n) {
  clearInterval(autoSlideInterval); 
  slideIndex += n;
  showSlide(slideIndex);
  autoSlideInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 4000);
}

function currentSlide(n) {
  clearInterval(autoSlideInterval); 
  slideIndex = n - 1;
  showSlide(slideIndex);
  autoSlideInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 4000);
}

initSlider();

document.addEventListener("DOMContentLoaded", () => {
  const elementsToObserve = document.querySelectorAll(
    ".footer-column, .callout, .news-wrapper, .maps, .location-sidebar, .aside, .newssectionhandle, .students-highlights, .footer-column, .callout, .news-wrapper, .maps, .location-sidebar, .aside, .newssectionhandle"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      } else {
        entry.target.classList.remove("reveal");
      }
    });
  }, {
    threshold: 0.2
  });

  elementsToObserve.forEach(el => observer.observe(el));
});

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    const answer = button.nextElementSibling;
    answer.hidden = expanded;
  });
});
 document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".campus-reveal");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
        } else {
          entry.target.classList.remove("reveal");
        }
      });
    }, { threshold: 0.2 });

    reveals.forEach(el => observer.observe(el));
  });
