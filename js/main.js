/**
 * 「轻旅」UX Case Study 主逻辑交互入口
 * 包括页面滚动监听、章节高亮、阅读进度、颜色复制、大图灯箱与全景画廊筛选
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化全屏高保真灯箱
  const lightbox = new window.Lightbox();

  // 全局轻提示 (Toast)
  const showToast = (msg) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  // 2. 顶部阅读进度条与导航阴影
  const progressBar = document.getElementById('reading-progress');
  const siteHeader = document.querySelector('.site-header');

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / (docHeight || 1)) * 100;
    
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (siteHeader) {
      if (scrollTop > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 3. 导航栏锚点自动高亮 (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // 4. 色彩体系色块点击复制 HEX 颜色
  document.querySelectorAll('.color-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-hex');
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => {
          showToast(`已复制色彩代码：${hex}`);
        }).catch(() => {
          showToast(`色彩代码：${hex}`);
        });
      }
    });
  });

  // 5. 设计热区注解浮标 (Design Callout Hotspots)
  document.querySelectorAll('.hotspot-pin, .hotspot-beacon').forEach((pin) => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const popoverId = pin.getAttribute('data-popover-target');
      const popover = document.getElementById(popoverId);
      if (popover) {
        const isActive = popover.classList.contains('active');
        document.querySelectorAll('.hotspot-popover').forEach(p => p.classList.remove('active'));
        if (!isActive) {
          popover.classList.add('active');
        }
      }
    });
  });

  // 点击外部收起热点注解
  document.addEventListener('click', () => {
    document.querySelectorAll('.hotspot-popover').forEach(p => p.classList.remove('active'));
  });

  // 6. 全景画廊分类过滤器 (Gallery Category Filtering)
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');

      galleryItems.forEach((item) => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. 移动端汉堡菜单简单切换
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-links');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = 'var(--header-height)';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#fff';
        navMenu.style.padding = '16px';
        navMenu.style.boxShadow = 'var(--shadow-lg)';
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = 'none';
        }
      });
    });
  }

  // 8. 页面平滑跳转绑定
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
