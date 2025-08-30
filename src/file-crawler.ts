import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { TreeNode } from './types'

/**
 * File crawler class for finding HTML files and building tree structure
 */
export class FileCrawler {
  private htmlFiles: string[] = []
  
  /**
   * Crawls a directory recursively to find HTML files
   * @param dirPath The directory path to crawl
   * @returns Array of HTML file paths
   */
  async crawlDirectory(dirPath: string): Promise<string[]> {
    this.htmlFiles = []
    await this.crawlRecursive(dirPath)
    return this.htmlFiles
  }

  /**
   * Recursively crawls directories to find HTML files
   * @param currentPath Current directory path being crawled
   */
  private async crawlRecursive(currentPath: string): Promise<void> {
    try {
      const stats = await fs.promises.stat(currentPath)
      
      if (stats.isDirectory()) {
        const entries = await fs.promises.readdir(currentPath)
        
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry)
          await this.crawlRecursive(fullPath)
        }
      } else if (stats.isFile() && this.isHtmlFile(currentPath)) {
        this.htmlFiles.push(currentPath)
      }
    } catch (error) {
      core.warning(`Error accessing path ${currentPath}: ${error}`)
    }
  }

  /**
   * Checks if a file is an HTML file based on its extension
   * @param filePath The file path to check
   * @returns True if the file is an HTML file
   */
  private isHtmlFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase()
    return ext === '.html' || ext === '.htm'
  }

  /**
   * Builds a tree structure from the found HTML files
   * @param htmlFiles Array of HTML file paths
   * @param rootPath The root directory path
   * @returns Tree structure representing the HTML files
   */
  buildTreeStructure(htmlFiles: string[], rootPath: string): TreeNode {
    const root: TreeNode = {
      name: path.basename(rootPath) || rootPath,
      path: rootPath,
      type: 'directory',
      children: []
    }

    // Create a map to store directory nodes
    const nodeMap = new Map<string, TreeNode>()
    nodeMap.set(rootPath, root)

    // Sort files to ensure consistent ordering
    const sortedFiles = htmlFiles.sort()

    for (const filePath of sortedFiles) {
      const relativePath = path.relative(rootPath, filePath)
      const pathParts = relativePath.split(path.sep)
      
      let currentPath = rootPath
      let currentNode = root

      // Create directory nodes as needed
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath = path.join(currentPath, pathParts[i])
        
        if (!nodeMap.has(currentPath)) {
          const dirNode: TreeNode = {
            name: pathParts[i],
            path: currentPath,
            type: 'directory',
            children: []
          }
          
          nodeMap.set(currentPath, dirNode)
          currentNode.children!.push(dirNode)
          currentNode = dirNode
        } else {
          currentNode = nodeMap.get(currentPath)!
        }
      }

      // Add the HTML file node
      const fileName = pathParts[pathParts.length - 1]
      const fileNode: TreeNode = {
        name: fileName,
        path: filePath,
        type: 'file'
      }
      
      currentNode.children!.push(fileNode)
    }

    // Sort children in each directory (directories first, then files)
    this.sortTreeNodes(root)

    return root
  }

  /**
   * Recursively sorts tree nodes (directories first, then files, both alphabetically)
   * @param node The tree node to sort
   */
  private sortTreeNodes(node: TreeNode): void {
    if (node.children) {
      node.children.sort((a, b) => {
        // Directories come before files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1
        }
        // Within the same type, sort alphabetically
        return a.name.localeCompare(b.name)
      })

      // Recursively sort children
      for (const child of node.children) {
        this.sortTreeNodes(child)
      }
    }
  }
}
