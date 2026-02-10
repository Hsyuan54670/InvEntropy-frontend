# InvEntropy 项目管理系统 - 前端

> 一个基于 Vue 3 + Element Plus 的现代化项目管理系统前端界面

## 📋 项目简介

InvEntropy 项目管理系统是一个专为高校科研项目管理设计的现代化Web应用。本项目为前端部分，采用 Vue 3 + Element Plus 技术栈开发，提供直观友好的用户界面，支持多角色用户管理、项目申报、进度跟踪等功能。


**技术栈**：Vue 3 + Element Plus + Vite  

### 相关仓库
<!-- 贴仓库克隆命令 + 依赖安装命令 -->
1. [部署代码仓库(Docker)](https://github.com/Hsyuan54670/InvEntropy-run.git)
```bash
git clone https://github.com/Hsyuan54670/InvEntropy-run.git
```
2. [后端代码仓库(Java)](https://github.com/Hsyuan54670/InvEntropy-backend.git)
```bash
git clone https://github.com/Hsyuan54670/InvEntropy-backend.git
```


## ✨ 功能特性

### 🔐 用户认证
- 多角色登录（普通用户/管理员）
- 安全的用户身份验证
- 自动登录状态保持

### 📊 项目管理
- 项目信息申报与提交
- 项目类型分类管理
- 项目进度可视化展示
- 经费预算管理

### 👥 用户管理
- 用户权限分级控制
- 个人信息维护
- 操作日志记录

### 🎨 界面特色
- 现代化UI设计，采用理性主题风格
- 响应式布局，支持多设备访问
- 流畅的动画交互效果
- 直观的数据可视化展示

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器

### UI组件库
- **Element Plus** - 基于Vue 3的组件库
- **ECharts** - 数据可视化图表库

### 开发工具
- **VS Code** - 代码编辑器
- **Vue DevTools** - Vue开发调试工具
- **ESLint** - 代码质量检查

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
# 克隆项目
git clone <项目地址>

# 进入项目目录
cd vue-InvEntropy

# 安装依赖
npm install
```

### 开发环境运行

```bash
# 启动开发服务器
npm run dev

# 访问应用
# 浏览器打开 http://localhost:5174/
```

### 生产环境构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── api/           # API接口管理
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── store/         # 状态管理
├── utils/         # 工具函数
├── views/         # 页面组件
│   ├── Login.vue  # 登录页面
│   ├── NewProject.vue # 项目申报页面
│   └── ...        # 其他页面
└── main.js        # 入口文件
```

## 🎯 主要页面

### 登录页面 (`/login`)
- 用户类型选择（普通用户/管理员）
- 表单验证与错误提示
- 响应式设计，支持移动端

### 项目申报页面 (`/new-project`)
- 项目信息表单填写
- 实时表单验证
- 数据提交与清空功能

### 仪表盘页面 (`/dashboard`)
- 项目统计概览
- 数据可视化图表
- 快速操作入口

## 🔧 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循Vue 3组合式API规范
- 组件命名采用PascalCase
- 文件命名采用kebab-case

### 组件开发
- 使用 `<script setup>` 语法
- 遵循单一职责原则
- 合理使用Props和Emit
- 组件样式使用scoped CSS

### API调用
- 统一使用axios进行HTTP请求
- 接口错误统一处理
- 请求参数和响应数据规范化



### 提交规范
- 使用约定式提交格式
- 详细描述修改内容
- 确保代码通过ESLint检查



## 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [Vite](https://vitejs.dev/) - 下一代前端工具
- [ECharts](https://echarts.apache.org/) - 数据可视化库




