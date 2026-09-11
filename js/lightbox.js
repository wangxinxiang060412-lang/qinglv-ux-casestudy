/**
 * 「轻旅」UX Case Study 高保真图片灯箱查看器
 * 支持键盘导航 (ESC, ArrowLeft, ArrowRight)、无障碍焦点管理与全屏沉浸预览
 */

class Lightbox {
  constructor() {
    this.images = [
      {
        src: '初始页.png',
        title: '初始页 / 品牌主张呈现',
        desc: '以翱翔机翼与湛蓝天际作为视觉开篇，确立“专注于年轻人的轻旅行”品牌定位，传递纯净、轻盈且无负担的出行心智。'
      },
      {
        src: '首页.png',
        title: '首页 / 决策型双列瀑布流',
        desc: '创新性将“规划时间 2-3天”与“AI智能规划”前置于封面，打破传统单纯美图种草，帮助年轻人在首页即可完成时间匹配决策。'
      },
      {
        src: 'AI.png',
        title: 'AI 智能行程助手 / 意图引导态',
        desc: '常驻核心导航，结合底部灵感抽屉与自然语言提示词引导（如“杭州3天学生平价游”），将复杂旅行规划缩短至对话之间。'
      },
      {
        src: 'AI-1.png',
        title: 'AI 智能助手 / 极简沉浸对话态',
        desc: '抽屉收起后的纯粹对话界面，留足垂直交互空间，保障多轮方案微调时的视觉呼吸感与专注度。'
      },
      {
        src: '卡片详情页.png',
        title: '卡片详情页 / 结构化时间轴系统',
        desc: '核心体验突破点：以“Day 1/2/3”多日选项卡结合精确到时钟时段（08:00/09:00/12:00）的图标清单，将散乱游记重塑为直接可执行的行动手册。'
      },
      {
        src: '地点详细页.png',
        title: '地点详细页 / 城市全景探索态',
        desc: '轻量化地图底图与城市标志卡片融合，以“超999+旅行者探索过此地”建立同温层信任感，底部上滑抽屉预备承接深度内容。'
      },
      {
        src: '地点详细页-1.png',
        title: '地点详细页 / 深度攻略聚合态',
        desc: '抽屉拉起后的城市垂直精选瀑布流，聚合针对该目的地的不同天数、不同主题方案，支持用户在同一城市维度快速比对。'
      },
      {
        src: '搜索页.png',
        title: '搜索页 / 意图检索与多维筛选',
        desc: '“Hi, 轻旅用户”亲和问候配合当前定位识别，提供热门/推荐/高性价比三大核心决策维度，辅以一键清空的精简历史记录。'
      },
      {
        src: '发布.png',
        title: '发布中心 / 双轨内容沉淀机制',
        desc: '底部弹出抽屉，清晰分离“发布笔记”（感性故事打卡）与“发布行程”（理性结构化模版），确立社区工具型与内容型的双重价值。'
      },
      {
        src: '我的.png',
        title: '个人中心 / 行程资产管理库',
        desc: '以宁静雪景作为情感背书，核心聚合“我的行程”、“我的收藏”与“我的发布”，让用户在行后的沉淀资产井井有条。'
      },
      {
        src: '消息.png',
        title: '消息中心 / 轻量互动与连接',
        desc: '清晰的“聊天”与“通知”分段控制器，保持信息密度适中，支持旅行搭子即时交流与互动反馈。'
      },
      {
        src: '登录页.png',
        title: '登录注册页 / 纯净浮层卡片',
        desc: '悬浮于高原湖泊之上的温润白卡，提供手机验证码、密码与微信快速登入通道，将认证阻力降至最低。'
      }
    ];

    this.currentIndex = 0;
    this.modal = null;
    this.imgEl = null;
    this.titleEl = null;
    this.descEl = null;
    this.counterEl = null;

    this.init();
  }

  init() {
    this.createDom();
    this.bindEvents();
  }

  createDom() {
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '界面设计高清查看器');

    modal.innerHTML = `
      <button class="lightbox-close-btn" aria-label="关闭查看器 (ESC)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button class="lightbox-nav-btn lightbox-prev" aria-label="查看上一张 (方向键左)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="lightbox-nav-btn lightbox-next" aria-label="查看下一张 (方向键右)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      
      <div class="lightbox-content">
        <div class="lightbox-img-wrapper">
          <img src="" alt="" id="lightbox-image" />
        </div>
        <div class="lightbox-caption">
          <div class="lightbox-title" id="lightbox-title"></div>
          <div class="lightbox-desc" id="lightbox-desc"></div>
          <div style="font-size: 11px; color: #64748B; margin-top: 6px;" id="lightbox-counter"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    this.modal = modal;
    this.imgEl = modal.querySelector('#lightbox-image');
    this.titleEl = modal.querySelector('#lightbox-title');
    this.descEl = modal.querySelector('#lightbox-desc');
    this.counterEl = modal.querySelector('#lightbox-counter');
  }

  bindEvents() {
    // 关闭按钮
    this.modal.querySelector('.lightbox-close-btn').addEventListener('click', () => this.close());

    // 上一张/下一张按钮
    this.modal.querySelector('.lightbox-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });
    this.modal.querySelector('.lightbox-next').addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // 点击背景遮罩关闭
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // 键盘事件支持
    window.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // 绑定全站所有具备点击放大意图的图片与卡片
    document.querySelectorAll('[data-lightbox-src]').forEach((el) => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-lightbox-src');
        this.openBySrc(src);
      });
    });
  }

  openBySrc(src) {
    const filename = src.split('/').pop();
    const index = this.images.findIndex((item) => item.src === filename);
    this.open(index !== -1 ? index : 0);
  }

  open(index = 0) {
    this.currentIndex = (index + this.images.length) % this.images.length;
    this.render();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.modal.querySelector('.lightbox-close-btn').focus();
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.render();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.render();
  }

  render() {
    const current = this.images[this.currentIndex];
    this.imgEl.src = current.src;
    this.imgEl.alt = current.title;
    this.titleEl.textContent = current.title;
    this.descEl.textContent = current.desc;
    this.counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length} · 按 ESC 或点击遮罩关闭`;
  }
}

// 挂载到全局
window.Lightbox = Lightbox;
