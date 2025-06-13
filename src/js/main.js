let isModalOpen = false;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('header').classList.add('show');
  }, 1500);
  initScroll();
  initHeaderObserver();
  initTextAnimation();
  initFormModal();
  initVideoObserver();
});

function initScroll() {
  const blocks = document.querySelectorAll('.scroll_block');
  let currentIndex = 0;
  let isScrolling = false;
  let touchStartY = 0;
  let touchEndY = 0;

  // const scrollToBlock = (index) => {
  //   if (index < 0 || index >= blocks.length || isScrolling) return;

  //   isScrolling = true;
  //   blocks[index].scrollIntoView({
  //     behavior: 'smooth',
  //     block: blocks[index].classList.contains('second_block') ? 'end' : 'start',
  //   });

  //   setTimeout(() => (isScrolling = false), 1000);
  // };

  const scrollToBlock = (index, duration = 1000) => {
    if (index < 0 || index >= blocks.length || isScrolling) return;

    isScrolling = true;

    const targetBlock = blocks[index];

    blocks.forEach((block) => block.classList.remove('active'));

    targetBlock.classList.add('active');

    const offset = targetBlock.getBoundingClientRect().top;

    const targetY = window.pageYOffset + offset;
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startY + distance * progress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isScrolling = false;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  scrollToBlock(0, 1200);
  scrollToBlock(1, 1200);
  scrollToBlock(2, 1200);
  scrollToBlock(3, 1200);
  scrollToBlock(4, 1200);
  scrollToBlock(5, 1200);

  const updateIndex = (delta) => {
    currentIndex = Math.max(
      0,
      Math.min(currentIndex + delta, blocks.length - 1),
    );
    scrollToBlock(currentIndex);
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (isModalOpen || isScrolling) {
        e.preventDefault();
        return;
      }
      updateIndex(e.deltaY > 0 ? 1 : -1);
    },
    { passive: false },
  );

  window.addEventListener('keydown', (e) => {
    if (isModalOpen) return;
    if (e.key === 'ArrowDown') updateIndex(1);
    if (e.key === 'ArrowUp') updateIndex(-1);
  });

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].clientY;
  });

  window.addEventListener('touchend', (e) => {
    if (isModalOpen || isScrolling) return;

    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaY) > 50) {
      updateIndex(deltaY > 0 ? 1 : -1);
    }
  });
}

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
  });

  closeBtn.addEventListener('click', () => {
    formModal.classList.remove('show');
    document.body.classList.remove('body_lock');
    isModalOpen = false;
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
