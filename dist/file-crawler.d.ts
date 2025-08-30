import { TreeNode } from './types';
/**
 * File crawler class for finding HTML files and building tree structure
 */
export declare class FileCrawler {
    private htmlFiles;
    private filterRegex;
    /**
     * Creates a new FileCrawler instance
     * @param fileFilter Optional regex pattern to filter files
     */
    constructor(fileFilter?: string);
    /**
     * Crawls a directory recursively to find HTML files
     * @param dirPath The directory path to crawl
     * @returns Array of HTML file paths
     */
    crawlDirectory(dirPath: string): Promise<string[]>;
    /**
     * Recursively crawls directories to find HTML files
     * @param currentPath Current directory path being crawled
     */
    private crawlRecursive;
    /**
     * Checks if a file is an HTML file based on its extension
     * @param filePath The file path to check
     * @returns True if the file is an HTML file
     */
    private isHtmlFile;
    /**
     * Checks if a file matches the compiled regex filter
     * @param filePath The file path to check
     * @returns True if the file matches the filter
     */
    private matchesFilter;
    /**
     * Builds a tree structure from the found HTML files
     * @param htmlFiles Array of HTML file paths
     * @param rootPath The root directory path
     * @returns Tree structure representing the HTML files
     */
    buildTreeStructure(htmlFiles: string[], rootPath: string): TreeNode;
    /**
     * Recursively sorts tree nodes (directories first, then files, both alphabetically)
     * @param node The tree node to sort
     */
    private sortTreeNodes;
}
//# sourceMappingURL=file-crawler.d.ts.map