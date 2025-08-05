import { Hono } from 'hono'
import { HuggingFaceScraper } from './dailypapers'
import { HuggingFaceScraper as HuggingFaceTrendingScraper } from './trendingpapers'

const huggingFaceRoutes = new Hono()

huggingFaceRoutes.get('/dailypapers', async c => {
    const scraper = new HuggingFaceScraper()
    const papers = await scraper.fetchPapers(c)
    return c.json(papers)
})

huggingFaceRoutes.get('/dailypapers/rss', async c => {
    const scraper = new HuggingFaceScraper()
    const papers = await scraper.fetchPapers(c)
    const rss = scraper.generateRss(papers)
    return c.text(rss, 200, {
        'Content-Type': 'application/rss+xml',
    })
})

huggingFaceRoutes.get('/trendingpapers', async c => {
    const scraper = new HuggingFaceTrendingScraper()
    const papers = await scraper.fetchPapers(c)
    return c.json(papers)
})

huggingFaceRoutes.get('/trendingpapers/rss', async c => {
    const scraper = new HuggingFaceTrendingScraper()
    const papers = await scraper.fetchPapers(c)
    const rss = scraper.generateRss(papers)
    return c.text(rss, 200, {
        'Content-Type': 'application/rss+xml',
    })
})

export { huggingFaceRoutes }
