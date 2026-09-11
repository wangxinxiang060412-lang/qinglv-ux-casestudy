/**
 * 「轻旅」UX Case Study 交互式移动端模拟器驱动引擎
 * 支持多页面状态流转、时间轴联动、AI 对话生成仿真与设计注解同步
 */

class MobileSimulator {
  constructor() {
    this.currentScreen = 'home';
    this.activeDay = 1;
    this.aiState = 'initial'; // initial | chatting | generated

    // 界面设计元数据（驱动右侧检视器）
    this.screenMetadata = {
      home: {
        name: '首页 / 决策型双列瀑布流',
        tag: '核心入口 · 灵感发现',
        badges: ['决策标签前置', 'AI 方案透出', '双列轻瀑布'],
        intent: '解决年轻人“想出去玩但不知道去哪、不知道玩几天”的迷茫。在封面卡片直接外显“规划时间 2-3天”与“AI智能规划”标识，使用户无需逐个点击长文，即可根据个人休假时长快速筛选目标。',
        interactions: [
          '点击热门目的地横滑卡片查看城市',
          '点击“在大连看到了最美的晚霞”卡片，即刻进入结构化时间轴详情页',
          '点击顶部搜索图标快速进入搜索意图页',
          '在模拟器内可垂直平滑滚动浏览更多精选卡片'
        ],
        tradeoff: '放弃了传统旅游 App 密密麻麻的金刚区（机票、酒店、火车票），专注于为年轻人提供纯净的“轻决策”环境。'
      },
      ai: {
        name: 'AI 智能行程定制助理',
        tag: '核心亮点 · AIGC 闭环',
        badges: ['自然语言理解', '结构化输出', '零学习门槛'],
        intent: '年轻人极度反感花费数小时整合零碎游记。轻旅 AI 助理通过结构化提示词，将用户的一句话需求（例如“杭州3天学生平价游”）在数秒内拆解为时间、预算、餐饮、景点的时段化清单。',
        interactions: [
          '点击下方的推荐提示词气泡（如“杭州3天学生平价游”）触发仿真对话',
          '观察 AI 智能提取标签并生成结构化多日行程卡片',
          '点击生成卡片底部的“查看完整时间轴”直接联动至详情页'
        ],
        tradeoff: '不采用宽泛无边的开放聊天机器人，而是强约束对话目标为“行程规划”，确保每次回答都是高密度、可执行的清单。'
      },
      detail: {
        name: '卡片详情页 / 结构化时间轴系统',
        tag: '核心突破 · 行程执行层',
        badges: ['时钟绝对时间', '分类语义图标', '多日快速切换'],
        intent: '全产品最关键的体验革命：将传统“长篇游记”彻底重塑为“可执行清单”。使用 08:00、09:00、12:00 时钟时间刻度，搭配早餐、景点、午餐图标，用户在旅途中一秒扫过即可掌握下一步行动。',
        interactions: [
          '点击顶部的【第一天】/【第二天】/【第三天】标签切换不同日程',
          '点击时间轴任意节点卡片（如“08:00 早餐”），可展开/收起避坑贴士与人均推荐',
          '点击左上角返回箭头 ‹ 回到首页瀑布流'
        ],
        tradeoff: '采用时钟节点而非相对时长（如“玩2小时”），因为年轻人在实际出游中极易受早起、用餐时间影响，绝对时钟能带来更强的确定感与掌控感。'
      },
      search: {
        name: '搜索页 / 意图检索与多维筛选',
        tag: '效率模块 · 意图漏斗',
        badges: ['当前定位识别', '热门维度分流', '一键清空历史'],
        intent: '结合当前所在城市（如“杭州”）提供就近周边推荐，并外置“热门”、“推荐”、“高性价比”三大年轻人最关注的价值标签，形成清晰的高频筛选漏斗。',
        interactions: [
          '点击“热门 / 推荐 / 高性价比”分类标签切换高亮',
          '点击搜索历史中的“杭州三日游”等标签快速触发联想',
          '点击右侧“清空”可清空搜索历史记录'
        ],
        tradeoff: '取消繁琐的多层嵌套级联筛选器，仅保留最核心的三大决策维度。'
      },
      explore: {
        name: '地点详细页 / 城市全景探索态',
        tag: '空间层次 · 城市认知',
        badges: ['地图足迹背书', '底部抽屉上滑', '同好信任感'],
        intent: '通过轻量级地图底图确立地理空间认知，结合“超999+旅行者探索过此地”建立同龄人背书。底部抽屉支持上滑展开，提供该城市的深度玩法聚合。',
        interactions: [
          '点击“上滑查看大理深度攻略”按钮，体验抽屉拉起与内容聚合',
          '点击左上角返回回到探索入口'
        ],
        tradeoff: '地图不采用复杂缩放重交互，仅作为空间背景衬托，保证首屏视觉轻快不卡顿。'
      },
      explore_expanded: {
        name: '地点详细页 / 深度攻略聚合态',
        tag: '空间层次 · 深度聚合',
        badges: ['城市垂直分类', '天数比对', 'AI 定制集合'],
        intent: '当用户明确锁定某个城市（如大理）后，抽屉完全拉起，呈现“爬完苍山一定要吃的”、“苍山雪景”等多维路线，满足深度比对诉求。',
        interactions: [
          '浏览大理垂直攻略卡片',
          '点击收起抽屉回到城市全景态'
        ],
        tradeoff: '将城市攻略收纳于抽屉中，既保留了城市封面的开阔美感，又兼顾了内容沉浸度。'
      },
      publish: {
        name: '发布中心 / 双轨内容沉淀机制',
        tag: 'UGC 闭环 · 工具与社区',
        badges: ['双轨分离', '理性行程沉淀', '感性灵感分享'],
        intent: '普通旅行软件只让用户“发图文”，导致游记混乱无章。「轻旅」通过底层分离“发布笔记”（感性打卡）与“发布行程”（结构化模板），激励用户把真实走过的路线转为结构化资产贡献给社区。',
        interactions: [
          '点击“发布笔记”或“发布行程”体验选择反馈',
          '点击“取消”按钮收起底部半浮层模态框'
        ],
        tradeoff: '在发布入口做分类引导，比在发布后再让用户选择标签更加直观自然。'
      },
      messages: {
        name: '消息中心 / 轻量互动与连接',
        tag: '社群承接 · 社交闭环',
        badges: ['分段控制器', '即时反馈', '搭子沟通'],
        intent: '为寻找旅行搭子、询问行程细节提供即时沟通渠道。顶部“聊天”与“通知”清晰分流，保持轻量克制。',
        interactions: [
          '在“聊天”与“通知”选项卡间切换',
          '点击会话列表项查看未读状态变化'
        ],
        tradeoff: '不做复杂的社群动态圈子，仅保留一对一与系统通知，避免信息过载。'
      },
      profile: {
        name: '个人中心 / 行程资产管理库',
        tag: '用户资产 · 价值留存',
        badges: ['我的行程归档', '情感化背景', '收藏整理'],
        intent: '承接用户在整个生命周期中保存的路线资产。核心突出“我的行程”，让行前规划好的时间轴随时可调取。',
        interactions: [
          '查看“我的行程”、“我的收藏”入口',
          '浏览已发布的足迹与社区获赞情况'
        ],
        tradeoff: '将“我的行程”提升至高于“设置”的一级重要位置，凸显工具属性。'
      },
      splash: {
        name: '初始页 / 品牌定位呈现',
        tag: '品牌定调 · 视觉开篇',
        badges: ['大字排版', '天青色调', '一键直达'],
        intent: '以机翼与云海为背景，以高对比粗体呈现“专注于年轻人的轻旅行”，第一时间确立品牌定位与纯净气质。',
        interactions: [
          '点击下方“开始探索”按钮直接进入首页推荐'
        ],
        tradeoff: '取消多页漫长轮播，单屏直击品牌主张，减少用户启动阻力。'
      },
      login: {
        name: '登录注册页 / 纯净浮层卡片',
        tag: '辅助链路 · 极简认证',
        badges: ['微距投影', '验证码/密码双模', '低干扰'],
        intent: '采用浮层白卡置于模糊风景之上的层次结构，提供手机号与微信快捷登录，将表单输入阻力降至最低。',
        interactions: [
          '在密码登录与验证码登录之间切换',
          '查看微信一键授权通道'
        ],
        tradeoff: '不强制首次打开即登录，用户可无门槛浏览，仅在收藏与发布时轻量拉起。'
      }
    };

    // 时间轴多日模拟数据 (用于详情页)
    this.timelineData = {
      1: {
        day: '第一天',
        subtitle: '滨海漫步与城市初印象',
        nodes: [
          {
            time: '08:00',
            icon: '☕',
            title: '特色海鲜早餐',
            desc: '品尝大连特色海菜包子、现磨豆腐脑，感受本地清晨市井风味。',
            tip: '推荐：天津街老字号包子铺，人均 15 元，避开 8:30 上班高峰。'
          },
          {
            time: '09:00',
            icon: '📍',
            title: '星海广场 & 滨海步道',
            desc: '打卡亚洲最大城市广场，参观华表雕塑与百年城雕，吹着海风漫步。',
            tip: '广场旁有成群海鸥，可提前在便利店备好面包喂食，拍照极佳。'
          },
          {
            time: '12:00',
            icon: '🍽️',
            title: '星海公园海鲜小炒',
            desc: '星海公园附近尝鲅鱼水饺、海肠捞饭与辣炒杂色蛤。',
            tip: '推荐靠窗海景位，大连本地烹饪注重保留海味鲜甜，无需过多调料。'
          },
          {
            time: '14:30',
            icon: '🌊',
            title: '跨海大桥观景台',
            desc: '俯瞰横跨洋面的星海湾跨海大桥，壮阔桥身与湛蓝海水交相辉映。',
            tip: '可乘坐复古 201 路电车前往，感受百年轨道列车的慢生活。'
          },
          {
            time: '18:30',
            icon: '🌅',
            title: '莲花山日落晚霞',
            desc: '登上海拔最高观景点，俯瞰整座城市入夜前的粉紫晚霞。',
            tip: '日落黄金半小时在 18:40 左右，建议提前 20 分钟抢占东侧露台。'
          }
        ]
      },
      2: {
        day: '第二天',
        subtitle: '复古电车与森林山海',
        nodes: [
          {
            time: '08:30',
            icon: '☕',
            title: '晨光咖啡与烘焙',
            desc: '南山旅游风情街小憩，感受日俄结合风情建筑与静谧林荫。',
            tip: '街区坡度较大，建议穿着轻便平底运动鞋。'
          },
          {
            time: '10:00',
            icon: '🚃',
            title: '201 路百年有轨电车',
            desc: '木质内饰的叮叮车穿梭在现代街市中，带来穿越时空的奇妙交织感。',
            tip: '票价仅 2 元，上车投币或刷码，建议坐在车厢前排拍摄驾驶室轨道。'
          },
          {
            time: '12:30',
            icon: '🍽️',
            title: '渔人码头海边简餐',
            desc: '彩色欧式建筑群旁享用海鲜意面与烤生蚝，伴随归航渔船汽笛。',
            tip: '临港木栈道常有艺术家写生，氛围舒适安逸。'
          },
          {
            time: '15:00',
            icon: '🌲',
            title: '棒棰岛国宾景区',
            desc: '三面环山、一面濒海，青松翠柏与清澈见底的鹅卵石滩。',
            tip: '海水极清，但滩头多为圆卵石，下海踩水注意防滑。'
          }
        ]
      },
      3: {
        day: '第三天',
        subtitle: '东港夜色与离别手信',
        nodes: [
          {
            time: '09:00',
            icon: '☕',
            title: '港东五街看大船',
            desc: '尽头是无垠大海与缓缓驶过的巨型客轮，大连近年最火机位。',
            tip: '客轮通过时间通常为上午 10:30~11:00，提前看好船期表。'
          },
          {
            time: '12:00',
            icon: '🍽️',
            title: '大连海鲜老菜馆',
            desc: '地道鲁菜海派风味：熘鱼片、三鲜焖子、樱桃肉。',
            tip: '焖子外焦里嫩配浓麻酱，是大连极具代表性的非遗小吃。'
          },
          {
            time: '14:30',
            icon: '🛍️',
            title: '大连美术馆与伴手礼采买',
            desc: '购买大连特色海产干货与明信片，为周末旅程画上句号。',
            tip: '行程归档，可一键在轻旅将此时间轴生成专属行程长图。'
          }
        ]
      }
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateClock();
    setInterval(() => this.updateClock(), 30000);
    this.renderInspector();
  }

  updateClock() {
    const timeEl = document.querySelector('.sim-time');
    if (!timeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }

  bindEvents() {
    // 1. 底栏导航点击事件
    document.querySelectorAll('.sim-nav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-sim-target');
        if (target === 'publish') {
          this.openPublishModal();
        } else if (target) {
          this.switchScreen(target);
        }
      });
    });

    // 2. 发布模态框取消
    const cancelBtn = document.querySelector('.sim-publish-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closePublishModal());
    }

    const modalBackdrop = document.querySelector('.sim-publish-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closePublishModal();
        }
      });
    }

    // 3. 发布选项点击体验
    document.querySelectorAll('.sim-publish-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const type = opt.getAttribute('data-pub-type');
        this.closePublishModal();
        this.showToast(`已开启「${type === 'itinerary' ? '发布行程' : '发布笔记'}」结构化编辑器`);
      });
    });

    // 4. 侧边快捷切换按钮
    document.querySelectorAll('.switch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const screen = btn.getAttribute('data-screen');
        if (screen) {
          this.switchScreen(screen);
        }
      });
    });

    // 5. 首页瀑布流卡片点击 -> 进详情页
    const dalianCard = document.querySelector('[data-sim-action="open-detail"]');
    if (dalianCard) {
      dalianCard.addEventListener('click', () => {
        this.switchScreen('detail');
      });
    }

    // 6. 首页顶部搜索按钮 -> 进搜索页
    const searchIcon = document.querySelector('[data-sim-action="open-search"]');
    if (searchIcon) {
      searchIcon.addEventListener('click', () => {
        this.switchScreen('search');
      });
    }

    // 7. 详情页返回按钮
    const backBtn = document.querySelector('[data-sim-action="back-home"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.switchScreen('home');
      });
    }

    // 8. 详情页 Day 1 / 2 / 3 切换
    document.querySelectorAll('.day-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const day = parseInt(btn.getAttribute('data-day'), 10);
        this.switchDay(day);
      });
    });

    // 9. 时间轴节点折叠展开
    this.bindTimelineAccordion();

    // 10. AI 提示词快捷气泡点击
    document.querySelectorAll('.ai-prompt-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const promptText = chip.getAttribute('data-prompt');
        this.runAiSimulation(promptText);
      });
    });

    // 11. 探索页抽屉上滑展开/收起切换
    const exploreToggle = document.querySelector('[data-sim-action="toggle-explore-drawer"]');
    if (exploreToggle) {
      exploreToggle.addEventListener('click', () => {
        if (this.currentScreen === 'explore') {
          this.switchScreen('explore_expanded');
        } else {
          this.switchScreen('explore');
        }
      });
    }

    // 12. 搜索页历史记录清除
    const clearHistoryBtn = document.querySelector('.sim-clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        const historyContainer = document.querySelector('.sim-history-tags');
        if (historyContainer) {
          historyContainer.innerHTML = '<span style="font-size:12px; color:#94a3b8;">暂无历史记录</span>';
          this.showToast('已清空搜索历史');
        }
      });
    }

    // 13. 初始页“开始探索”按钮 -> 进首页
    const startExploreBtn = document.querySelector('[data-sim-action="start-explore"]');
    if (startExploreBtn) {
      startExploreBtn.addEventListener('click', () => {
        this.switchScreen('home');
      });
    }
  }

  bindTimelineAccordion() {
    document.querySelectorAll('.timeline-node').forEach((node) => {
      node.addEventListener('click', () => {
        node.classList.toggle('expanded');
      });
    });
  }

  switchScreen(screenName) {
    if (!this.screenMetadata[screenName]) return;
    this.currentScreen = screenName;

    // 1. 隐藏所有页面，激活目标页面
    document.querySelectorAll('.sim-page').forEach((page) => {
      page.classList.remove('active');
    });

    const targetPage = document.querySelector(`.sim-page[data-page="${screenName}"]`);
    if (targetPage) {
      targetPage.classList.add('active');
      // 滚动置顶
      const viewport = document.querySelector('.sim-viewport');
      if (viewport) viewport.scrollTop = 0;
    }

    // 2. 更新模拟器底栏状态
    document.querySelectorAll('.sim-nav-btn').forEach((btn) => {
      btn.classList.remove('active');
      const target = btn.getAttribute('data-sim-target');
      if (target === screenName || 
         (screenName === 'detail' && target === 'home') || 
         (screenName === 'search' && target === 'home') ||
         (screenName.startsWith('explore') && target === 'home')) {
        if (target !== 'publish') {
          btn.classList.add('active');
        }
      }
    });

    // 3. 更新快捷切换按钮高亮
    document.querySelectorAll('.switch-btn').forEach((btn) => {
      if (btn.getAttribute('data-screen') === screenName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 4. 更新右侧检视器内容
    this.renderInspector();
  }

  switchDay(dayNum) {
    this.activeDay = dayNum;
    document.querySelectorAll('.day-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-day'), 10) === dayNum);
    });

    const timelineContainer = document.querySelector('.timeline-items-list');
    if (!timelineContainer) return;

    const data = this.timelineData[dayNum];
    if (!data) return;

    let html = '';
    data.nodes.forEach((node, idx) => {
      html += `
        <div class="timeline-node ${idx === 0 ? 'expanded' : ''}" role="button" tabindex="0">
          <div class="timeline-node-header">
            <div style="display:flex; align-items:center;">
              <span class="node-time-badge">${node.icon} ${node.time}</span>
              <span class="node-title">${node.title}</span>
            </div>
            <span class="node-chevron">▼</span>
          </div>
          <p style="font-size:12px; color:#475569; margin-top:6px; line-height:1.4;">${node.desc}</p>
          <div class="node-details">
            <strong style="color:#0E7490;">出行贴士：</strong>${node.tip}
          </div>
        </div>
      `;
    });

    timelineContainer.innerHTML = html;
    this.bindTimelineAccordion();
  }

  runAiSimulation(promptText) {
    const userBubble = document.querySelector('.ai-bubble-user');
    const resultCard = document.querySelector('.ai-generated-card');
    if (!userBubble || !resultCard) return;

    userBubble.textContent = promptText;
    userBubble.classList.add('show');

    // 模拟等待 500ms 后展示生成卡片
    setTimeout(() => {
      resultCard.classList.add('show');
      const viewport = document.querySelector('.sim-viewport');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }, 450);
  }

  openPublishModal() {
    const modal = document.querySelector('.sim-publish-modal');
    if (modal) modal.classList.add('active');
  }

  closePublishModal() {
    const modal = document.querySelector('.sim-publish-modal');
    if (modal) modal.classList.remove('active');
  }

  renderInspector() {
    const meta = this.screenMetadata[this.currentScreen];
    if (!meta) return;

    const nameEl = document.querySelector('.inspector-screen-name');
    const tagEl = document.querySelector('.inspector-tag');
    const badgesContainer = document.querySelector('.inspector-badge-row');
    const intentEl = document.querySelector('.inspector-text');
    const pointsContainer = document.querySelector('.inspector-points');
    const tradeoffEl = document.querySelector('.inspector-tradeoff');

    if (nameEl) nameEl.textContent = meta.name;
    if (tagEl) tagEl.textContent = meta.tag;

    if (badgesContainer) {
      badgesContainer.innerHTML = meta.badges
        .map((b) => `<span class="inspector-mini-badge">${b}</span>`)
        .join('');
    }

    if (intentEl) intentEl.textContent = meta.intent;

    if (pointsContainer) {
      pointsContainer.innerHTML = meta.interactions
        .map((p) => `<li>${p}</li>`)
        .join('');
    }

    if (tradeoffEl) tradeoffEl.textContent = meta.tradeoff;
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
}

// 挂载到全局
window.MobileSimulator = MobileSimulator;
