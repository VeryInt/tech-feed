const BASE_URL = 'https://huggingface.co/papers/trending'
interface Paper {
    title: string
    url: string
    abstract: string
    github_url: string
    arxiv_url: string
    date_published: string | null
    author: string
    media?: {
        url: string
        type: string
    }[]
    upvotes: number
}
export class HuggingFaceScraper {
    async fetchPapers(c: any): Promise<Paper[]> {
        const res = await fetch(BASE_URL)
        let papers: Paper[] = []
        let tempPaper: Partial<Paper> = {}
        await new HTMLRewriter()
            .on('article', {
                element(element) {
                    console.log(`element`, element)
                },
            })
            .on('article div:first-child div:nth-child(2) h3 a', {
                text(text) {
                    if (text.text) {
                        const result = setTempPaper({
                            tempPaper,
                            papers,
                            paperItem: { title: text.text },
                        })
                        tempPaper = result.tempPaper
                        papers = result.papers
                    }
                },
                element(element) {
                    const href = element.getAttribute('href')
                    const result = setTempPaper({
                        tempPaper,
                        papers,
                        paperItem: { url: href ? `https://huggingface.co${href}` : '' },
                    })
                    tempPaper = result.tempPaper
                    papers = result.papers
                },
            })
            .on('article div:first-child div:first-child a img', {
                element(element) {
                    const src = element.getAttribute('src')
                    const result = setTempPaper({
                        tempPaper,
                        papers,
                        paperItem: { media: [{ url: src ? src : '', type: 'image' }] },
                    })
                    tempPaper = result.tempPaper
                    papers = result.papers
                },
            })
            .on('article div:first-child div:first-child a video', {
                element(element) {
                    const src = element.getAttribute('src')
                    const result = setTempPaper({
                        tempPaper,
                        papers,
                        paperItem: { media: [{ url: src ? src : '', type: 'video' }] },
                    })
                    tempPaper = result.tempPaper
                    papers = result.papers
                },
            })
            .on('article div:first-child div:nth-child(2) p', {
                text(text) {
                    if (text.text) {
                        const result = setTempPaper({
                            tempPaper,
                            papers,
                            paperItem: { abstract: text.text },
                        })
                        tempPaper = result.tempPaper
                        papers = result.papers
                    }
                },
            })
            .on('article div:first-child div:nth-child(3) a:first-child div div', {
                text(text) {
                    if (text.text) {
                        const result = setTempPaper({
                            tempPaper,
                            papers,
                            paperItem: { upvotes: parseInt(text.text) },
                        })
                        tempPaper = result.tempPaper
                        papers = result.papers
                    }
                },
            })
            .on('article div:first-child div:nth-child(3) > a:nth-child(2)', {
                element(element) {
                    const href = element.getAttribute('href')
                    const result = setTempPaper({
                        tempPaper,
                        papers,
                        paperItem: { github_url: href ? href : '' },
                    })
                    tempPaper = result.tempPaper
                    papers = result.papers
                },
            })
            .on('article div:first-child div:nth-child(3) > a:nth-child(3)', {
                element(element) {
                    const href = element.getAttribute('href')
                    const result = setTempPaper({
                        tempPaper,
                        papers,
                        paperItem: { arxiv_url: href ? href : '' },
                    })
                    tempPaper = result.tempPaper
                    papers = result.papers
                },
            })
            .transform(res)
            .arrayBuffer()

        return papers
    }

    

    generateRss(papers: Paper[]): string {
        const rssItems = papers
            .map(paper => {
                const pubDate = paper.date_published
                    ? new Date(paper.date_published).toUTCString()
                    : new Date().toUTCString()
                const media = paper.media?.map(m => `<enclosure url="${m.url}" type="${m.type}" />`).join('')
                return `
          <item>
            <title>${paper.title}</title>
            <link>${paper.url}</link>
            <description>${paper.abstract}</description>
            <pubDate>${pubDate}</pubDate>
            <author>${paper.author}</author>
            ${media}
          </item>
        `
            })
            .join('')
        return `
      <rss version="2.0">
        <channel>
          <title>Hugging Face Trending Papers</title>
          <link>${BASE_URL}</link>
          <description>Trending papers from Hugging Face</description>
          ${rssItems}
        </channel>
      </rss>
    `
    }
}

function setTempPaper({
    tempPaper,
    papers,
    paperItem,
}: {
    tempPaper: Partial<Paper>
    papers: Paper[]
    paperItem: Partial<Paper>
}): {
    tempPaper: Partial<Paper>
    papers: Paper[]
} {
    if (paperItem.media) {
        tempPaper.media = tempPaper?.media?.length ? [...tempPaper.media, ...paperItem.media] : paperItem.media
    }
    if (paperItem.url) {
        tempPaper.url = paperItem.url
    }
    if (paperItem.title) {
        tempPaper.title = paperItem.title
    }
    if (paperItem.abstract) {
        tempPaper.abstract = paperItem.abstract
    }
    if (paperItem.github_url) {
        tempPaper.github_url = paperItem.github_url
    }
    if (paperItem.arxiv_url) {
        tempPaper.arxiv_url = paperItem.arxiv_url
    }
    if (paperItem.upvotes) {
        tempPaper.upvotes = paperItem.upvotes
    }
    if (
        tempPaper.url &&
        tempPaper.title &&
        tempPaper.abstract &&
        tempPaper.github_url &&
        tempPaper.arxiv_url &&
        tempPaper.upvotes
    ) {
        papers.push(tempPaper as Paper)
        tempPaper = {}
    }
    return {
        tempPaper,
        papers,
    }
}
