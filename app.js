(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const googleUrl = 'https://www.google.com/maps/place/Ks+interio/@28.6381113,77.2796251,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfde0ec230715:0x2d5aa878ea6c9447!8m2!3d28.6381113!4d77.2796251!16s%2Fg%2F11tfh7pysh';
  $$('[data-google-link]').forEach(link => { link.href = googleUrl; });
  $('#year').textContent = new Date().getFullYear();

  // One observer, no scroll handlers or continuous animation loops.
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  let menuCloseTimer;
  const headerSentinel = document.createElement('span');
  headerSentinel.className = 'header-sentinel';
  headerSentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(headerSentinel);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      $('#site-header').classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(headerSentinel);
  }
  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.inert = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
    clearTimeout(menuCloseTimer);
    menuCloseTimer = setTimeout(() => { mobileNav.hidden = true; }, reducedMotion ? 0 : 350);
  };
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    if (!opening) { closeMenu(); return; }
    clearTimeout(menuCloseTimer);
    mobileNav.hidden = false;
    mobileNav.inert = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (menuToggle.getAttribute('aria-expanded') === 'true') mobileNav.classList.add('is-open');
    }));
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
    if (event.key === 'Tab' && !mobileNav.hidden) {
      const nodes = [$('.site-header .brand'), $('.header-cta'), menuToggle, ...$$('a', mobileNav)].filter(node => node.getClientRects().length);
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 992px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const services = $$('.service-item');
  services.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    services.forEach(other => { if (other !== item) other.open = false; });
    $('#service-image').src = `assets/photos/${item.dataset.image}`;
    $('#service-image').alt = item.dataset.alt;
    $('#service-image-label').textContent = item.dataset.label;
    $('#service-image-index').textContent = `KS / ${String(services.indexOf(item) + 1).padStart(2, '0')}`;
  }));

  const filterButtons = $$('.filter');
  const projectCards = $$('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    $('#portfolio-grid').classList.toggle('is-filtered', filter !== 'all');
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) card.classList.add('is-visible');
    });
  }));

  const projects = [
    { title: 'The art of slowing down', category: 'LIVING / WARM MINIMALISM', image: 'living.webp', description: 'A welcoming living room with room to breathe. Warm wood, natural textures and a considered mix of soft shapes create an easy, lived-in calm. Bring this direction into your home with layered light and pieces that feel personal.', palette: [['#c9b99c', 'Linen'], ['#8b7154', 'Oak'], ['#e6e2d5', 'Warm white']] },
    { title: 'A softer kind of luxury', category: 'BEDROOM / QUIET LUXURY', image: 'bedroom.webp', description: 'Your own little retreat. A gentle palette, tactile fabrics and thoughtful lighting turn the bedroom into a place to truly switch off. The mood is understated; the feeling is entirely personal.', palette: [['#d4cbbd', 'Oat'], ['#968877', 'Taupe'], ['#ebdfcb', 'Soft ivory']] },
    { title: 'Where life comes together', category: 'KITCHEN / EVERYDAY ELEGANCE', image: 'kitchen.webp', description: 'A kitchen made for real life, from the first coffee to the last conversation. Clean lines, practical storage and balanced materials make the everyday feel a little more special.', palette: [['#dfdfd7', 'Stone'], ['#a7957a', 'Timber'], ['#454b40', 'Olive']] },
    { title: 'Room for your next big idea', category: 'WORKSPACE / CREATIVE ENERGY', image: 'workspace.webp', description: 'A fresh perspective on the working day. Natural light, clear surfaces and inviting textures create room to focus, collaborate and think bigger. Start with how you work, then shape the space around it.', palette: [['#e4e2d6', 'Chalk'], ['#b5bb9b', 'Sage'], ['#6e6556', 'Walnut']] }
  ];
  const projectDialog = $('#project-dialog');
  const openDialog = dialog => { dialog.showModal(); document.body.classList.add('has-dialog'); };
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('has-dialog'));
  });
  projectCards.forEach(card => card.addEventListener('click', () => {
    const project = projects[Number(card.dataset.project)];
    $('#dialog-title').textContent = project.title;
    $('#dialog-category').textContent = project.category;
    $('#dialog-image').src = `assets/photos/${project.image}`;
    $('#dialog-image').alt = project.title + ' — interior design inspiration';
    $('#dialog-description').textContent = project.description;
    const palette = $('#dialog-palette');
    palette.replaceChildren();
    project.palette.forEach(([color, name]) => {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.backgroundColor = color;
      swatch.setAttribute('aria-hidden', 'true');
      item.append(swatch, document.createTextNode(name));
      palette.append(item);
    });
    $('#dialog-cta').dataset.interest = `${project.title} (${project.category.split(' / ')[0].toLowerCase()})`;
    $('#dialog-cta').dataset.service = card.dataset.category === 'kitchen' ? 'Modular Kitchen' : card.dataset.category === 'workspace' ? 'Commercial Design' : 'Residential Interiors';
    openDialog(projectDialog);
  }));
  const note = $('#project-note');
  const serviceNeeded = $('#service-needed');
  $('#dialog-cta').addEventListener('click', event => {
    serviceNeeded.value = event.currentTarget.dataset.service;
    if (!note.value.trim()) note.value = `I'm inspired by “${event.currentTarget.dataset.interest}” and would love to explore this direction.`;
    projectDialog.close();
    setTimeout(() => $('#client-name').focus({ preventScroll: true }), reducedMotion ? 0 : 450);
  });
  $$('[data-interest]').forEach(link => link.addEventListener('click', () => {
    serviceNeeded.value = link.dataset.interest;
    if (!note.value.trim()) note.value = `I'd like to discuss ${link.dataset.interest.toLowerCase()} for my space.`;
  }));
  $('.privacy-trigger').addEventListener('click', () => openDialog($('#privacy-dialog')));

  const form = $('#consultation-form');
  const phone = $('#client-phone');
  const name = $('#client-name');
  const location = $('#site-location');
  const email = $('#client-email');
  const fields = $$('input, select, textarea', form);
  const errors = $('#form-errors');
  const renderFieldError = field => {
    let error = $(`#error-${field.id}`);
    const invalid = !field.validity.valid;
    field.setAttribute('aria-invalid', String(invalid));
    if (!error && invalid) {
      error = document.createElement('span');
      error.id = `error-${field.id}`;
      error.className = 'field-error';
      field.after(error);
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    }
    if (error) {
      error.hidden = !invalid;
      error.textContent = invalid ? field.validationMessage : '';
    }
  };
  form.noValidate = true;
  const validatePhone = () => phone.setCustomValidity(phone.value && !/^[6-9][0-9]{9}$/.test(phone.value) ? 'Please enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.' : '');
  fields.forEach(input => input.addEventListener('input', () => {
    input.setCustomValidity('');
    if (input === phone) validatePhone();
    if (input.hasAttribute('aria-invalid')) renderFieldError(input);
    if (fields.every(field => field.validity.valid)) errors.hidden = true;
    $('#form-feedback').hidden = true;
  }));
  phone.addEventListener('invalid', validatePhone);
  form.addEventListener('submit', event => {
    event.preventDefault();
    name.setCustomValidity(name.value.trim().length < 2 ? 'Please enter your name.' : '');
    location.setCustomValidity(location.value.trim().length < 2 ? 'Please enter your site location.' : '');
    validatePhone();
    fields.forEach(renderFieldError);
    const firstInvalid = fields.find(field => !field.validity.valid);
    if (firstInvalid) {
      errors.textContent = 'Please check the highlighted fields so we can prepare your enquiry.';
      errors.hidden = false;
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    errors.hidden = true;
    const message = [
      'Hi KS Interio! I’d like to discuss my space.', '',
      `Client name: ${name.value.trim()}`,
      `Contact: ${phone.value.trim()}`,
      ...(email.value.trim() ? [`Email: ${email.value.trim()}`] : []),
      `Service needed: ${serviceNeeded.value}`,
      `Site location: ${location.value.trim()}`,
      `Budget: ${$('#budget').value}`,
      ...(note.value.trim() ? ['', `About my space: ${note.value.trim()}`] : []),
      '', 'Sent from the KS Interio website.'
    ].join('\n');
    const whatsappUrl = `https://wa.me/919354393499?text=${encodeURIComponent(message)}`;
    $('#whatsapp-continue').href = whatsappUrl;
    $('#form-feedback').hidden = false;
    // Same-tab navigation works on mobile and is not blocked as a popup.
    window.location.assign(whatsappUrl);
  });
  form.hidden = false;
  $('#form-fallback').hidden = true;
})();
