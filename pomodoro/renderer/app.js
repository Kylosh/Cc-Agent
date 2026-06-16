// 番茄时钟状态
const MODES = {
  focus:  { label: '专注时间', seconds: 25 * 60, tab: '专注' },
  short:  { label: '短休息',   seconds: 5 * 60,  tab: '短休息' },
  long:   { label: '长休息',   seconds: 15 * 60, tab: '长休息' },
};

let state = {
  mode: 'focus',
  remaining: MODES.focus.seconds,
  total: MODES.focus.seconds,
  running: false,
  pomodorosToday: 0,  // 今日完成番茄数（周期内）
  cycleCount: 0,      // 本轮完成番茄数（决定何时长休息）
  tasks: [],
  activeTaskId: null,
};

let timer = null;

// DOM refs
const display     = document.getElementById('timer-display');
const label       = document.getElementById('timer-label');
const ring        = document.getElementById('ring-progress');
const dots        = document.querySelectorAll('.dot');
const btnStart    = document.getElementById('btn-start');
const btnReset    = document.getElementById('btn-reset');
const btnSkip     = document.getElementById('btn-skip');
const taskInput   = document.getElementById('task-input');
const btnAddTask  = document.getElementById('btn-add-task');
const taskList    = document.getElementById('task-list');
const tasksCount  = document.getElementById('tasks-count');
const modeTabs    = document.querySelectorAll('.mode-tab');
const btnMinimize = document.getElementById('btn-minimize');
const btnClose    = document.getElementById('btn-close');

// 圆环周长 = 2πr = 2π*88 ≈ 553
const CIRCUMFERENCE = 2 * Math.PI * 88;

// ── 持久化 ──────────────────────────────────────────────
function save() {
  localStorage.setItem('pomodoro_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('pomodoro_active', state.activeTaskId || '');
  localStorage.setItem('pomodoro_cycle', String(state.cycleCount));
  localStorage.setItem('pomodoro_today', String(state.pomodorosToday));
}

function load() {
  try {
    state.tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
    state.activeTaskId = localStorage.getItem('pomodoro_active') || null;
    state.cycleCount = parseInt(localStorage.getItem('pomodoro_cycle') || '0', 10);
    state.pomodorosToday = parseInt(localStorage.getItem('pomodoro_today') || '0', 10);
  } catch { state.tasks = []; }
}

// ── 音效（Web Audio API）────────────────────────────────
function playSound(type) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'done') {
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(); osc.stop(ctx.currentTime + 0.6);
  } else {
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  }
}

// ── 渲染计时器 ────────────────────────────────────────────
function renderTimer() {
  const m = String(Math.floor(state.remaining / 60)).padStart(2, '0');
  const s = String(state.remaining % 60).padStart(2, '0');
  display.textContent = `${m}:${s}`;
  label.textContent = MODES[state.mode].label;

  const progress = state.remaining / state.total;
  ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const isRest = state.mode !== 'focus';
  ring.classList.toggle('rest', isRest);

  document.title = `${m}:${s} — ${MODES[state.mode].label}`;
}

function renderDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('done', i < (state.cycleCount % 4));
  });
}

function renderModeTabs() {
  modeTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === state.mode);
  });
}

function renderStartBtn() {
  btnStart.textContent = state.running ? '暂停' : '开始';
  btnStart.classList.toggle('running', state.running);
}

// ── 计时器逻辑 ────────────────────────────────────────────
function tick() {
  if (state.remaining <= 0) {
    onTimerEnd();
    return;
  }
  state.remaining--;
  renderTimer();
}

function onTimerEnd() {
  clearInterval(timer);
  timer = null;
  state.running = false;
  renderStartBtn();
  playSound('done');

  if (state.mode === 'focus') {
    state.cycleCount++;
    state.pomodorosToday++;
    // 给当前任务加番茄数
    if (state.activeTaskId) {
      const task = state.tasks.find(t => t.id === state.activeTaskId);
      if (task) { task.done_count = (task.done_count || 0) + 1; }
    }
    save();
    renderDots();
    renderTasks();

    const nextMode = state.cycleCount % 4 === 0 ? 'long' : 'short';
    const msg = nextMode === 'long' ? '完成4个番茄！该好好休息15分钟了。' : '专注完成！休息5分钟。';
    window.electronAPI?.notify('番茄时钟', msg);
    switchMode(nextMode);
  } else {
    window.electronAPI?.notify('番茄时钟', '休息结束，开始新的专注！');
    switchMode('focus');
  }
}

function switchMode(mode) {
  clearInterval(timer);
  timer = null;
  state.running = false;
  state.mode = mode;
  state.remaining = MODES[mode].seconds;
  state.total = MODES[mode].seconds;
  renderTimer();
  renderModeTabs();
  renderStartBtn();
}

function startPause() {
  if (state.running) {
    clearInterval(timer);
    timer = null;
    state.running = false;
  } else {
    state.running = true;
    timer = setInterval(tick, 1000);
    playSound('tick');
  }
  renderStartBtn();
}

function reset() {
  clearInterval(timer);
  timer = null;
  state.running = false;
  state.remaining = MODES[state.mode].seconds;
  renderTimer();
  renderStartBtn();
}

// ── 任务管理 ──────────────────────────────────────────────
function addTask(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  state.tasks.push({
    id: Date.now().toString(),
    name: trimmed,
    done_count: 0,
    completed: false,
  });
  save();
  renderTasks();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.activeTaskId === id) state.activeTaskId = null;
  save();
  renderTasks();
}

function toggleTaskDone(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) { task.completed = !task.completed; }
  save();
  renderTasks();
}

function selectTask(id) {
  state.activeTaskId = state.activeTaskId === id ? null : id;
  save();
  renderTasks();
}

function renderTasks() {
  const active = state.tasks.filter(t => !t.completed);
  const done = state.tasks.filter(t => t.completed);
  const sorted = [...active, ...done];

  tasksCount.textContent = `${active.length} 个任务`;

  if (sorted.length === 0) {
    taskList.innerHTML = '<li class="empty-tip">暂无任务，添加一个开始专注吧</li>';
    return;
  }

  taskList.innerHTML = sorted.map(task => `
    <li class="task-item ${task.completed ? 'done' : ''} ${state.activeTaskId === task.id ? 'active' : ''}"
        data-id="${task.id}">
      <div class="task-check" data-action="check" data-id="${task.id}"></div>
      <span class="task-name">${escapeHtml(task.name)}</span>
      <div class="task-tomatoes">
        <span class="tomato-icon">🍅</span>
        <span>${task.done_count || 0}</span>
      </div>
      <button class="task-del" data-action="delete" data-id="${task.id}" title="删除">✕</button>
    </li>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── 事件绑定 ──────────────────────────────────────────────
btnStart.addEventListener('click', startPause);
btnReset.addEventListener('click', reset);
btnSkip.addEventListener('click', () => {
  const modes = ['focus', 'short', 'long'];
  const next = modes[(modes.indexOf(state.mode) + 1) % modes.length];
  switchMode(next);
});

modeTabs.forEach(tab => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

btnAddTask.addEventListener('click', () => {
  addTask(taskInput.value);
  taskInput.value = '';
});

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
    taskInput.value = '';
  }
});

taskList.addEventListener('click', e => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (action === 'delete') { deleteTask(id); return; }
  if (action === 'check')  { toggleTaskDone(id); return; }
  // 点击任务行选中
  const item = e.target.closest('.task-item');
  if (item) selectTask(item.dataset.id);
});

btnMinimize.addEventListener('click', () => window.electronAPI?.minimizeWindow());
btnClose.addEventListener('click', () => window.electronAPI?.closeWindow());

// ── 初始化 ────────────────────────────────────────────────
load();
renderTimer();
renderDots();
renderModeTabs();
renderStartBtn();
renderTasks();
