const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const form = document.querySelector('#competition-form');
const formError = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
const scriptUrl = 'https://script.google.com/macros/s/AKfycbz3POb6_tgz-xSMWkZoXlnBiLIZuNbW-z7pBEJES2FFeaRRadI51BdziBvcT_8bU-Smaw/exec';
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');
const imageBreak = document.querySelector('.image-break');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const updateParallax = () => {
  if (prefersReducedMotion.matches) return;

  if (hero && heroImage) {
    const heroBounds = hero.getBoundingClientRect();
    const heroOffset = Math.max(-58, Math.min(58, heroBounds.top * -0.16));
    hero.style.setProperty('--hero-parallax-y', `${heroOffset}px`);
  }

  if (imageBreak) {
    const imageBounds = imageBreak.getBoundingClientRect();
    const imageDistanceFromCenter = window.innerHeight / 2 - (imageBounds.top + imageBounds.height / 2);
    const imageOffset = Math.max(-58, Math.min(58, imageDistanceFromCenter * 0.18));
    imageBreak.style.setProperty('--parallax-y', `${imageOffset}px`);
  }
};

if ((hero || imageBreak) && !prefersReducedMotion.matches) {
  let parallaxFrame;
  const requestParallaxUpdate = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(() => {
      updateParallax();
      parallaxFrame = undefined;
    });
  };

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate);
  updateParallax();
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const wineList = document.querySelector('.wine-list');
const wineCards = [...document.querySelectorAll('.wine-card')];
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
let pinnedCard = null;

const showBottle = (card) => {
  wineCards.forEach((other) => {
    const isOpen = other === card;
    other.classList.toggle('is-open', isOpen);
    other.querySelector('.wine-name')?.setAttribute('aria-expanded', String(isOpen));
  });
};

wineCards.forEach((card) => {
  // Click pins a bottle open — it survives the pointer leaving, and is the
  // only way in on touch, where hover never fires.
  card.querySelector('.wine-name')?.addEventListener('click', () => {
    pinnedCard = pinnedCard === card ? null : card;
    showBottle(pinnedCard);
  });

  card.addEventListener('mouseenter', () => {
    if (canHover.matches) showBottle(card);
  });
});

wineList?.addEventListener('mouseleave', () => {
  if (canHover.matches) showBottle(pinnedCard);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  if (!form.checkValidity()) {
    formError.textContent = 'Please complete the required fields and accept the Terms & Conditions.';
    form.querySelector(':invalid')?.focus();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending <span aria-hidden="true">↗︎</span>';

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.elements.firstName.value.trim(),
        surname: form.elements.surname.value.trim(),
        email: form.elements.email.value.trim(),
        termsAccepted: form.elements.terms.checked,
        marketingOptIn: form.elements.marketing.checked
      })
    });

    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.focus();
  } catch (error) {
    formError.textContent = 'We could not submit your entry. Please try again.';
    submitButton.disabled = false;
    submitButton.innerHTML = 'Enter the competition <span aria-hidden="true">↗︎</span>';
  }
});