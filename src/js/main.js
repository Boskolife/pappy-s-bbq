let isModalOpen = false;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('header').classList.add('show');
  }, 1000);
  setTimeout(() => {
    document.getElementById('main_title').classList.add('show');
  }, 1500);
  setTimeout(() => {
    document.getElementById('tip').classList.add('show');
  }, 1200);
  initHeaderObserver();
  initTextAnimation();
  initFormModal();
  initVideoObserver();
  initLazyVideo();

  new fullpage('#fullpage', {
    licenseKey: 'NQUNK-NJHP6-9Q9I9-AKBJI-DRCWJ',
    scrollingSpeed: 1700,
  });
});

function initHeaderObserver() {
  const headerPin = document.querySelector('.header_pinned');
  const blocks = document.querySelectorAll('.scroll_block');
  const lastBlock = document.querySelector('.footer_block');

  const visibleBlocks = new Set();

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === lastBlock) {
          if (entry.isIntersecting) {
            headerPin.classList.remove('active');
          } else if (visibleBlocks.size > 0) {
            headerPin.classList.add('active');
          }
        } else {
          if (entry.isIntersecting) {
            visibleBlocks.add(entry.target);
          } else {
            visibleBlocks.delete(entry.target);
          }

          if (visibleBlocks.size > 0 && !lastBlock?.isIntersecting) {
            headerPin.classList.add('active');
          } else {
            headerPin.classList.remove('active');
          }
        }
      });
    },
    { threshold: 0.8 },
  );

  const blocksToTrack = Array.from(blocks).slice(2);
  blocksToTrack.forEach((block) => scrollObserver.observe(block));

  if (lastBlock) scrollObserver.observe(lastBlock);
}

function initTextAnimation() {
  const textElements = document.querySelectorAll('.text_content');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.5 },
  );

  textElements.forEach((el) => observer.observe(el));
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
            video.classList.add('entry');
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

function initLazyVideo() {
  const lazyVideos = document.querySelectorAll('video');

  const videoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          if (!video.src) {
            const src = video.getAttribute('data-src');
            if (src) video.src = src;
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.1,
    },
  );

  lazyVideos.forEach((video) => {
    const src = video.getAttribute('src');
    if (src) {
      video.setAttribute('data-src', src);
      video.removeAttribute('src');
    }
    videoObserver.observe(video);
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
