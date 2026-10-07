const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.textContent = open ? '×' : '☰';
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));


const GOOGLE_FORM = {
  formId: '1FAIpQLSdWIX5fFd0QyEzSLgSGwLlCdKA9fpLYgor7piniQ-mFpeSp2Q',
  fields: {
    name: 'entry.835765185',   // "Full Name"
    email: 'entry.795713586',  // "Email Address"
    group: 'entry.91925948'    // "I'm Interested in" — ; the
                               // two options match this page's dropdown
                               // exactly, so keep them in sync if either changes.
  }
};

const FALLBACK_EMAIL = 'cacyouthofunity@gmail.com';

const signupForm = document.querySelector('#signup-form');
const formMessage = document.querySelector('.form-message');

function formIsConnected() {
  const { formId, fields } = GOOGLE_FORM;
  return Boolean(formId && fields.name && fields.email && fields.group);
}

function say(text, isError) {
  formMessage.textContent = text;
  formMessage.classList.toggle('form-error', Boolean(isError));
}

signupForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const firstName = String(data.get('name') || '').trim().split(' ')[0];

  if (!formIsConnected()) {
    say(`This form isn’t connected yet — please email ${FALLBACK_EMAIL} and we’ll add you.`, true);
    return;
  }

  const answers = new URLSearchParams();
  answers.set(GOOGLE_FORM.fields.name, data.get('name'));
  answers.set(GOOGLE_FORM.fields.email, data.get('email'));
  answers.set(GOOGLE_FORM.fields.group, data.get('group'));
  // The form also has "Collect email addresses" switched on, which adds a
  // required field of its own. Harmlessly ignored if that gets turned off.
  answers.set('emailAddress', data.get('email'));

  const button = signupForm.querySelector('button[type="submit"]');
  button.disabled = true;
  say('Sending…');

  // Google rejects cross-site reads, so the reply is opaque: a network
  // failure throws, but anything that reaches Google counts as sent.
  fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    body: answers
  })
    .then(() => {
      say(`Thanks, ${firstName}! You’re on the list — we’ll be in touch soon.`);
      signupForm.reset();
    })
    .catch(() => {
      say(`We couldn’t send that — please email ${FALLBACK_EMAIL} instead.`, true);
    })
    .finally(() => {
      button.disabled = false;
    });
});

/* ----------------------------------------------------------------
   EVENTS — edit this list to change what shows under "Coming up".
   Weekly event:  weekday 0 = Sunday, 1 = Monday ... 6 = Saturday.
   One-off event: date [year, month, day]  (month is 1-12).
   time is 24-hour: 19 = 7 PM. The three soonest always show.
------------------------------------------------------------------- */
const EVENTS = [
  {
    type: 'BIBLE STUDY',
    lines: ['Young Adult', 'Bible Study'],
    weekday: 3,
    time: { h: 19, m: 0 },
    location: 'Fellowship Hall'
  },
  {
    type: 'Sunday Service',
    lines: ['Cultural Day'],
    weekday: 0,
    time: { h: 10, m: 30 },
    location: 'Christ Anglican Church Marietta, GA'
  },
  {
    type: 'YOUNG ADULTS',
    lines: ['Fall Bonfire', '& Worship'],
    date: [2026, 9, 21],
    time: { h: 19, m: 30 },
    location: 'The Green'
  },
  {
    type: 'SERVICE DAY',
    lines: ['Love Marietta'],
    date: [2026, 10, 5],
    time: { h: 9, m: 0 },
    location: 'Meet at Church'
  }
];

const CARDS_SHOWN = 3;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function nextOccurrence(event, now) {
  if (event.date) {
    const [year, month, day] = event.date;
    return new Date(year, month - 1, day, event.time.h, event.time.m);
  }
  const when = new Date(now.getFullYear(), now.getMonth(), now.getDate(), event.time.h, event.time.m);
  when.setDate(when.getDate() + ((event.weekday - when.getDay() + 7) % 7));
  if (when < now) when.setDate(when.getDate() + 7);
  return when;
}

function formatTime(time) {
  const hour = time.h % 12 || 12;
  return `${hour}:${String(time.m).padStart(2, '0')} ${time.h < 12 ? 'AM' : 'PM'}`;
}

function buildCard(event, when, featured) {
  const card = document.createElement('article');
  card.className = featured ? 'event-card featured' : 'event-card';

  const date = document.createElement('div');
  date.className = 'event-date';
  const day = document.createElement('b');
  day.textContent = String(when.getDate()).padStart(2, '0');
  const month = document.createElement('span');
  month.textContent = MONTHS[when.getMonth()];
  date.append(day, month);

  const body = document.createElement('div');
  const type = document.createElement('p');
  type.className = 'event-type';
  type.textContent = event.type;

  const title = document.createElement('h3');
  event.lines.forEach((line, index) => {
    if (index) title.appendChild(document.createElement('br'));
    title.appendChild(document.createTextNode(line));
  });

  const meta = document.createElement('p');
  meta.className = 'event-meta';
  const repeats = event.weekday === undefined ? '' : `${WEEKDAYS[event.weekday]} · `;
  meta.textContent = `${repeats}${formatTime(event.time)} · ${event.location}`;
  body.append(type, title, meta);

  const arrow = document.createElement('span');
  arrow.className = 'event-arrow';
  arrow.textContent = '→';

  card.append(date, body, arrow);
  return card;
}

function renderEvents() {
  const grid = document.querySelector('#event-grid');
  if (!grid) return;
  const now = new Date();
  const upcoming = EVENTS
    .map(event => ({ event, when: nextOccurrence(event, now) }))
    .filter(item => item.when >= now)
    .sort((a, b) => a.when - b.when)
    .slice(0, CARDS_SHOWN);

  grid.textContent = '';
  upcoming.forEach((item, index) => grid.appendChild(buildCard(item.event, item.when, index === 0)));
}

renderEvents();

document.querySelectorAll('.portrait-photo').forEach(photo => {
  const hide = () => { photo.hidden = true; };
  if (!photo.getAttribute('src')) hide();
  photo.addEventListener('error', hide);
  if (photo.complete && photo.naturalWidth === 0) hide();
});

/* ----------------------------------------------------------------
   SCROLL REVEALS — elements tagged .reveal in index.html slide into
   place as they scroll in. Direction comes from reveal-left /
   reveal-right / reveal-down / reveal-up. Cards in the two grids are
   tagged here instead of by hand, and staggered so they cascade.
------------------------------------------------------------------- */
const STAGGER_STEP = 80;

function prepareReveals() {
  document.querySelectorAll('.leader-grid, .event-grid').forEach(grid => {
    Array.from(grid.children).forEach((card, index) => {
      card.classList.add('reveal', 'reveal-down');
      card.style.setProperty('--delay', `${index * STAGGER_STEP}ms`);
    });
  });
}

function watchReveals() {
  const items = document.querySelectorAll('.reveal');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add('visible');
      // Hand transform back to the hover effect once the entrance finishes.
      item.addEventListener('transitionend', () => item.classList.add('settled'), { once: true });
      self.unobserve(item);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

prepareReveals();
watchReveals();

document.querySelector('#year').textContent = new Date().getFullYear();
