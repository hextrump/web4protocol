# Web4 Protocol：下一代去中心化社交协议

## 愿景
Web4 Protocol 致力于创建一个真正开放、去中心化的社交网络生态系统，让用户重新掌控自己的数据和社交关系。我们相信，社交网络应该属于用户，而不是大型科技公司。

### 为什么需要 Web4？
- **Web2 时代的问题**：中心化平台控制用户数据，随意更改规则，用户没有真正的数据所有权
- **Web3 的不足**：虽然引入了区块链技术，但存储成本高昂，性能受限，用户体验欠佳
- **Web4 的创新**：我们建立自己的网站，用同样的协议交流，实现真正的去中心化社交网络

## 技术架构

### index.html 核心功能
- 提供基础的 HTML 结构
- 内置调试面板（debug-panel）用于显示状态和错误信息
- Debug 工具类，用于记录和显示调试信息
- Web4Layout 类管理整个应用布局
- Widget 加载和应用系统
- 全局错误处理和 DOM 变化监控

### 00_layout.js 核心功能
#### 基础布局结构
包含以下主要容器：
- `wallet-container`：钱包容器
- `theme-container`：主题容器
- `title-container`：标题容器
- `post-container`：帖子容器
- `thread-container`：线程容器
- `build-container`：构建容器


### 主要工作流程
1. **初始化阶段**
   - 初始化 Debug 面板和 Web4Layout
   - 从 Irys 网络加载布局配置

2. **Widget 加载顺序**
   - 主题 widget
   - 钱包 widget
   - 标题、帖子、线程和构建 widget

3. **组件特性**
   - 每个 widget 都是独立组件
   - 包含独立的 HTML、CSS 和 JavaScript
   - 通过 GraphQL 查询获取最新版本
   - 完整的错误处理和调试信息记录

## 许可证
本项目采用 [MIT 许可证](LICENSE)

