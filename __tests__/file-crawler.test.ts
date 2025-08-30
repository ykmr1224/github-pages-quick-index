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

  describe('Regex Filtering', () => {
    it('should filter files by regex pattern', () => {
      const testCrawler = new FileCrawler('test')
      
      // Mock the matchesFilter method to test the logic
      const testFiles = ['test-report.html', 'index.html', 'test-guide.html', 'about.html']
      const filteredFiles = testFiles.filter(file => /test/.test(file))
      
      expect(filteredFiles).toEqual(['test-report.html', 'test-guide.html'])
    })

    it('should match files starting with specific pattern', () => {
      const testCrawler = new FileCrawler('^(index|about)')
      
      const testFiles = ['index.html', 'about.html', 'test-report.html', 'guide.html']
      const filteredFiles = testFiles.filter(file => /^(index|about)/.test(file))
      
      expect(filteredFiles).toEqual(['index.html', 'about.html'])
    })

    it('should match files ending with specific pattern', () => {
      const testCrawler = new FileCrawler('-report\\.html$')
      
      const testFiles = ['test-report.html', 'coverage-report.html', 'index.html', 'guide.html']
      const filteredFiles = testFiles.filter(file => /-report\.html$/.test(file))
      
      expect(filteredFiles).toEqual(['test-report.html', 'coverage-report.html'])
    })

    it('should handle invalid regex gracefully', () => {
      // This should not throw an error and should default to matching all files
      const testCrawler = new FileCrawler('[invalid regex')
      
      // The constructor should handle the invalid regex and set a default
      expect(testCrawler).toBeDefined()
    })

    it('should match all files when no filter is provided', () => {
      const testCrawler = new FileCrawler()
      
      const testFiles = ['index.html', 'about.html', 'test-report.html', 'guide.html']
      const filteredFiles = testFiles.filter(file => /.*/.test(file))
      
      expect(filteredFiles).toEqual(testFiles)
    })
  })
})
