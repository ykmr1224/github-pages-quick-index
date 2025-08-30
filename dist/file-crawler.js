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
exports.FileCrawler = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * File crawler class for finding HTML files and building tree structure
 */
class FileCrawler {
    htmlFiles = [];
    filterRegex = /.*/; // Default matches everything
    /**
     * Creates a new FileCrawler instance
     * @param fileFilter Optional regex pattern to filter files
     */
    constructor(fileFilter) {
        if (fileFilter && fileFilter.trim() !== '') {
            try {
                this.filterRegex = new RegExp(fileFilter);
            }
            catch (error) {
                core.warning(`Invalid regex pattern "${fileFilter}": ${error}`);
                this.filterRegex = /.*/; // If regex is invalid, include all files
            }
        }
    }
    /**
     * Crawls a directory recursively to find HTML files
     * @param dirPath The directory path to crawl
     * @returns Array of HTML file paths
     */
    async crawlDirectory(dirPath) {
        this.htmlFiles = [];
        await this.crawlRecursive(dirPath);
        return this.htmlFiles;
    }
    /**
     * Recursively crawls directories to find HTML files
     * @param currentPath Current directory path being crawled
     */
    async crawlRecursive(currentPath) {
        try {
            const stats = await fs.promises.stat(currentPath);
            if (stats.isDirectory()) {
                const entries = await fs.promises.readdir(currentPath);
                for (const entry of entries) {
                    const fullPath = path.join(currentPath, entry);
                    await this.crawlRecursive(fullPath);
                }
            }
            else if (stats.isFile() && this.isHtmlFile(currentPath) && this.matchesFilter(currentPath)) {
                this.htmlFiles.push(currentPath);
            }
        }
        catch (error) {
            core.warning(`Error accessing path ${currentPath}: ${error}`);
        }
    }
    /**
     * Checks if a file is an HTML file based on its extension
     * @param filePath The file path to check
     * @returns True if the file is an HTML file
     */
    isHtmlFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return ext === '.html' || ext === '.htm';
    }
    /**
     * Checks if a file matches the compiled regex filter
     * @param filePath The file path to check
     * @returns True if the file matches the filter
     */
    matchesFilter(filePath) {
        const fileName = path.basename(filePath);
        return this.filterRegex.test(fileName);
    }
    /**
     * Builds a tree structure from the found HTML files
     * @param htmlFiles Array of HTML file paths
     * @param rootPath The root directory path
     * @returns Tree structure representing the HTML files
     */
    buildTreeStructure(htmlFiles, rootPath) {
        const root = {
            name: path.basename(rootPath) || rootPath,
            path: rootPath,
            type: 'directory',
            children: []
        };
        // Create a map to store directory nodes
        const nodeMap = new Map();
        nodeMap.set(rootPath, root);
        // Sort files to ensure consistent ordering
        const sortedFiles = htmlFiles.sort();
        for (const filePath of sortedFiles) {
            const relativePath = path.relative(rootPath, filePath);
            const pathParts = relativePath.split(path.sep);
            let currentPath = rootPath;
            let currentNode = root;
            // Create directory nodes as needed
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentPath = path.join(currentPath, pathParts[i]);
                if (!nodeMap.has(currentPath)) {
                    const dirNode = {
                        name: pathParts[i],
                        path: currentPath,
                        type: 'directory',
                        children: []
                    };
                    nodeMap.set(currentPath, dirNode);
                    currentNode.children.push(dirNode);
                    currentNode = dirNode;
                }
                else {
                    currentNode = nodeMap.get(currentPath);
                }
            }
            // Add the HTML file node
            const fileName = pathParts[pathParts.length - 1];
            const fileNode = {
                name: fileName,
                path: filePath,
                type: 'file'
            };
            currentNode.children.push(fileNode);
        }
        // Sort children in each directory (directories first, then files)
        this.sortTreeNodes(root);
        return root;
    }
    /**
     * Recursively sorts tree nodes (directories first, then files, both alphabetically)
     * @param node The tree node to sort
     */
    sortTreeNodes(node) {
        if (node.children) {
            node.children.sort((a, b) => {
                // Directories come before files
                if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                }
                // Within the same type, sort alphabetically
                return a.name.localeCompare(b.name);
            });
            // Recursively sort children
            for (const child of node.children) {
                this.sortTreeNodes(child);
            }
        }
    }
}
exports.FileCrawler = FileCrawler;
//# sourceMappingURL=file-crawler.js.map