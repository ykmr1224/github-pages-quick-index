import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'
import { FileCrawler } from './file-crawler'
import { TreeFormatter } from './tree-formatter'
import { HtmlGenerator } from './html-generator'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs from action.yml
    const reportsPath = core.getInput('reports-path') || './reports'
    const outputFile = core.getInput('output-file') || './index.html'
    const fileFilter = core.getInput('file-filter') || ''
    
    core.info(`Scanning reports directory: ${reportsPath}`)
    core.info(`Output file: ${outputFile}`)
    if (fileFilter) {
      core.info(`File filter: ${fileFilter}`)
    }

    // Get the GitHub context
    const context = github.context
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`)

    // Create file crawler and find HTML files (reports)
    const crawler = new FileCrawler(fileFilter)
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
    
    // Generate HTML index file
    core.info('Generating HTML index file...')
    
    const htmlContent = HtmlGenerator.generateIndex(treeStructure, {
      title: 'Test Reports Index',
      repositoryName: `${context.repo.owner}/${context.repo.repo}`,
      commitSha: context.sha,
      timestamp: new Date().toISOString()
    })
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFile)
    if (outputDir !== '.' && !fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true })
      core.info(`Created output directory: ${outputDir}`)
    }
    
    // Write the HTML file
    await fs.promises.writeFile(outputFile, htmlContent, 'utf8')
    core.info(`✅ Generated index file: ${outputFile}`)
    
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
    
    core.info(`\n🎉 GitHub Pages Quick Index generated successfully!`)
    core.info(`📄 Index file: ${outputFile}`)
    core.info(`📊 Total reports: ${htmlFiles.length}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

// Don't auto-execute in the test environment
if (require.main === module) {
  run()
}
