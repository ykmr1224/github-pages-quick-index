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

    // Embedded HTML template (generated during build)
    let template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header .subtitle {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .metadata {
            background: #f8f9fa;
            padding: 15px 30px;
            border-bottom: 1px solid #e9ecef;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .metadata span {
            margin-right: 20px;
        }
        
        .content {
            padding: 30px;
        }
        
        .search-container {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .search-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 16px 12px 16px;
            padding-right: 45px;
            font-size: 1rem;
            border: 2px solid #dee2e6;
            border-radius: 6px;
            background: white;
            transition: border-color 0.15s ease;
            font-family: inherit;
        }
        
        .search-clear-btn {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #6c757d;
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            transition: all 0.15s ease;
            display: none;
        }
        
        .search-clear-btn:hover {
            background: #e9ecef;
            color: #495057;
        }
        
        .search-clear-btn.visible {
            display: block;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
        
        .search-info {
            margin-top: 10px;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .file-tree {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .file-item.hidden {
            display: none;
        }
        
        .directory-section.hidden {
            display: none;
        }
        
        .file-list {
            list-style: none;
        }
        
        .file-item {
            margin: 2px 0;
            padding: 6px 12px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #007bff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            transition: all 0.15s ease;
        }
        
        .file-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.12);
            border-left-width: 4px;
        }
        
        .file-item.directory {
            border-left-color: #28a745;
            background: #f8fff9;
        }
        
        .file-item a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            display: flex;
            align-items: center;
            min-height: 24px;
        }
        
        .file-item a:hover {
            color: #007bff;
        }
        
        .file-icon {
            margin-right: 8px;
            font-size: 1rem;
            flex-shrink: 0;
        }
        
        .file-info {
            flex: 1;
            min-width: 0;
        }
        
        .file-name {
            font-size: 0.9rem;
            line-height: 1.3;
            margin: 0;
        }
        
        .file-path {
            font-size: 0.75rem;
            color: #6c757d;
            margin-top: 1px;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .directory-section {
            margin-bottom: 25px;
        }
        
        .directory-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #495057;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9rem;
            border-top: 1px solid #e9ecef;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 {{title}}</h1>
            <div class="subtitle">Quick access to test reports and documentation</div>
        </div>
        
        {{metadata}}
        
        <div class="content">
            <div class="search-container">
                <div class="search-input-wrapper">
                    <input type="text" id="searchInput" placeholder="Filter files by path..." class="search-input">
                    <button type="button" id="searchClearBtn" class="search-clear-btn" title="Clear search (ESC)">×</button>
                </div>
                <div class="search-info">
                    <span id="searchResults"></span>
                </div>
            </div>
            {{fileList}}
        </div>
        
        <div class="footer">
            Generated by <strong>GitHub Pages Quick Index</strong> 
            <a href="https://github.com/ykmr1224/github-pages-quick-index" target="_blank" style="color: #6c757d; text-decoration: none; margin-left: 8px;">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
            </a>
            • {{generatedTime}}
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            const searchClearBtn = document.getElementById('searchClearBtn');
            const searchResults = document.getElementById('searchResults');
            const fileItems = document.querySelectorAll('.file-item');
            const directorySections = document.querySelectorAll('.directory-section');
            const totalFiles = fileItems.length;
            
            function updateSearchResults(visibleCount) {
                if (searchInput.value.trim() === '') {
                    searchResults.textContent = 'Showing all ' + totalFiles + ' files';
                } else {
                    searchResults.textContent = 'Showing ' + visibleCount + ' of ' + totalFiles + ' files';
                }
            }
            
            function filterFiles() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                let visibleCount = 0;
                
                // Show/hide clear button based on input content
                if (searchTerm === '') {
                    searchClearBtn.classList.remove('visible');
                } else {
                    searchClearBtn.classList.add('visible');
                }
                
                // Show/hide individual file items
                fileItems.forEach(function(item) {
                    const filePath = item.getAttribute('data-path').toLowerCase();
                    const isVisible = searchTerm === '' || filePath.includes(searchTerm);
                    
                    if (isVisible) {
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        item.classList.add('hidden');
                    }
                });
                
                // Show/hide directory sections based on whether they have visible files
                directorySections.forEach(function(section) {
                    const visibleFilesInSection = section.querySelectorAll('.file-item:not(.hidden)');
                    if (visibleFilesInSection.length > 0) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                });
                
                // Handle root level files (not in directory sections)
                const rootFileList = document.querySelector('.file-list');
                if (rootFileList && !rootFileList.closest('.directory-section')) {
                    const visibleRootFiles = rootFileList.querySelectorAll('.file-item:not(.hidden)');
                    if (visibleRootFiles.length === 0 && searchTerm !== '') {
                        rootFileList.style.display = 'none';
                    } else {
                        rootFileList.style.display = '';
                    }
                }
                
                updateSearchResults(visibleCount);
            }
            
            function clearSearch() {
                searchInput.value = '';
                filterFiles();
                searchInput.focus();
            }
            
            // Initialize search results display
            updateSearchResults(totalFiles);
            
            // Add event listener for real-time filtering
            searchInput.addEventListener('input', filterFiles);
            
            // Add clear button click handler
            searchClearBtn.addEventListener('click', clearSearch);
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Ctrl/Cmd + K to focus search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
                // ESC to clear search (only when search input is focused)
                else if (e.key === 'Escape' && document.activeElement === searchInput) {
                    e.preventDefault();
                    clearSearch();
                }
            });
        });
    </script>
</body>
</html>
`

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
