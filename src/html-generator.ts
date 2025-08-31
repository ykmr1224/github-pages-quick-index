import * as path from 'path'
import { TreeNode } from './types'
import { indexTemplate } from './compiled-templates'

/**
 * HTML generator class for creating index pages from tree structures
 */
export class HtmlGenerator {
  /**
   * Generates a minimal HTML index page from the tree structure
   * @param tree The tree structure of HTML files
   * @param options Generation options
   * @returns HTML string content
   */
  static generateIndex(tree: TreeNode, options: {
    title?: string
    repositoryName?: string
    commitSha?: string
    timestamp?: string
  } = {}): string {
    const {
      title = 'Test Reports Index',
      repositoryName = '',
      commitSha = '',
      timestamp = new Date().toISOString()
    } = options

    // Use precompiled template
    const templateData = {
      title,
      metadata: this.generateMetadata(repositoryName, commitSha, timestamp),
      fileList: this.generateFileList(tree),
      fileCount: this.countFiles(tree).toString(),
      generatedTime: new Date(timestamp).toLocaleString()
    }

    return indexTemplate(templateData)
  }

  /**
   * Generates metadata section HTML
   */
  private static generateMetadata(repositoryName: string, commitSha: string, timestamp: string): string {
    const items = []
    
    if (repositoryName) {
      items.push(`<span>📁 Repository: <strong>${repositoryName}</strong></span>`)
    }
    
    if (commitSha) {
      const shortSha = commitSha.substring(0, 7)
      items.push(`<span>🔗 Commit: <strong>${shortSha}</strong></span>`)
    }
    
    items.push(`<span>🕒 Generated: <strong>${new Date(timestamp).toLocaleString()}</strong></span>`)
    
    return items.join('')
  }

  /**
   * Generates the file list HTML from tree structure
   */
  private static generateFileList(tree: TreeNode): string {
    const sections = this.organizeByDirectory(tree)
    let html = ''

    for (const [dirName, files] of sections) {
      if (dirName !== 'root') {
        html += `<div class="directory-section">
          <div class="directory-title">📁 ${dirName}</div>
          <ul class="file-list">`
      } else {
        html += `<ul class="file-list">`
      }

      for (const file of files) {
        const relativePath = this.getRelativePath(file.path)
        const fileName = path.basename(file.path)
        
        html += `<li class="file-item" data-path="${relativePath}">
          <a href="${relativePath}" target="_blank">
            <span class="file-icon">📄</span>
            <div class="file-info">
              <div class="file-name">${fileName}</div>
            </div>
          </a>
        </li>`
      }

      html += `</ul>`
      
      if (dirName !== 'root') {
        html += `</div>`
      }
    }

    return html
  }

  /**
   * Organizes files by directory for better presentation, sorted alphabetically
   */
  private static organizeByDirectory(tree: TreeNode): Map<string, TreeNode[]> {
    const sections = new Map<string, TreeNode[]>()
    
    const collectFiles = (node: TreeNode, currentDir: string = 'root', depth: number = 0) => {
      if (node.type === 'file') {
        if (!sections.has(currentDir)) {
          sections.set(currentDir, [])
        }
        sections.get(currentDir)!.push(node)
      } else if (node.children) {
        for (const child of node.children) {
          if (child.type === 'file') {
            const dirKey = currentDir === 'root' ? node.name : `${currentDir}/${node.name}`
            if (!sections.has(dirKey)) {
              sections.set(dirKey, [])
            }
            sections.get(dirKey)!.push(child)
          } else {
            const newDir = currentDir === 'root' ? node.name : `${currentDir}/${node.name}`
            collectFiles(child, newDir, depth + 1)
          }
        }
      }
    }

    if (tree.children) {
      for (const child of tree.children) {
        collectFiles(child)
      }
    }

    // Sort sections alphabetically (dictionary order)
    const sortedSections = new Map<string, TreeNode[]>()
    const sortedKeys = Array.from(sections.keys()).sort((a, b) => {
      // Sort alphabetically, with 'root' always first
      if (a === 'root') return -1
      if (b === 'root') return 1
      return a.localeCompare(b)
    })
    
    for (const key of sortedKeys) {
      sortedSections.set(key, sections.get(key)!)
    }

    return sortedSections
  }

  /**
   * Gets relative path for HTML links
   */
  private static getRelativePath(filePath: string): string {
    // Remove leading './' if present
    return filePath.startsWith('./') ? filePath.substring(2) : filePath
  }

  /**
   * Counts total number of files in the tree
   */
  private static countFiles(tree: TreeNode): number {
    let count = 0
    
    const countRecursive = (node: TreeNode) => {
      if (node.type === 'file') {
        count++
      } else if (node.children) {
        for (const child of node.children) {
          countRecursive(child)
        }
      }
    }
    
    countRecursive(tree)
    return count
  }
}
