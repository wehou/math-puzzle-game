# 数学拼图游戏 / Math Puzzle Game

一个使用 React 和 Tailwind CSS 开发的数学拼图游戏单页应用。

A single-page math puzzle game application built with React and Tailwind CSS.

## 功能特性 / Features

- **方块选择**: 选择1-25个方块创建自定义图形
- **颜色选择**: 8种预设颜色可选
- **拖拽功能**: 将组装好的图形拖拽到主画布
- **旋转功能**: 右键点击旋转图形90度
- **移动控制**: 使用小键盘8、6、2、4键移动图形
- **删除功能**: Delete键删除选中的图形
- **深色主题**: 现代简约的深色设计风格
- **平滑动画**: 所有操作都有流畅的过渡动画

## 技术栈 / Tech Stack

- **React 18** - 前端框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Canvas API** - 游戏画布渲染

## 安装与运行 / Installation & Running

### 前置要求 / Prerequisites

- Node.js >= 20
- npm >= 10

### 安装依赖 / Install Dependencies

```bash
cd math-puzzle-game
npm install
```

### 开发模式 / Development Mode

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产构建 / Production Build

```bash
npm run build
npm run preview
```

## 操作说明 / How to Play

1. **创建图形**:
   - 在左侧控制面板选择方块数量和颜色
   - 在5×5组装区点击或拖拽选择方块
   - 点击"清除"按钮可以重新开始

2. **放置图形**:
   - 将组装好的图形拖拽到右侧主画布
   - 图形会自动放置在鼠标位置

3. **编辑图形**:
   - 左键点击选中图形
   - 右键点击旋转图形
   - 小键盘8、6、2、4键移动图形
   - Delete键删除图形

## 项目结构 / Project Structure

```
math-puzzle-game/
├── src/
│   ├── components/
│   │   ├── GameCanvas.jsx      # 主画布组件
│   │   ├── ControlPanel.jsx    # 控制面板组件
│   │   └── PieceBuilder.jsx    # 拼图组装组件
│   ├── App.jsx                 # 主应用组件
│   ├── main.jsx                # 应用入口
│   └── index.css               # 全局样式
├── index.html                  # HTML模板
├── package.json                # 项目配置
├── vite.config.js              # Vite配置
├── tailwind.config.js          # Tailwind配置
└── postcss.config.js           # PostCSS配置
```

## 浏览器支持 / Browser Support

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证 / License

MIT
