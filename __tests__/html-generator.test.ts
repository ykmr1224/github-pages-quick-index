import { HtmlGenerator } from '../src/html-generator'

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

  it('should handle nested directory structure', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: [
        {
          name: 'unit',
          path: './reports/unit',
          type: 'directory' as const,
          children: [
            {
              name: 'results.html',
              path: './reports/unit/results.html',
              type: 'file' as const
            }
          ]
        },
        {
          name: 'integration',
          path: './reports/integration',
          type: 'directory' as const,
          children: [
            {
              name: 'api-tests.html',
              path: './reports/integration/api-tests.html',
              type: 'file' as const
            }
          ]
        }
      ]
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('unit')
    expect(html).toContain('integration')
    expect(html).toContain('results.html')
    expect(html).toContain('api-tests.html')
    expect(html).toContain('href="reports/unit/results.html"')
    expect(html).toContain('href="reports/integration/api-tests.html"')
  })

  it('should include proper CSS styling', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: []
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('<style>')
    expect(html).toContain('font-family:')
    expect(html).toContain('background:')
    expect(html).toContain('.container')
    expect(html).toContain('.header')
    expect(html).toContain('@media')
  })

  it('should include metadata when provided', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: []
    }

    const html = HtmlGenerator.generateIndex(tree, {
      repositoryName: 'owner/repo',
      commitSha: 'abcdef123456',
      timestamp: '2025-01-01T12:00:00.000Z'
    })
    
    expect(html).toContain('owner/repo')
    expect(html).toContain('abcdef1') // Short SHA
    expect(html).toContain('Generated:')
  })

  it('should handle files with special characters in names', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: [
        {
          name: 'test-report (v2).html',
          path: './reports/test-report (v2).html',
          type: 'file' as const
        },
        {
          name: 'coverage & metrics.html',
          path: './reports/coverage & metrics.html',
          type: 'file' as const
        }
      ]
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('test-report (v2).html')
    expect(html).toContain('coverage & metrics.html')
    expect(html).toContain('href="reports/test-report (v2).html"')
    expect(html).toContain('href="reports/coverage & metrics.html"')
  })

  it('should generate responsive design elements', () => {
    const tree = {
      name: 'reports',
      path: './reports',
      type: 'directory' as const,
      children: []
    }

    const html = HtmlGenerator.generateIndex(tree)
    
    expect(html).toContain('viewport')
    expect(html).toContain('max-width: 768px')
    expect(html).toContain('box-sizing: border-box')
  })
})
