# Fruit Shop 在线水果商城

一个现代化的在线水果购物平台，提供用户友好的界面和强大的后端 API。

## 目录

- [项目介绍](#项目介绍)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [安装步骤](#安装步骤)
- [运行方法](#运行方法)
- [API 文档](#api-文档)
- [开发指南](#开发指南)
- [部署](#部署)

## 项目介绍

Fruit Shop 是一个全栈 Web 应用，为用户提供便捷的在线水果购物体验。项目采用现代化技术栈，包括 React 前端、Node.js/Express 后端和 MongoDB 数据库。

### 核心功能

- 用户注册、登录和身份认证
- 浏览水果产品目录
- 购物车管理
- 下单和订单追踪
- 产品搜索和分类筛选

## 功能特性

- ✨ **现代化 UI** - React 18 构建的响应式用户界面
- 🔐 **用户认证** - JWT 令牌认证机制
- 📦 **产品管理** - 完整的产品信息展示和管理
- 🛒 **购物车** - 实时购物车操作
- 📊 **订单管理** - 用户订单历史和状态追踪
- 🚀 **RESTful API** - 标准化的 API 接口
- 🐳 **Docker 支持** - 一键启动开发环境
- 🔒 **安全性** - 密码加密、CORS 配置、输入验证

## 技术栈

### 前端

- **React 18** - 用户界面库
- **React Router 6** - 客户端路由
- **Axios** - HTTP 客户端
- **CSS3** - 样式和布局

### 后端

- **Node.js** - JavaScript 运行时
- **Express 4** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - ODM 库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密
- **Nodemon** - 开发环境自动重启
- **Jest** - 测试框架

### DevOps

- **Docker** - 容器化
- **Docker Compose** - 多容器编排

## 项目结构

```
fruit/
├── backend/
│   ├── config/
│   │   ├── constants.js        # 常量配置
│   │   └── database.js         # 数据库连接配置
│   ├── middleware/
│   │   └── auth.js             # 身份认证中间件
│   ├── models/
│   │   ├── User.js             # 用户模型
│   │   ├── Product.js          # 产品模型
│   │   └── Order.js            # 订单模型
│   ├── routes/
│   │   ├── users.js            # 用户路由
│   │   ├── products.js         # 产品路由
│   │   └── orders.js           # 订单路由
│   ├── server.js               # Express 应用入口
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js       # 页头组件
│   │   │   ├── Footer.js       # 页脚组件
│   │   │   ├── Hero.js         # 头部横幅
│   │   │   ├── ProductCard.js  # 产品卡片
│   │   │   ├── ProductList.js  # 产品列表
│   │   │   └── ShoppingCart.js # 购物车
│   │   ├── App.js              # 主应用组件
│   │   ├── index.js            # 入口点
│   │   └── index.css           # 全局样式
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── .env.example                # 环境变量示例
├── docker-compose.yml          # Docker Compose 配置
└── README.md                   # 项目文档
```

## 环境要求

### 本地开发环境

- Node.js 16.0 或以上
- npm 8.0 或以上
- MongoDB 5.0 或以上
- Git

### Docker 部署环境

- Docker 20.10 或以上
- Docker Compose 2.0 或以上

## 安装步骤

### 方式一：本地开发环境

1. **克隆项目**

```bash
git clone <repository-url>
cd fruit
```

2. **配置环境变量**

```bash
# 复制根目录环境变量文件
cp .env.example .env

# 配置前端环境变量
cp frontend/.env.example frontend/.env

# 配置后端环境变量
cp backend/.env.example backend/.env
```

3. **安装后端依赖**

```bash
cd backend
npm install
```

4. **安装前端依赖**

```bash
cd ../frontend
npm install
```

5. **启动 MongoDB 数据库**

确保 MongoDB 运行在本地或远程服务器上，更新 `.env` 文件中的 `MONGODB_URI`。

### 方式二：Docker 环境

1. **克隆项目**

```bash
git clone <repository-url>
cd fruit
```

2. **配置环境变量**

```bash
cp .env.example .env
```

3. **启动服务**

```bash
docker-compose up -d
```

## 运行方法

### 本地开发

**启动后端服务**

```bash
cd backend
npm run dev
```

后端服务将运行在 `http://localhost:5000`

**启动前端应用**

在新的终端窗口中：

```bash
cd frontend
npm start
```

前端应用将在浏览器中自动打开 `http://localhost:3000`

### Docker 环境

启动所有服务：

```bash
docker-compose up
```

停止所有服务：

```bash
docker-compose down
```

查看服务日志：

```bash
docker-compose logs -f [service-name]
```

## API 文档

### 基础信息

- **基础 URL**: `http://localhost:5000/api`
- **认证方式**: JWT Token（在 Authorization 头中传递）
- **请求格式**: JSON
- **响应格式**: JSON

### 认证

大多数需要认证的接口要求在请求头中包含 JWT Token：

```
Authorization: Bearer <token>
```

### 用户接口 (`/api/users`)

#### 用户注册

**POST** `/api/users/register`

请求体：

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123"
}
```

响应（成功）：

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 用户登录

**POST** `/api/users/login`

请求体：

```json
{
  "email": "john@example.com",
  "password": "secure_password123"
}
```

响应（成功）：

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### 获取用户信息

**GET** `/api/users/profile`

请求头：`Authorization: Bearer <token>`

响应：

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 产品接口 (`/api/products`)

#### 获取所有产品

**GET** `/api/products`

查询参数：

- `page` (可选) - 页码，默认 1
- `limit` (可选) - 每页数量，默认 10
- `category` (可选) - 产品分类
- `search` (可选) - 搜索关键词

响应：

```json
{
  "success": true,
  "total": 50,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "新鲜苹果",
      "description": "红富士苹果，甜脆可口",
      "price": 12.99,
      "quantity": 100,
      "category": "水果",
      "image": "https://example.com/apple.jpg",
      "rating": 4.5,
      "reviews": 25
    }
  ]
}
```

#### 获取单个产品

**GET** `/api/products/:id`

响应：

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "新鲜苹果",
    "description": "红富士苹果，甜脆可口",
    "price": 12.99,
    "quantity": 100,
    "category": "水果",
    "image": "https://example.com/apple.jpg",
    "rating": 4.5,
    "reviews": 25
  }
}
```

#### 创建产品（管理员）

**POST** `/api/products`

请求头：`Authorization: Bearer <admin-token>`

请求体：

```json
{
  "name": "新鲜香蕉",
  "description": "进口香蕉，黄澄澄",
  "price": 8.99,
  "quantity": 200,
  "category": "水果",
  "image": "https://example.com/banana.jpg"
}
```

#### 更新产品（管理员）

**PUT** `/api/products/:id`

请求头：`Authorization: Bearer <admin-token>`

请求体：同创建产品

#### 删除产品（管理员）

**DELETE** `/api/products/:id`

请求头：`Authorization: Bearer <admin-token>`

### 订单接口 (`/api/orders`)

#### 创建订单

**POST** `/api/orders`

请求头：`Authorization: Bearer <token>`

请求体：

```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Beijing",
    "zipCode": "100000"
  },
  "totalAmount": 25.98
}
```

响应：

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 25.98,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 获取用户订单

**GET** `/api/orders`

请求头：`Authorization: Bearer <token>`

响应：

```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "totalAmount": 25.98,
      "status": "shipped",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 获取订单详情

**GET** `/api/orders/:id`

请求头：`Authorization: Bearer <token>`

响应：

```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "productName": "新鲜苹果",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Beijing",
      "zipCode": "100000"
    },
    "totalAmount": 25.98,
    "status": "shipped",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

#### 更新订单状态（管理员）

**PUT** `/api/orders/:id/status`

请求头：`Authorization: Bearer <admin-token>`

请求体：

```json
{
  "status": "shipped"
}
```

### 健康检查

**GET** `/api/health`

响应：

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 错误响应

所有错误响应遵循以下格式：

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

常见的 HTTP 状态码：

- `200` - 成功
- `201` - 已创建
- `400` - 请求格式错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 未找到
- `500` - 服务器内部错误

## 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 ES6+ 规范
- 使用有意义的变量名和函数名
- 添加必要的代码注释

### 开发流程

1. 创建新的特性分支：`git checkout -b feature/your-feature-name`
2. 进行开发和测试
3. 提交代码：`git commit -am "Describe your changes"`
4. 推送到远程仓库：`git push origin feature/your-feature-name`
5. 创建 Pull Request

### 运行测试

```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 调试

**后端调试**

使用 Visual Studio Code 的调试器或添加 `console.log` 语句。

**前端调试**

使用浏览器开发者工具（F12）进行调试。

## 部署

### 生产环境变量配置

1. 更新 `.env` 文件中的生产环境配置
2. 设置强密码和安全的 JWT Secret
3. 配置数据库连接到生产 MongoDB 实例
4. 启用 HTTPS

### 使用 Docker 部署

1. 构建镜像

```bash
docker-compose -f docker-compose.yml build
```

2. 推送镜像到仓库

```bash
docker tag fruit-shop-backend:latest your-registry/fruit-shop-backend:latest
docker push your-registry/fruit-shop-backend:latest
```

3. 在服务器上拉取并启动

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### Q: 如何重置数据库？

A: 连接到 MongoDB 并清空数据库：

```bash
docker-compose exec mongodb mongosh -u root -p root123
# 在 mongosh 中执行
db.dropDatabase()
```

### Q: 前端无法连接到后端？

A: 检查 `.env` 文件中的 `REACT_APP_API_URL` 是否正确配置。

### Q: 如何更改端口号？

A: 编辑 `.env` 文件中的 `BACKEND_PORT` 和 `FRONTEND_PORT`。

## 许可证

ISC License

## 贡献

欢迎提交问题报告和拉取请求。
