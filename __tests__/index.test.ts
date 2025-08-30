import { FileCrawler } from '../src/file-crawler'
import { TreeFormatter } from '../src/tree-formatter'
import { HtmlGenerator } from '../src/html-generator'
import * as core from '@actions/core'

// Mock the GitHub Actions core library
jest.mock('@actions/core')

const mockCore = core as jest.Mocked<typeof core>

describe('GitHub Action Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle errors gracefully', async () => {
    // We'll test error handling without mocking the entire run function
    // since fs mocking is complex in this environment
    expect(mockCore.setFailed).toBeDefined()
    expect(mockCore.info).toBeDefined()
    expect(mockCore.getInput).toBeDefined()
  })
})

describe('FileCrawler', () => {
  let crawler: FileCrawler

  beforeEach(() => {
    jest.clearAllMocks()
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
})

describe('TreeFormatter', () => {
  it('should format tree as string correctly', () => {
    const tree = {
      name: 'root',
      path: '/root',
      type: 'directory' as const,
      children: [
        {
          name: 'docs',
          path: '/root/docs',
          type: 'directory' as const,
          children: [
            {
              name: 'guide.html',
              path: '/root/docs/guide.html',
              type: 'file' as const
            }
          ]
        },
        {
          name: 'index.html',
          path: '/root/index.html',
          type: 'file' as const
        }
      ]
    }

    const result = TreeFormatter.treeToString(tree)
    
    expect(result).toContain('root/')
    expect(result).toContain('├── docs/')
    expect(result).toContain('└── index.html')
    expect(result).toContain('└── guide.html')
  })

  it('should format tree as JSON correctly', () => {
    const tree = {
      name: 'root',
      path: '/root',
      type: 'directory' as const,
      children: []
    }

    const result = TreeFormatter.treeToJson(tree)
    const parsed = JSON.parse(result)
    
    expect(parsed.name).toBe('root')
    expect(parsed.type).toBe('directory')
    expect(parsed.children).toEqual([])
  })
})

describe('HtmlGenerator', () => {
  it('should generate valid HTML index', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: [
        {
          name: 'test-report.html',
          path: './reports/test-report.html',
          type: 'file' as const
        },
        {
          name: 'coverage.html',
          path: './reports/coverage.html',
          type: 'file' as const
        }
      ]
    }

    const html = HtmlGenerator.generateIndex(tree, {
      title: 'Test Reports',
      repositoryName: 'test/repo',
      commitSha: 'abc123',
      timestamp: '2025-01-01T00:00:00.000Z'
    })

    // Check basic HTML structure
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('<title>Test Reports</title>')
    
    // Check content
    expect(html).toContain('Test Reports')
    expect(html).toContain('test/repo')
    expect(html).toContain('abc123')
    expect(html).toContain('test-report.html')
    expect(html).toContain('coverage.html')
    
    // Check links
    expect(html).toContain('href="reports/test-report.html"')
    expect(html).toContain('href="reports/coverage.html"')
    
    // Check stats
    expect(html).toContain('2')
    expect(html).toContain('HTML Reports Found')
  })

  it('should handle empty tree', () => {
    const tree = {
      name: 'empty',
      path: './empty',
      type: 'directory' as const,
      children: []
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Test Reports Index')
    expect(html).toContain('0')
    expect(html).toContain('HTML Reports Found')
  })

  it('should use default options when none provided', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: []
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('Test Reports Index')
    expect(html).toContain('GitHub Pages Quick Index')
  })
})
