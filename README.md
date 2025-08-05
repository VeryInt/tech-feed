# Tech Feed

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/VeryInt/tech-feed)

[中文文档](./README_CN.md)

This project is designed to scrape technology news from various sources and provide the data as a JSON API and RSS feeds. Currently, it supports fetching daily and trending papers from Hugging Face.

The application is built using [Hono](https://hono.dev/), a lightweight web framework, and is intended to be deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/). It leverages Cloudflare's powerful `HTMLRewriter` for efficient web scraping directly on the edge.

Due to its reliance on Cloudflare-specific APIs like `HTMLRewriter`, this project is exclusively designed for deployment on the Cloudflare platform.

## Features

- **JSON API**: Get structured data of scraped content.
- **RSS Feeds**: Subscribe to your favorite tech news.
- **Built for Cloudflare**: Optimized for performance and scalability on the Cloudflare network.

## Current Endpoints

The following endpoints are currently available, routed under the `/huggingface` path:

### Hugging Face Daily Papers

-   **JSON**: `/huggingface/dailypapers`
-   **RSS**: `/huggingface/dailypapers/rss`

### Hugging Face Trending Papers

-   **JSON**: `/huggingface/trendingpapers`
-   **RSS**: `/huggingface/trendingpapers/rss`

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Rename `wrangler.toml.example` to `wrangler.toml` and update it with your Cloudflare account details.

## Development

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173). The frontend is a simple React application for potential future UI, while the worker endpoints can be tested with tools like `curl` or Postman.

## Deployment

1.  Build the project for production:
    ```bash
    npm run build
    ```
2.  Deploy to Cloudflare Workers:
    ```bash
    npm run deploy
    ```