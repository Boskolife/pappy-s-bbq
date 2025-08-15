let isModalOpen = false;

initFullpage();

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('header').classList.add('show');
  }, 1000);
  setTimeout(() => {
    document.getElementById('main_title').classList.add('show');
  }, 1500);
  setTimeout(() => {
    document.getElementById('tip').classList.add('show');
    document.getElementById('tip_2').classList.add('show');
  }, 1200);
  initTextAnimation();
  initFormModal();
  initVideoObserver();
});

async function initFullpage() {
  new fullpage('#fullpage', {
    licenseKey: 'NQUNK-NJHP6-9Q9I9-AKBJI-DRCWJ',
    scrollingSpeed: 1700,

    onLeave: function (origin, destination, direction) {
      fullpage_api.setAllowScrolling(false);

      setTimeout(() => {
        fullpage_api.setAllowScrolling(true);
      }, 1500);
    },
  });
}

function initTextAnimation() {
  const textElements = document.querySelectorAll('.text_content');
  const buttons = document.querySelectorAll('.view_btn');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.5 },
  );

  textElements.forEach((el) => observer.observe(el));
  buttons.forEach((el) => observer.observe(el));
}

function initFormModal() {
  const openModalBtn = document.getElementById('openFormModal');
  const formModal = document.querySelector('.form_modal');
  const closeBtn = formModal.querySelector('.close');

  openModalBtn.addEventListener('click', () => {
    formModal.classList.add('show');
    document.body.classList.add('body_lock');
    isModalOpen = true;
    fullpage_api.setAllowScrolling(false);
    fullpage_api.setKeyboardScrolling(false);
  });

  closeBtn.addEventListener('click', () => {
    formModal.classList.remove('show');
    document.body.classList.remove('body_lock');
    isModalOpen = false;
    fullpage_api.setAllowScrolling(true);
    fullpage_api.setKeyboardScrolling(true);
  });
}

function initVideoObserver() {
  const videoBlocks = document.querySelectorAll('.scroll_block');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');

        if (video) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    },
    { threshold: 0.6 },
  );

  videoBlocks.forEach((block) => {
    if (block.querySelector('video')) {
      observer.observe(block);
    }
  });
}

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const firstName = document.getElementById('first_name').value.trim();
  const lastName = document.getElementById('last_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  const message = `Hello! I would like to reserve a table.
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'not provided'}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '50259796771';
  const whatsappLink = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}`;

  window.open(whatsappLink, '_blank');
});
