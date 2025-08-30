/**
 * Represents a node in the file tree structure
 */
export interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: TreeNode[];
}
//# sourceMappingURL=types.d.ts.map