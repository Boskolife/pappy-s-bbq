window.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mainTitle = document.getElementById('main_title');
  setTimeout(() => {
    header.classList.add('show');
  }, 1000);
  mainTitle.classList.add('show');
});

const blocks = document.querySelectorAll('.scroll_block');
let currentIndex = 0;
let isScrolling = false;

function scrollToBlock(index) {
  if (index < 0 || index >= blocks.length) return;

  isScrolling = true;
  const block = blocks[index];
  const isSecondBlock = block.classList.contains('second_block');

  block.scrollIntoView({
    behavior: 'smooth',
    block: isSecondBlock ? 'end' : 'start',
  });

  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

window.addEventListener('wheel', (e) => {
  if (isScrolling) return;

  if (e.deltaY > 0) {
    currentIndex++;
  } else {
    currentIndex--;
  }

  currentIndex = Math.max(0, Math.min(currentIndex, blocks.length - 1));
  scrollToBlock(currentIndex);
});

window.addEventListener('keydown', (e) => {
  if (isScrolling) return;
  if (e.key === 'ArrowDown') {
    currentIndex = Math.min(currentIndex + 1, blocks.length - 1);
    scrollToBlock(currentIndex);
  }
  if (e.key === 'ArrowUp') {
    currentIndex = Math.max(currentIndex - 1, 0);
    scrollToBlock(currentIndex);
  }
});

const headerPin = document.querySelector('.header_pinned');
const scrollBlocks = document.querySelectorAll('.scroll_block');
const blocksToTrack = Array.from(scrollBlocks).slice(2);

const observer = new IntersectionObserver(
  (entries) => {
    const anyVisible = entries.some((entry) => entry.isIntersecting);

    if (anyVisible) {
      setTimeout(() => {
        headerPin.classList.add('active');
      }, 1000);
      headerPin.classList.remove('show');
    } else {
      headerPin.classList.remove('active');
      headerPin.classList.add('show');
    }
  },
  {
    threshold: 0.5,
  },
);

blocksToTrack.forEach((block) => observer.observe(block));

const textElements = document.querySelectorAll('.text_content');

const textObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  },
  {
    threshold: 0.5,
  },
);

textElements.forEach((el) => textObserver.observe(el));
openFormModal();
function openFormModal() {
  const openModalBtn = document.getElementById('openFormModal');
  const formModal = document.querySelector('.form_modal');
  const closeBtn = formModal.querySelector('.close');

  openModalBtn.addEventListener('click', () => {
    formModal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    formModal.classList.remove('show');
  });
}
