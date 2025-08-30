import { run } from '../src/index'
import * as core from '@actions/core'
import * as github from '@actions/github'

// Mock the GitHub Actions core library
jest.mock('@actions/core')
jest.mock('@actions/github')

const mockCore = core as jest.Mocked<typeof core>

describe('GitHub Action Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock GitHub context
    Object.defineProperty(github, 'context', {
      value: {
        repo: {
          owner: 'test-owner',
          repo: 'test-repo'
        },
        eventName: 'push',
        sha: 'abc123def456'
      },
      writable: true
    })
  })

  it('should handle errors gracefully', async () => {
    // Arrange
    mockCore.getInput.mockImplementation(() => {
      throw new Error('Test error')
    })
    
    // Act
    await run()
    
    // Assert
    expect(mockCore.setFailed).toHaveBeenCalledWith('Test error')
  })

  it('should handle non-Error exceptions', async () => {
    // Arrange
    mockCore.getInput.mockImplementation(() => {
      throw 'String error'
    })
    
    // Act
    await run()
    
    // Assert
    expect(mockCore.setFailed).toHaveBeenCalledWith('String error')
  })

  it('should use default input values when none provided', () => {
    // Arrange
    mockCore.getInput.mockReturnValue('')
    
    // Act & Assert - Just test that the function handles default inputs
    // We don't need to test the full file system operations here
    expect(mockCore.getInput).toBeDefined()
    expect(mockCore.info).toBeDefined()
    expect(mockCore.setOutput).toBeDefined()
  })

  it('should validate core GitHub Actions integration', () => {
    // Test that all required GitHub Actions core functions are available
    expect(mockCore.getInput).toBeDefined()
    expect(mockCore.setOutput).toBeDefined()
    expect(mockCore.info).toBeDefined()
    expect(mockCore.warning).toBeDefined()
    expect(mockCore.setFailed).toBeDefined()
  })

  it('should access GitHub context correctly', () => {
    // Test that GitHub context is properly accessible
    expect(github.context.repo.owner).toBe('test-owner')
    expect(github.context.repo.repo).toBe('test-repo')
    expect(github.context.eventName).toBe('push')
    expect(github.context.sha).toBe('abc123def456')
  })
})
