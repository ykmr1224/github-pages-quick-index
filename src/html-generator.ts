import * as path from 'path'
import * as fs from 'fs'
import { TreeNode } from './types'

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

    // Load HTML template
    const templatePath = path.join(__dirname, 'templates', 'index.html')
    let template = fs.readFileSync(templatePath, 'utf8')

    // Replace template variables
    template = template.replace(/\{\{title\}\}/g, title)
    template = template.replace(/\{\{metadata\}\}/g, this.generateMetadata(repositoryName, commitSha, timestamp))
    template = template.replace(/\{\{fileList\}\}/g, this.generateFileList(tree))
    template = template.replace(/\{\{fileCount\}\}/g, this.countFiles(tree).toString())
    template = template.replace(/\{\{generatedTime\}\}/g, new Date(timestamp).toLocaleString())

    return template
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
    
    return `<div class="metadata">${items.join('')}</div>`
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
        
        html += `<li class="file-item">
          <a href="${relativePath}" target="_blank">
            <span class="file-icon">📄</span>
            <div>
              <div>${fileName}</div>
              <div class="file-path">${relativePath}</div>
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
   * Organizes files by directory for better presentation
   */
  private static organizeByDirectory(tree: TreeNode): Map<string, TreeNode[]> {
    const sections = new Map<string, TreeNode[]>()
    
    const collectFiles = (node: TreeNode, currentDir: string = 'root') => {
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
            collectFiles(child, newDir)
          }
        }
      }
    }

    if (tree.children) {
      for (const child of tree.children) {
        collectFiles(child)
      }
    }

    return sections
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
