"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlGenerator = void 0;
const path = __importStar(require("path"));
/**
 * HTML generator class for creating index pages from tree structures
 */
class HtmlGenerator {
    /**
     * Generates a minimal HTML index page from the tree structure
     * @param tree The tree structure of HTML files
     * @param options Generation options
     * @returns HTML string content
     */
    static generateIndex(tree, options = {}) {
        const { title = 'Test Reports Index', repositoryName = '', commitSha = '', timestamp = new Date().toISOString() } = options;
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
        
        .file-tree {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .file-list {
            list-style: none;
        }
        
        .file-item {
            margin: 8px 0;
            padding: 12px 16px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #007bff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        
        .file-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
        }
        
        .file-item a:hover {
            color: #007bff;
        }
        
        .file-icon {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .file-path {
            font-size: 0.85rem;
            color: #6c757d;
            margin-top: 4px;
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
        
        .stats {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            margin-top: 20px;
        }
        
        .stats-number {
            font-size: 2rem;
            font-weight: bold;
            color: #1976d2;
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
            <h1>📊 ${title}</h1>
            <div class="subtitle">Quick access to test reports and documentation</div>
        </div>
        
        ${this.generateMetadata(repositoryName, commitSha, timestamp)}
        
        <div class="content">
            ${this.generateFileList(tree)}
            
            <div class="stats">
                <div class="stats-number">${this.countFiles(tree)}</div>
                <div>HTML Reports Found</div>
            </div>
        </div>
        
        <div class="footer">
            Generated by <strong>GitHub Pages Quick Index</strong> • ${new Date(timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>`;
        return htmlContent;
    }
    /**
     * Generates metadata section HTML
     */
    static generateMetadata(repositoryName, commitSha, timestamp) {
        const items = [];
        if (repositoryName) {
            items.push(`<span>📁 Repository: <strong>${repositoryName}</strong></span>`);
        }
        if (commitSha) {
            const shortSha = commitSha.substring(0, 7);
            items.push(`<span>🔗 Commit: <strong>${shortSha}</strong></span>`);
        }
        items.push(`<span>🕒 Generated: <strong>${new Date(timestamp).toLocaleString()}</strong></span>`);
        return `<div class="metadata">${items.join('')}</div>`;
    }
    /**
     * Generates the file list HTML from tree structure
     */
    static generateFileList(tree) {
        const sections = this.organizeByDirectory(tree);
        let html = '';
        for (const [dirName, files] of sections) {
            if (dirName !== 'root') {
                html += `<div class="directory-section">
          <div class="directory-title">📁 ${dirName}</div>
          <ul class="file-list">`;
            }
            else {
                html += `<ul class="file-list">`;
            }
            for (const file of files) {
                const relativePath = this.getRelativePath(file.path);
                const fileName = path.basename(file.path);
                html += `<li class="file-item">
          <a href="${relativePath}" target="_blank">
            <span class="file-icon">📄</span>
            <div>
              <div>${fileName}</div>
              <div class="file-path">${relativePath}</div>
            </div>
          </a>
        </li>`;
            }
            html += `</ul>`;
            if (dirName !== 'root') {
                html += `</div>`;
            }
        }
        return html;
    }
    /**
     * Organizes files by directory for better presentation
     */
    static organizeByDirectory(tree) {
        const sections = new Map();
        const collectFiles = (node, currentDir = 'root') => {
            if (node.type === 'file') {
                if (!sections.has(currentDir)) {
                    sections.set(currentDir, []);
                }
                sections.get(currentDir).push(node);
            }
            else if (node.children) {
                for (const child of node.children) {
                    if (child.type === 'file') {
                        const dirKey = currentDir === 'root' ? node.name : `${currentDir}/${node.name}`;
                        if (!sections.has(dirKey)) {
                            sections.set(dirKey, []);
                        }
                        sections.get(dirKey).push(child);
                    }
                    else {
                        const newDir = currentDir === 'root' ? node.name : `${currentDir}/${node.name}`;
                        collectFiles(child, newDir);
                    }
                }
            }
        };
        if (tree.children) {
            for (const child of tree.children) {
                collectFiles(child);
            }
        }
        return sections;
    }
    /**
     * Gets relative path for HTML links
     */
    static getRelativePath(filePath) {
        // Remove leading './' if present
        return filePath.startsWith('./') ? filePath.substring(2) : filePath;
    }
    /**
     * Counts total number of files in the tree
     */
    static countFiles(tree) {
        let count = 0;
        const countRecursive = (node) => {
            if (node.type === 'file') {
                count++;
            }
            else if (node.children) {
                for (const child of node.children) {
                    countRecursive(child);
                }
            }
        };
        countRecursive(tree);
        return count;
    }
}
exports.HtmlGenerator = HtmlGenerator;
//# sourceMappingURL=html-generator.js.map