"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeFormatter = void 0;
/**
 * Utility class for formatting tree structures
 */
class TreeFormatter {
    /**
     * Converts tree structure to a readable string representation
     * @param node The tree node to convert
     * @param indent Current indentation level
     * @returns String representation of the tree
     */
    static treeToString(node, indent = '') {
        let result = '';
        // Only add the root node name if we're at the top level
        if (indent === '') {
            result = `${node.name}${node.type === 'directory' ? '/' : ''}\n`;
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const isLast = i === node.children.length - 1;
                const childIndent = indent + (isLast ? '└── ' : '├── ');
                const nextIndent = indent + (isLast ? '    ' : '│   ');
                result += `${childIndent}${child.name}${child.type === 'directory' ? '/' : ''}\n`;
                if (child.children && child.children.length > 0) {
                    result += this.treeToString(child, nextIndent);
                }
            }
        }
        return result;
    }
    /**
     * Converts tree structure to JSON string
     * @param node The tree node to convert
     * @param pretty Whether to format the JSON with indentation
     * @returns JSON string representation of the tree
     */
    static treeToJson(node, pretty = true) {
        return JSON.stringify(node, null, pretty ? 2 : 0);
    }
}
exports.TreeFormatter = TreeFormatter;
//# sourceMappingURL=tree-formatter.js.map