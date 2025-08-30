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
const fs = __importStar(require("fs"));
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
        // Load HTML template
        const templatePath = path.join(__dirname, 'templates', 'index.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        // Replace template variables
        template = template.replace(/\{\{title\}\}/g, title);
        template = template.replace(/\{\{metadata\}\}/g, this.generateMetadata(repositoryName, commitSha, timestamp));
        template = template.replace(/\{\{fileList\}\}/g, this.generateFileList(tree));
        template = template.replace(/\{\{fileCount\}\}/g, this.countFiles(tree).toString());
        template = template.replace(/\{\{generatedTime\}\}/g, new Date(timestamp).toLocaleString());
        return template;
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
            <div class="file-info">
              <div class="file-name">${fileName}</div>
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