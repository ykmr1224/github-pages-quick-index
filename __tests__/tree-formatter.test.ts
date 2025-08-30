import { TreeFormatter } from '../src/tree-formatter'

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

  it('should format empty tree correctly', () => {
    const tree = {
      name: 'empty',
      path: '/empty',
      type: 'directory' as const,
      children: []
    }

    const result = TreeFormatter.treeToString(tree)
    
    expect(result).toContain('empty/')
    expect(result).not.toContain('├──')
    expect(result).not.toContain('└──')
  })

  it('should format single file tree correctly', () => {
    const tree = {
      name: 'root',
      path: '/root',
      type: 'directory' as const,
      children: [
        {
          name: 'single.html',
          path: '/root/single.html',
          type: 'file' as const
        }
      ]
    }

    const result = TreeFormatter.treeToString(tree)
    
    expect(result).toContain('root/')
    expect(result).toContain('└── single.html')
    expect(result).not.toContain('├──')
  })

  it('should format JSON without pretty printing when specified', () => {
    const tree = {
      name: 'root',
      path: '/root',
      type: 'directory' as const,
      children: []
    }

    const result = TreeFormatter.treeToJson(tree, false)
    
    expect(result).not.toContain('\n')
    expect(result).not.toContain('  ')
    expect(result).toContain('{"name":"root"')
  })

  it('should handle complex nested structure', () => {
    const tree = {
      name: 'project',
      path: '/project',
      type: 'directory' as const,
      children: [
        {
          name: 'api',
          path: '/project/api',
          type: 'directory' as const,
          children: [
            {
              name: 'v1',
              path: '/project/api/v1',
              type: 'directory' as const,
              children: [
                {
                  name: 'docs.html',
                  path: '/project/api/v1/docs.html',
                  type: 'file' as const
                }
              ]
            }
          ]
        },
        {
          name: 'readme.html',
          path: '/project/readme.html',
          type: 'file' as const
        }
      ]
    }

    const result = TreeFormatter.treeToString(tree)
    
    expect(result).toContain('project/')
    expect(result).toContain('├── api/')
    expect(result).toContain('└── readme.html')
    expect(result).toContain('└── v1/')
    expect(result).toContain('└── docs.html')
  })
})
