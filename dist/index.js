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
exports.run = run;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const file_crawler_1 = require("./file-crawler");
const tree_formatter_1 = require("./tree-formatter");
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        // Get inputs from action.yml
        const reportsPath = core.getInput('reports-path') || './reports';
        const outputFile = core.getInput('output-file') || './index.html';
        core.info(`Scanning reports directory: ${reportsPath}`);
        core.info(`Output file: ${outputFile}`);
        // Get the GitHub context
        const context = github.context;
        core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
        // Create file crawler and find HTML files (reports)
        const crawler = new file_crawler_1.FileCrawler();
        const htmlFiles = await crawler.crawlDirectory(reportsPath);
        core.info(`Found ${htmlFiles.length} HTML report files`);
        if (htmlFiles.length === 0) {
            core.warning('No HTML report files found in the specified directory');
            core.setOutput('html-files', JSON.stringify([]));
            core.setOutput('file-count', '0');
            core.setOutput('index-path', '');
            return;
        }
        // Build tree structure for organizing reports
        const treeStructure = crawler.buildTreeStructure(htmlFiles, reportsPath);
        // TODO: Next step will be to generate the actual index.html file
        // For now, we're just providing the discovered structure
        // Set outputs for other workflow steps to use
        core.setOutput('html-files', JSON.stringify(htmlFiles));
        core.setOutput('file-count', htmlFiles.length.toString());
        core.setOutput('index-path', outputFile);
        // Log the results
        core.info('HTML report files found:');
        htmlFiles.forEach(file => core.info(`  - ${file}`));
        core.info('\nReport structure discovered:');
        const treeString = tree_formatter_1.TreeFormatter.treeToString(treeStructure);
        core.info(treeString);
        core.info('File crawler completed successfully!');
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        core.setFailed(error instanceof Error ? error.message : String(error));
    }
}
// Don't auto-execute in the test environment
if (require.main === module) {
    run();
}
//# sourceMappingURL=index.js.map