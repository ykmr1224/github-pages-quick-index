import { FileCrawler } from '../src/file-crawler'

describe('FileCrawler', () => {
  let crawler: FileCrawler

  beforeEach(() => {
    crawler = new FileCrawler()
  })

  it('should build correct tree structure', () => {
    const htmlFiles = [
      '/root/index.html',
      '/root/about.html',
      '/root/docs/guide.html',
      '/root/docs/api/reference.html'
    ]
    const rootPath = '/root'

    const tree = crawler.buildTreeStructure(htmlFiles, rootPath)

    expect(tree.name).toBe('root')
    expect(tree.type).toBe('directory')
    expect(tree.children).toHaveLength(3) // about.html, docs/, index.html
    
    // Check that files are sorted correctly (directories first, then files, both alphabetically)
    expect(tree.children![0].name).toBe('docs')
    expect(tree.children![0].type).toBe('directory')
    expect(tree.children![1].name).toBe('about.html')
    expect(tree.children![1].type).toBe('file')
    expect(tree.children![2].name).toBe('index.html')
    expect(tree.children![2].type).toBe('file')
  })

  it('should handle nested directory structures', () => {
    const htmlFiles = [
      '/root/docs/api/v1/endpoints.html',
      '/root/docs/api/v2/endpoints.html',
      '/root/docs/guides/getting-started.html'
    ]
    const rootPath = '/root'

    const tree = crawler.buildTreeStructure(htmlFiles, rootPath)

    expect(tree.name).toBe('root')
    expect(tree.type).toBe('directory')
    expect(tree.children).toHaveLength(1) // Only docs directory
    
    const docsDir = tree.children![0]
    expect(docsDir.name).toBe('docs')
    expect(docsDir.type).toBe('directory')
    expect(docsDir.children).toHaveLength(2) // api and guides directories
  })

  it('should handle empty file list', () => {
    const htmlFiles: string[] = []
    const rootPath = '/root'

    const tree = crawler.buildTreeStructure(htmlFiles, rootPath)

    expect(tree.name).toBe('root')
    expect(tree.type).toBe('directory')
    expect(tree.children).toHaveLength(0)
  })

  it('should handle single file', () => {
    const htmlFiles = ['/root/index.html']
    const rootPath = '/root'

    const tree = crawler.buildTreeStructure(htmlFiles, rootPath)

    expect(tree.name).toBe('root')
    expect(tree.type).toBe('directory')
    expect(tree.children).toHaveLength(1)
    expect(tree.children![0].name).toBe('index.html')
    expect(tree.children![0].type).toBe('file')
  })
})
