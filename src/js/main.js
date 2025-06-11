let isModalOpen = false;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('header').classList.add('show');
  document.getElementById('main_title').classList.add('show');
  initScroll();
  initHeaderObserver();
  initTextAnimation();
  initFormModal();
});

function initScroll() {
  const blocks = document.querySelectorAll('.scroll_block');
  let currentIndex = 0;
  let isScrolling = false;

  const scrollToBlock = (index) => {
    if (index < 0 || index >= blocks.length || isScrolling) return;

    isScrolling = true;
    blocks[index].scrollIntoView({
      behavior: 'smooth',
      block: blocks[index].classList.contains('second_block') ? 'end' : 'start',
    });

    setTimeout(() => (isScrolling = false), 1000);
  };

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
      if (isModalOpen) {
        e.preventDefault();
        return;
      }
      if (isScrolling) {
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
}

function initHeaderObserver() {
  const headerPin = document.querySelector('.header_pinned');
  const blocks = document.querySelectorAll('.scroll_block');
  const lastBlock = document.querySelector('.footer_block');

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      let isLastBlockVisible = false;
      let anyBlockVisible = false;

      entries.forEach((entry) => {
        if (entry.target === lastBlock && entry.isIntersecting) {
          isLastBlockVisible = true;
        }
        if (entry.isIntersecting && entry.target !== lastBlock) {
          anyBlockVisible = true;
        }
      });

      if (isLastBlockVisible) {
        headerPin.classList.remove('active');
      } else if (anyBlockVisible) {
        headerPin.classList.add('active');
      }
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
