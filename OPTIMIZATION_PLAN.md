# FruitHub index.html 完整优化方案

## 📋 概览
本方案从**可访问性、性能、代码质量、UX** 四个维度全面优化 FruitHub 首页。

---

## 第一部分：可访问性改进（优先级 ⭐⭐⭐⭐⭐）

### 1.1 ARIA 属性增强

**购物车侧栏 - 转换为 dialog role**
```html
<!-- 修改前 -->
<div class="cart-sidebar" id="cartSidebar">

<!-- 修改后 -->
<aside 
    id="cartSidebar"
    class="cart-sidebar"
    role="dialog"
    aria-labelledby="cartTitle"
    aria-modal="true"
    aria-hidden="true">
    <div class="cart-header">
        <h2 id="cartTitle">购物车</h2>
        <!-- ... -->
    </div>
```

**按钮 aria-label 标准化**
```html
<!-- 购物车按钮 -->
<button 
    class="cart-btn" 
    aria-label="打开购物车，当前有 0 件商品"
    aria-expanded="false"
    aria-controls="cartSidebar"
    onclick="toggleCart()">
    🛒
    <span class="cart-badge" id="cartBadge" aria-live="polite" aria-atomic="true">0</span>
</button>

<!-- 购物车关闭按钮 -->
<button 
    class="cart-close" 
    aria-label="关闭购物车"
    onclick="toggleCart()">✕</button>

<!-- 数量调整按钮 -->
<button 
    class="qty-btn" 
    aria-label="减少商品数量"
    onclick="updateQty(${idx}, -1)">−</button>
<button 
    class="qty-btn" 
    aria-label="增加商品数量"
    onclick="updateQty(${idx}, 1)">+</button>

<!-- 删除按钮 -->
<button 
    class="remove-btn" 
    aria-label="从购物车删除 ${item.name}"
    onclick="removeFromCart(${idx})">🗑️</button>
```

**表单可访问性**
```html
<!-- 登录表单 -->
<form id="loginForm" class="modal-content">
    <button 
        class="modal-close" 
        aria-label="关闭登录对话框"
        onclick="closeLoginModal()">✕</button>
    
    <h2 id="loginModalTitle" class="modal-header">登录 / 注册</h2>
    
    <div class="form-group">
        <label for="email">邮箱</label>
        <input 
            type="email" 
            id="email" 
            placeholder="输入你的邮箱"
            aria-describedby="emailError"
            required>
        <span id="emailError" class="error-message" role="alert"></span>
    </div>
    
    <div class="form-group">
        <label for="password">密码</label>
        <input 
            type="password" 
            id="password" 
            placeholder="输入密码"
            aria-describedby="passwordError"
            required>
        <span id="passwordError" class="error-message" role="alert"></span>
    </div>
    
    <button class="submit-btn" type="submit">登录</button>
</form>
```

**购物车通知区域**
```html
<!-- 添加专用的 aria-live region 用于实时通知 -->
<div 
    id="notificationArea"
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
    role="status"></div>
```

---

### 1.2 语义 HTML 结构优化

**导航结构**
```html
<!-- 修改前：普通 div + onclick -->
<nav>
    <a onclick="scrollTo('products')">产品</a>

<!-- 修改后：使用 <nav> 和 <button>/<a> -->
<nav role="navigation" aria-label="主导航">
    <ul>
        <li><a href="#products" data-scroll>产品</a></li>
        <li><a href="#about" data-scroll>关于</a></li>
        <li><button aria-label="联系我们" onclick="showContactInfo()">联系</button></li>
    </ul>
</nav>
```

**主内容区域**
```html
<!-- 使用 <main> 包裹主要内容 -->
<main>
    <!-- Hero section -->
    <section class="hero" id="top" aria-label="欢迎区域">
        <div class="hero-content">
            <h1>新鲜水果，送到你家</h1>
            <p>精选优质水果，每日配送，品质保证</p>
            <button class="btn btn-primary" aria-label="跳转到产品列表进行购物">立即购买</button>
        </div>
    </section>

    <!-- 产品区 -->
    <section class="container" id="products" aria-labelledby="productsTitle">
        <h2 id="productsTitle" class="section-title">热销产品</h2>
        <div class="products-grid" role="region" aria-label="产品网格">
            <!-- 产品卡片 -->
            <article class="product-card" aria-labelledby="productName-1">
                <div class="product-image apple" aria-hidden="true">🍎</div>
                <div class="product-info">
                    <h3 id="productName-1" class="product-name">新鲜苹果</h3>
                    <p class="product-description">富士苹果，甜度高，口感爽脆</p>
                    <div class="product-price">¥29.9</div>
                    <div class="rating" aria-label="评分 4.8 星，共 5 星">⭐⭐⭐⭐⭐ 4.8分</div>
                    <button 
                        class="add-btn" 
                        aria-label="将新鲜苹果 ¥29.9 加入购物车"
                        onclick="addToCart('新鲜苹果', 29.9)">加入购物车</button>
                </div>
            </article>
        </div>
    </section>

    <!-- 功能特性区 -->
    <section class="container" id="about" aria-labelledby="featuresTitle">
        <h2 id="featuresTitle" class="section-title">为什么选择我们</h2>
        <div class="features">
            <article class="feature">
                <div class="feature-icon" aria-hidden="true">🚚</div>
                <h3>快速配送</h3>
                <p>下单后24小时内送达，确保水果新鲜</p>
            </article>
        </div>
    </section>
</main>
```

**Footer 语义化**
```html
<footer role="contentinfo" aria-label="网站页脚">
    <p>&copy; 2026 FruitHub. All rights reserved.</p>
    <nav aria-label="页脚链接">
        <a href="#privacy">隐私政策</a> | 
        <a href="#terms">服务条款</a>
    </nav>
</footer>
```

---

### 1.3 焦点管理

**模态框焦点陷阱**
```javascript
// ModalManager.js 中实现
class ModalManager {
    constructor(modalElement) {
        this.modal = modalElement;
        this.focusableElements = [
            'button', 'a', 'input', 'textarea', 'select'
        ].map(tag => tag + ':not([disabled])');
    }

    // 获取焦点陷阱范围内的可聚焦元素
    getFocusableElements() {
        return Array.from(
            this.modal.querySelectorAll(this.focusableElements.join(','))
        ).filter(el => el.offsetParent !== null); // 仅可见元素
    }

    open() {
        this.modal.setAttribute('aria-hidden', 'false');
        this.previousFocus = document.activeElement;
        
        // 设置初始焦点到第一个输入框
        const firstInput = this.modal.querySelector('input, button[type="submit"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        this.modal.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    close() {
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.removeEventListener('keydown', this.handleKeyDown.bind(this));
        
        // 恢复焦点
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }

        // Tab 焦点陷阱
        if (e.key === 'Tab') {
            const focusable = this.getFocusableElements();
            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
}
```

---

### 1.4 键盘导航完全支持

**导航快捷键**
```javascript
// KeyboardManager.js
class KeyboardManager {
    constructor() {
        this.handlers = {
            'Enter': this.handleEnter.bind(this),
            'Space': this.handleSpace.bind(this),
            'Escape': this.handleEscape.bind(this),
            'ArrowUp': this.handleArrowUp.bind(this),
            'ArrowDown': this.handleArrowDown.bind(this)
        };
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        if (this.handlers[e.key]) {
            this.handlers[e.key](e);
        }
    }

    handleEnter(e) {
        if (e.target.matches('a[data-scroll], button')) {
            e.target.click();
        }
    }

    handleSpace(e) {
        if (e.target.matches('button')) {
            e.preventDefault();
            e.target.click();
        }
    }

    handleEscape(e) {
        // 关闭打开的模态框/购物车
        if (document.getElementById('cartSidebar').classList.contains('open')) {
            toggleCart();
            e.preventDefault();
        }
        if (document.getElementById('loginModal').classList.contains('open')) {
            closeLoginModal();
            e.preventDefault();
        }
    }

    handleArrowUp(e) {
        // 在产品列表中上下导航
        if (e.target.closest('.product-card')) {
            e.preventDefault();
            const current = e.target.closest('.product-card');
            const prev = current.previousElementSibling;
            if (prev) prev.querySelector('button').focus();
        }
    }

    handleArrowDown(e) {
        if (e.target.closest('.product-card')) {
            e.preventDefault();
            const current = e.target.closest('.product-card');
            const next = current.nextElementSibling;
            if (next) next.querySelector('button').focus();
        }
    }
}
```

---

### 1.5 屏幕阅读器优化

**使用 aria-live 替代 alert**
```javascript
class NotificationManager {
    constructor() {
        this.liveRegion = document.getElementById('notificationArea');
    }

    show(message, type = 'polite') {
        // type: 'polite' | 'assertive'
        this.liveRegion.setAttribute('aria-live', type);
        this.liveRegion.textContent = message;
        
        // 3秒后清空
        setTimeout(() => {
            this.liveRegion.textContent = '';
        }, 3000);
    }

    success(itemName) {
        this.show(`✅ ${itemName} 已添加到购物车`, 'polite');
    }

    error(message) {
        this.show(`⚠️ 错误: ${message}`, 'assertive');
    }

    info(message) {
        this.show(message, 'polite');
    }
}
```

**隐藏装饰性内容**
```html
<!-- 装饰性 emoji 和图标应该隐藏 -->
<div class="product-image apple" aria-hidden="true">🍎</div>
<div class="feature-icon" aria-hidden="true">🚚</div>
<div class="hero::before" aria-hidden="true"></div>

<!-- 但信息性内容需要被读取 -->
<span class="cart-badge" aria-label="购物车中有 3 件商品">3</span>
```

---

## 第二部分：性能优化

### 2.1 样式提取与优化

当前问题：
- 内联 JavaScript 创建的 style 标签（第 540-542 行）
- 动画定义重复
- 没有使用 CSS 变量充分

改进方案：
```css
/* 在 <style> 块中添加 */

/* 动画定义 - 集中管理 */
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

/* 通知样式 */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    z-index: 200;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
}

.notification.error {
    background: #ff3b30;
}

/* 屏幕阅读器专用 - 隐藏但保留可访问性 */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* 焦点可见样式 */
button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 3px solid var(--primary);
    outline-offset: 2px;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
    :root {
        --primary: #0a84ff;
        --text: #f5f5f7;
        --text-light: #a1a1a6;
        --secondary: #424245;
    }
    
    body { background: #000; }
    header { background: rgba(0, 0, 0, 0.95); }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 2.2 JavaScript 模块化

从单个 `<script>` 块分解为模块：

```
/modules
  ├── cart-manager.js       (购物车逻辑)
  ├── modal-manager.js      (模态框管理)
  ├── notification-manager.js (通知系统)
  ├── keyboard-manager.js   (键盘导航)
  ├── utils.js              (工具函数)
  └── app.js                (入口文件)
```

### 2.3 事件委托

**问题代码**
```javascript
// 每个按钮都绑定事件处理器，低效
cart.map((item, idx) => `
    <button onclick="updateQty(${idx}, -1)">−</button>
`)
```

**改进方案**
```javascript
class CartManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 单个事件监听器 + 事件委托
        this.container.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e) {
        if (e.target.classList.contains('qty-btn')) {
            const idx = e.target.dataset.index;
            const change = e.target.textContent === '−' ? -1 : 1;
            this.updateQty(idx, change);
        } else if (e.target.classList.contains('remove-btn')) {
            const idx = e.target.dataset.index;
            this.removeFromCart(idx);
        }
    }

    render() {
        return cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" data-index="${idx}" aria-label="减少">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-index="${idx}" aria-label="增加">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-index="${idx}" aria-label="删除">🗑️</button>
            </div>
        `).join('');
    }
}
```

### 2.4 防抖搜索和滚动

```javascript
// utils.js
export function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// 使用
class ScrollManager {
    constructor() {
        window.addEventListener(
            'scroll',
            debounce(this.handleScroll.bind(this), 200)
        );
    }

    handleScroll() {
        // 处理滚动逻辑，例如懒加载
    }
}
```

### 2.5 图片懒加载

```html
<!-- 修改产品卡片使用 data 属性 -->
<div class="product-image apple" data-src="images/apple.jpg" loading="lazy">
    🍎
</div>

<!-- 使用 Intersection Observer -->
<script>
const images = document.querySelectorAll('[data-src]');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.backgroundImage = 
                `url(${entry.target.dataset.src})`;
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '50px' });

images.forEach(img => observer.observe(img));
</script>
```

---

## 第三部分：代码质量与架构

### 3.1 CartManager 模块

```javascript
// modules/cart-manager.js

export class CartManager {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'cart';
        this.cart = this.loadFromStorage();
        this.listeners = [];
        this.notificationManager = options.notificationManager;
    }

    // 核心方法
    addItem(name, price) {
        const existing = this.cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ name, price, quantity: 1 });
        }
        this.saveToStorage();
        this.notifyListeners();
        
        if (this.notificationManager) {
            this.notificationManager.success(name);
        }
        return this.cart;
    }

    removeItem(index) {
        if (index >= 0 && index < this.cart.length) {
            const item = this.cart[index];
            this.cart.splice(index, 1);
            this.saveToStorage();
            this.notifyListeners();
            
            if (this.notificationManager) {
                this.notificationManager.info(`${item.name} 已删除`);
            }
        }
        return this.cart;
    }

    updateQuantity(index, quantity) {
        if (index >= 0 && index < this.cart.length) {
            this.cart[index].quantity = Math.max(1, quantity);
            if (this.cart[index].quantity <= 0) {
                this.removeItem(index);
            } else {
                this.saveToStorage();
                this.notifyListeners();
            }
        }
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    clear() {
        this.cart = [];
        this.saveToStorage();
        this.notifyListeners();
    }

    // 存储管理
    loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (e) {
            console.error('Failed to load cart from storage:', e);
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        } catch (e) {
            console.error('Failed to save cart to storage:', e);
        }
    }

    // 事件系统
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.cart));
    }
}
```

### 3.2 ModalManager 模块

```javascript
// modules/modal-manager.js

export class ModalManager {
    constructor(modalSelector, options = {}) {
        this.modal = document.querySelector(modalSelector);
        this.isOpen = false;
        this.previousFocus = null;
        this.onClose = options.onClose || (() => {});
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 关闭按钮
        const closeBtn = this.modal.querySelector('[aria-label*="关闭"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // 背景点击
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    getFocusableElements() {
        const selector = [
            'button:not([disabled])',
            'a[href]:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])',
            'select:not([disabled])'
        ].join(',');
        
        return Array.from(this.modal.querySelectorAll(selector))
            .filter(el => el.offsetParent !== null);
    }

    open() {
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.style.display = 'flex';
        this.isOpen = true;

        this.previousFocus = document.activeElement;
        
        const focusable = this.getFocusableElements();
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 100);
        }
    }

    close() {
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.style.display = 'none';
        this.isOpen = false;

        if (this.previousFocus) {
            this.previousFocus.focus();
        }

        this.onClose();
    }

    handleKeyDown(e) {
        if (!this.isOpen) return;

        if (e.key === 'Escape') {
            this.close();
            e.preventDefault();
        }

        if (e.key === 'Tab') {
            const focusable = this.getFocusableElements();
            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
}
```

### 3.3 NotificationManager 模块

```javascript
// modules/notification-manager.js

export class NotificationManager {
    constructor(options = {}) {
        this.container = options.container || this.createContainer();
        this.duration = options.duration || 3000;
        this.maxNotifications = options.maxNotifications || 3;
        this.queue = [];
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notificationArea';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        container.className = 'sr-only';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info') {
        // 屏幕阅读器通知
        this.container.textContent = message;

        // 视觉通知（可选）
        this.showVisual(message, type);

        // 自动清除
        setTimeout(() => {
            this.container.textContent = '';
        }, this.duration);
    }

    showVisual(message, type) {
        if (this.queue.length >= this.maxNotifications) {
            this.queue.shift()?.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 200;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);
        this.queue.push(notification);

        setTimeout(() => {
            notification.remove();
            this.queue = this.queue.filter(n => n !== notification);
        }, this.duration);
    }

    getColor(type) {
        const colors = {
            success: 'var(--success)',
            error: '#ff3b30',
            warning: '#ff9500',
            info: 'var(--primary)'
        };
        return colors[type] || colors.info;
    }

    success(message) {
        this.show(`✅ ${message}`, 'success');
    }

    error(message) {
        this.show(`❌ ${message}`, 'error');
    }

    warning(message) {
        this.show(`⚠️ ${message}`, 'warning');
    }

    info(message) {
        this.show(`ℹ️ ${message}`, 'info');
    }
}
```

### 3.4 工具函数

```javascript
// modules/utils.js

export function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    }).format(value);
}

export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
}
```

---

## 第四部分：UX 改进方案

### 4.1 使用 aria-live 替代 alert

**问题代码**
```javascript
alert('请输入邮箱和密码');
alert('✅ 登录成功\n\n欢迎, ${email}!');
```

**改进方案**
```javascript
// 在表单验证中
validateForm() {
    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    if (!email) {
        this.showFieldError('email', '请输入邮箱地址');
        this.notificationManager.error('表单验证失败');
        return false;
    }

    if (!this.validateEmail(email)) {
        this.showFieldError('email', '请输入有效的邮箱地址');
        return false;
    }

    if (!password) {
        this.showFieldError('password', '请输入密码');
        return false;
    }

    return true;
}

showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
}
```

### 4.2 按钮加载状态

```html
<!-- HTML -->
<button class="submit-btn" id="submitBtn" type="submit">登录</button>

<!-- CSS -->
<style>
    .submit-btn.loading {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }

    .submit-btn.loading::after {
        content: '';
        animation: spin 1s linear infinite;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid white;
        border-radius: 50%;
        border-top-color: transparent;
        margin-left: 0.5rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>

<!-- JavaScript -->
<script>
async function handleLogin() {
    const btn = document.getElementById('submitBtn');
    const originalText = btn.textContent;

    try {
        btn.classList.add('loading');
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');

        // 模拟 API 请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.notificationManager.success(`欢迎, ${email}!`);
        this.closeLoginModal();
    } catch (error) {
        this.notificationManager.error('登录失败，请重试');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.setAttribute('aria-busy', 'false');
        btn.textContent = originalText;
    }
}
</script>
```

### 4.3 改进的错误消息展示

```html
<!-- 表单验证错误 -->
<form id="loginForm" novalidate>
    <div class="form-group">
        <label for="email">邮箱</label>
        <input 
            type="email" 
            id="email" 
            placeholder="输入你的邮箱"
            aria-describedby="emailError emailHint"
            required>
        <span id="emailHint" class="form-hint">格式: example@email.com</span>
        <span id="emailError" class="error-message" role="alert"></span>
    </div>
</form>

<!-- CSS -->
<style>
    .form-group {
        margin-bottom: 1rem;
    }

    .form-hint {
        display: block;
        font-size: 0.875rem;
        color: var(--text-light);
        margin-top: 0.25rem;
    }

    .error-message {
        display: block;
        font-size: 0.875rem;
        color: #ff3b30;
        margin-top: 0.25rem;
        font-weight: 500;
    }

    input:invalid:not(:placeholder-shown) {
        border-color: #ff3b30;
        background-color: rgba(255, 59, 48, 0.05);
    }
</style>
```

### 4.4 表单验证反馈

```javascript
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.setupValidation();
    }

    setupValidation() {
        this.form.addEventListener('blur', (e) => {
            if (e.target.type === 'email') {
                this.validateEmail(e.target);
            } else if (e.target.type === 'password') {
                this.validatePassword(e.target);
            }
        }, true);
    }

    validateEmail(input) {
        const error = document.getElementById('emailError');
        const value = input.value.trim();

        if (!value) {
            this.setError(input, error, '邮箱地址不能为空');
            return false;
        }

        if (!this.isValidEmail(value)) {
            this.setError(input, error, '请输入有效的邮箱地址');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    validatePassword(input) {
        const error = document.getElementById('passwordError');
        const value = input.value;

        if (!value) {
            this.setError(input, error, '密码不能为空');
            return false;
        }

        if (value.length < 6) {
            this.setError(input, error, '密码长度不能少于 6 个字符');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    setError(input, errorElement, message) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
    }

    clearError(input, errorElement) {
        input.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
```

---

## 第五部分：实现优先级与时间表

### 优先级 1 - 可访问性基础 (1-2 天)
- [ ] 添加 ARIA 属性到关键元素
- [ ] 转换为语义 HTML 结构
- [ ] 实现焦点管理
- [ ] 添加 aria-live 通知系统

### 优先级 2 - 代码质量 (2-3 天)
- [ ] 提取 CartManager 模块
- [ ] 提取 ModalManager 模块
- [ ] 提取 NotificationManager 模块
- [ ] 实现事件委托

### 优先级 3 - 性能优化 (1 天)
- [ ] 提取所有样式到 CSS 块
- [ ] 实现 debounce/throttle
- [ ] 添加 keyboard 导航管理器
- [ ] 移除内联事件处理

### 优先级 4 - UX 改进 (1 天)
- [ ] 实现表单验证反馈
- [ ] 添加加载状态
- [ ] 改进错误消息
- [ ] 添加过渡动画

---

## 验证清单

### 可访问性检查
- [ ] 使用屏幕阅读器（NVDA/JAWS）测试全流程
- [ ] 只用键盘完成购物流程（无鼠标）
- [ ] 通过 WAVE、Axe 等工具检测
- [ ] 焦点指示器可见且清晰
- [ ] 颜色对比度符合 WCAG AA 标准

### 性能检查
- [ ] Lighthouse 性能得分 > 90
- [ ] 首屏加载 < 2s
- [ ] 交互响应 < 100ms
- [ ] 没有内存泄漏（使用 DevTools）

### 功能检查
- [ ] 购物车增删改查正常
- [ ] 登录表单验证完整
- [ ] 模态框焦点陷阱有效
- [ ] ESC 键能关闭所有弹框
- [ ] localStorage 持久化正确

---

## 文件清单

新增文件：
```
/frontend
├── modules/
│   ├── cart-manager.js
│   ├── modal-manager.js
│   ├── notification-manager.js
│   ├── keyboard-manager.js
│   ├── form-validator.js
│   └── utils.js
├── index-optimized.html      (最终优化版本)
└── styles/
    └── main.css              (提取的样式)
```

---

## 总结

这个方案涵盖了：
1. **可访问性** - 完整的 ARIA、语义 HTML、焦点管理、键盘导航
2. **性能** - 模块化、事件委托、防抖、懒加载
3. **代码质量** - 清晰的架构、可重用模块、单一职责原则
4. **UX** - 实时反馈、错误处理、加载状态、流畅交互

实施后，FruitHub 将达到**企业级**的可访问性和代码质量标准。
