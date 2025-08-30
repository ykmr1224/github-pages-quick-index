import { run } from '../src/index'
import * as core from '@actions/core'
import * as github from '@actions/github'

// Mock the GitHub Actions core library
jest.mock('@actions/core')
jest.mock('@actions/github')

const mockCore = core as jest.Mocked<typeof core>

describe('GitHub Action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock GitHub context
    Object.defineProperty(github, 'context', {
      value: {
        repo: {
          owner: 'test-owner',
          repo: 'test-repo'
        },
        eventName: 'push'
      },
      writable: true
    })
  })

  it('should run successfully with valid input', async () => {
    // Arrange
    mockCore.getInput.mockReturnValue('test-input')
    
    // Act
    await run()
    
    // Assert
    expect(mockCore.getInput).toHaveBeenCalledWith('example-input')
    expect(mockCore.info).toHaveBeenCalledWith('Hello test-input!')
    expect(mockCore.info).toHaveBeenCalledWith('Repository: test-owner/test-repo')
    expect(mockCore.info).toHaveBeenCalledWith('Event: push')
    expect(mockCore.setOutput).toHaveBeenCalledWith('example-output', 'Processed: test-input')
    expect(mockCore.info).toHaveBeenCalledWith('Action completed successfully!')
    expect(mockCore.setFailed).not.toHaveBeenCalled()
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
})
