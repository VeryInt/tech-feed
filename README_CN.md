# Tech Feed (科技信息流)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/VeryInt/tech-feed)

该项目旨在从各种来源抓取科技新闻，并以 JSON API 和 RSS 源的形式提供数据。目前，它支持从 Hugging Face 获取每日和热门论文。

该应用程序使用轻量级 Web 框架 [Hono](https://hono.dev/) 构建，并部署在 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 上。它利用 Cloudflare 强大的 `HTMLRewriter` 在边缘网络上直接进行高效的网页抓取。

由于其依赖于 Cloudflare 特定的 API（如 `HTMLRewriter`），该项目专为 Cloudflare 平台设计和部署。

## 功能特性

- **JSON API**: 获取结构化的抓取内容数据。
- **RSS 源**: 订阅您最喜欢的科技新闻。
- **为 Cloudflare 构建**: 针对 Cloudflare 网络的性能和可扩展性进行了优化。

## 当前可用接口

以下接口目前在 `/huggingface` 路径下可用：

### Hugging Face 每日论文

-   **JSON**: `/huggingface/dailypapers`
-   **RSS**: `/huggingface/dailypapers/rss`

### Hugging Face 热门论文

-   **JSON**: `/huggingface/trendingpapers`
-   **RSS**: `/huggingface/trendingpapers/rss`

## 开始使用

### 环境要求

-   [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)
-   一个 [Cloudflare 账户](https://dash.cloudflare.com/sign-up)

### 安装

1.  克隆仓库：
    ```bash
    git clone <repository-url>
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  将 `wrangler.toml.example` 重命名为 `wrangler.toml` 并更新您的 Cloudflare 账户信息。

## 开发

启动开发服务器：

```bash
npm run dev
```

您的应用程序将在 [http://localhost:5173](http://localhost:5173) 上可用。前端是一个简单的 React 应用，为未来可能的 UI 做准备，而 worker 接口可以使用 `curl` 或 Postman 等工具进行测试。

## 部署

1.  构建用于生产的项目：
    ```bash
    npm run build
    ```
2.  部署到 Cloudflare Workers：
    ```bash
    npm run deploy
    ```
