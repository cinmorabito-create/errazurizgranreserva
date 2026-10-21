const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const form = document.querySelector('#competition-form');
const formError = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
// Web app URL of apps-script/Code.gs, bound to the Sainsbury's entries sheet.
// Points at the Sainsbury's entries sheet only, never the UK one.
const scriptUrl = 'https://script.google.com/macros/s/AKfycbytR_cVj5GbIIvdykNBdO_gY4A4Yz0OFgVYG_CNiHYbOP309oKgKf695e7RyNGdaAOn9A/exec';
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');
const imageBreak = document.querySelector('.image-break');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const updateParallax = () => {
  if (prefersReducedMotion.matches) return;

  if (hero && heroImage) {
    const heroBounds = hero.getBoundingClientRect();
    const heroOffset = Math.max(-180, Math.min(180, heroBounds.top * -0.35));
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

// The T&Cs restrict entry to adults resident in England, Wales and Scotland,
// so Northern Ireland (BT) and Crown Dependency (GY, JE, IM) postcodes are out.
const ukPostcode = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
const excludedPostcode = /^(BT|GY|JE|IM)[0-9]/i;
const isPhone = (value) => /^[0-9 +()-]+$/.test(value) && /^\d{10,15}$/.test(value.replace(/\D/g, ''));

const isAdult = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const eighteenth = new Date(year + 18, month - 1, day);
  return eighteenth <= new Date();
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';
  form.classList.add('was-validated');

  const { dob, phone, postcode } = form.elements;
  const ageError = dob.value && !isAdult(dob.value) ? 'You must be 18 or over to enter.' : '';
  const postcodeError = !postcode.value ? ''
    : !ukPostcode.test(postcode.value.trim()) ? 'Please enter a valid UK postcode.'
    : excludedPostcode.test(postcode.value.trim()) ? 'This prize draw is open to residents of England, Wales and Scotland only.'
    : '';
  const phoneError = phone.value && !isPhone(phone.value.trim()) ? 'Please enter a valid phone number.' : '';
  dob.setCustomValidity(ageError);
  phone.setCustomValidity(phoneError);
  postcode.setCustomValidity(postcodeError);

  if (!form.checkValidity()) {
    formError.textContent = ageError || phoneError || postcodeError
      || 'Please complete the required fields and accept the Terms & Conditions.';
    form.querySelector(':invalid')?.focus();
    return;
  }

  if (!scriptUrl) {
    formError.textContent = 'Entries are not open yet. Please try again soon.';
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
        dob: dob.value,
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        addressLine1: form.elements.addressLine1.value.trim(),
        addressLine2: form.elements.addressLine2.value.trim(),
        town: form.elements.town.value.trim(),
        postcode: postcode.value.trim().toUpperCase(),
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
    submitButton.innerHTML = 'Enter the prize draw <span aria-hidden="true">↗︎</span>';
  }
});