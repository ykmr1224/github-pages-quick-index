import { TreeNode } from './types';
/**
 * HTML generator class for creating index pages from tree structures
 */
export declare class HtmlGenerator {
    /**
     * Generates a minimal HTML index page from the tree structure
     * @param tree The tree structure of HTML files
     * @param options Generation options
     * @returns HTML string content
     */
    static generateIndex(tree: TreeNode, options?: {
        title?: string;
        repositoryName?: string;
        commitSha?: string;
        timestamp?: string;
    }): string;
    /**
     * Generates metadata section HTML
     */
    private static generateMetadata;
    /**
     * Generates the file list HTML from tree structure
     */
    private static generateFileList;
    /**
     * Organizes files by directory for better presentation, with shallower directories first
     */
    private static organizeByDirectory;
    /**
     * Gets relative path for HTML links
     */
    private static getRelativePath;
    /**
     * Counts total number of files in the tree
     */
    private static countFiles;
}
//# sourceMappingURL=html-generator.d.ts.map