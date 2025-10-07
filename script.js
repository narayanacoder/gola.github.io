/* ---------- 1) Hero 打字机效果 ---------- */
(function typewriter() {
  const heroTitle = document.querySelector('.hero h1');
  if (!heroTitle) return;
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  (function tick() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i++);
      setTimeout(tick, 80);
    }
  })();
})();

/* ---------- 2) 全局背景光晕跟随 ---------- */
(function pageGlowFollowStable() {
  function init() {
    const glow = document.querySelector('.page-glow');
    if (!glow) return;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let x = targetX, y = targetY;

    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = 0.085;

    function raf() {
      x = lerp(x, targetX, ease);
      y = lerp(y, targetY, ease);
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    function onPointer(e) {
      const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (typeof cx === 'number' && typeof cy === 'number') {
        targetX = cx;
        targetY = cy;
      }
    }

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('mousemove', onPointer, { passive: true });
    window.addEventListener('touchmove', onPointer, { passive: true });

    window.addEventListener('resize', () => {
      targetX = window.innerWidth * 0.5;
      targetY = window.innerHeight * 0.4;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ---------- 3) Section 入场动画（滚动触发） ----------*/
(function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.tagName.toLowerCase() === 'section' && !el.classList.contains('painpoints') && el.id !== 'painpoints') {
        el.classList.add('visible');
      }

      // 资讯卡 & 案例卡（排除 painpoints）
      if (!el.classList.contains('painpoints') && el.id !== 'painpoints') {
        el.querySelectorAll('.insight-card, .case-card').forEach(card => {
          setTimeout(() => card.classList.add('visible'), 100);
        });
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('section').forEach(sec => observer.observe(sec));
})();

/* ---------- 4) 文本 hover 效果 ---------- */
(function enhanceTextHover() {
  const nodes = document.querySelectorAll('p, li, a, h3');
  nodes.forEach(n => n.classList.add('text-interactive'));
})();

/* ---------- 5) 导航滚动透明度 ---------- */
(function headerOnScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(255,255,255,0.82)';
    } else {
      header.style.background = 'rgba(255,255,255,0.65)';
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
})();

/* ---------- 6) Painpoints 专属弹出动画 ---------- */
(function observePainpointsPopOnly() {
  const section = document.querySelector('.painpoints, #painpoints');
  if (!section) return;

  const title = section.querySelector('h2');
  const subtitle = section.querySelector('.subtitle');
  const cards = section.querySelectorAll('.pain-card');

  cards.forEach(c => c.classList.remove('left-slide', 'up-slide', 'right-slide', 'visible'));

  function showPainpoints() {
    section.classList.add('visible');

    // 标题/副标题
    if (title) title.classList.add('is-visible');
    setTimeout(() => subtitle?.classList.add('is-visible'), 300);

    // 卡片只做缩放弹出
    cards.forEach((card, i) => {
      // 初始确保有缩放基态
      card.style.willChange = 'transform, opacity';
      // 触发淡入缩放
      setTimeout(() => {
        card.classList.add('is-visible'); // 依赖 CSS: .pain-card.is-visible { opacity:1; transform:scale(1); }
      }, 400 + i * 220);
    });
  }

  // 如果刷新时 section 已经在视口内，直接触发
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
    showPainpoints();
  }

  // 使用 IO 触发
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showPainpoints();
        io.disconnect();
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  io.observe(section);
})();

// 🚀 无限滚动克隆逻辑
(function initUsecasesMarquee() {
  const container = document.querySelector('.usecases-container');
  if (!container) return;

  const firstTrack = container.querySelector('.usecases-track');

  // ✅ 防止重复克隆（检查是否已有第二条轨道）
  const hasClone = container.querySelectorAll('.usecases-track').length > 1;
  if (hasClone) return;

  const clone = firstTrack.cloneNode(true);
  container.appendChild(clone);

  // ✅ 用像素定位第二条轨道，确保不重叠
  function placeClone() {
    const w = firstTrack.scrollWidth;
    firstTrack.style.left = '0px';
    clone.style.left = w + 'px';
  }

  placeClone();
  window.addEventListener('resize', placeClone);
})();

// 🎬 滚动到视口才触发动画（只触发一次）
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // ✅ 只触发一次
      }
    });
  },
  { threshold: 0.25 }
);

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".usecases-track");
  if (track && !track.nextElementSibling) {
    const clone = track.cloneNode(true);
    clone.style.left = "100%";
    track.parentElement.appendChild(clone);
  }
});

document.querySelectorAll('.fade-in, .partner-card, .partners-section h2').forEach(el => {
  observer.observe(el);
});
