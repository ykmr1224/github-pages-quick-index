import { TreeNode } from './types';
/**
 * Utility class for formatting tree structures
 */
export declare class TreeFormatter {
    /**
     * Converts tree structure to a readable string representation
     * @param node The tree node to convert
     * @param indent Current indentation level
     * @returns String representation of the tree
     */
    static treeToString(node: TreeNode, indent?: string): string;
    /**
     * Converts tree structure to JSON string
     * @param node The tree node to convert
     * @param pretty Whether to format the JSON with indentation
     * @returns JSON string representation of the tree
     */
    static treeToJson(node: TreeNode, pretty?: boolean): string;
}
//# sourceMappingURL=tree-formatter.d.ts.map