const BASE_URL = 'https://huggingface.co/papers'
interface Paper {
    title: string
    url: string
    abstract: string
    date_published: string | null
    author: string
}
export class HuggingFaceScraper {
    async fetchPapers(c: any): Promise<Paper[]> {
        const res = await fetch(BASE_URL)
        const papers: { title: string; url: string }[] = []
        let tempPaper = { title: '', url: '' }
        await new HTMLRewriter()
            .on('h3 > a', {
                text(text) {
                    if (text.text) {
                        tempPaper.title = text.text
                        if (tempPaper.url) {
                            papers.push(tempPaper)
                            tempPaper = { title: '', url: '' }
                        }
                    }
                },
                element(element) {
                    const href = element.getAttribute('href')
                    const title = element || ''
                    if (href) {
                        const url = `https://huggingface.co${href}`
                        tempPaper.url = url
                        if (tempPaper.title) {
                            papers.push(tempPaper)
                            tempPaper = { title: '', url: '' }
                        }
                    }
                },
            })
            .transform(res)
            .arrayBuffer()
        const detailedPapers: Paper[] = []
        for (const paper of papers) {
            if (paper.url) {
                try {
                    const { abstract, date_published, author } = await this.extractAbstraction(paper.url, c)
                    detailedPapers.push({ ...paper, abstract, date_published, author })
                } catch (e) {
                    detailedPapers.push({ ...paper, abstract: '', date_published: null, author: '' })
                }
            }
        }
        return detailedPapers
    }
    private async extractAbstraction(
        url: string,
        c: Record<string, any>
    ): Promise<{ abstract: string; date_published: string | null; author: string }> {
        const res = await fetch(url)
        let abstract = ''
        let date_published: string | null = null
        let authorList: string[] = []
        await new HTMLRewriter()
            .on('div.pb-8.pr-4.md\\:pr-16', {
                text(text) {
                    abstract += text.text
                },
            })
            .on('div.pb-10.md\\:pt-3 .author span.contents', {
                text(text) {
                    if (text.text) {
                        // remove \n and extra spaces
                        const theAuthor = text.text.replace(/\n/g, '').trim()
                        if (theAuthor) {
                            authorList.push(theAuthor)
                        }
                    }
                },
            })
            .on('time', {
                element(element) {
                    date_published = element.getAttribute('datetime')
                },
            })
            .transform(res)
            .arrayBuffer()
        if (abstract.startsWith('Abstract\n')) {
            abstract = abstract.substring('Abstract\n'.length)
        }
        abstract = abstract.replace(/\n/g, ' ').trim()
        if (date_published && !(date_published as string).endsWith('Z')) {
            date_published = `${date_published}Z`
        }
        return { abstract, date_published, author: authorList.join(', ').trim() }
    }

    generateRss(papers: Paper[]): string {
        const rssItems = papers
            .map(paper => {
                const pubDate = paper.date_published
                    ? new Date(paper.date_published).toUTCString()
                    : new Date().toUTCString()
                return `
          <item>
            <title>${paper.title}</title>
            <link>${paper.url}</link>
            <description>${paper.abstract}</description>
            <pubDate>${pubDate}</pubDate>
            <author>${paper.author}</author>
          </item>
        `
            })
            .join('')
        return `
      <rss version="2.0">
        <channel>
          <title>Hugging Face Daily Papers</title>
          <link>${BASE_URL}</link>
          <description>Daily papers from Hugging Face</description>
          ${rssItems}
        </channel>
      </rss>
    `
    }
}
