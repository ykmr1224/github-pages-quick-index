import * as core from '@actions/core'
import * as github from '@actions/github'
import { FileCrawler } from './file-crawler'
import { TreeFormatter } from './tree-formatter'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs from action.yml
    const reportsPath = core.getInput('reports-path') || './reports'
    const outputFile = core.getInput('output-file') || './index.html'
    
    core.info(`Scanning reports directory: ${reportsPath}`)
    core.info(`Output file: ${outputFile}`)

    // Get the GitHub context
    const context = github.context
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`)

    // Create file crawler and find HTML files (reports)
    const crawler = new FileCrawler()
    const htmlFiles = await crawler.crawlDirectory(reportsPath)
    
    core.info(`Found ${htmlFiles.length} HTML report files`)

    if (htmlFiles.length === 0) {
      core.warning('No HTML report files found in the specified directory')
      core.setOutput('html-files', JSON.stringify([]))
      core.setOutput('file-count', '0')
      core.setOutput('index-path', '')
      return
    }

    // Build tree structure for organizing reports
    const treeStructure = crawler.buildTreeStructure(htmlFiles, reportsPath)
    
    // TODO: Next step will be to generate the actual index.html file
    // For now, we're just providing the discovered structure
    
    // Set outputs for other workflow steps to use
    core.setOutput('html-files', JSON.stringify(htmlFiles))
    core.setOutput('file-count', htmlFiles.length.toString())
    core.setOutput('index-path', outputFile)
    
    // Log the results
    core.info('HTML report files found:')
    htmlFiles.forEach(file => core.info(`  - ${file}`))
    
    core.info('\nReport structure discovered:')
    const treeString = TreeFormatter.treeToString(treeStructure)
    core.info(treeString)
    
    core.info('File crawler completed successfully!')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

// Don't auto-execute in the test environment
if (require.main === module) {
  run()
}
