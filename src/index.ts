import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs from action.yml
    const exampleInput = core.getInput('example-input')
    core.info(`Hello ${exampleInput}!`)

    // Get the GitHub context
    const context = github.context
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`)
    core.info(`Event: ${context.eventName}`)

    // Do some work here...
    const result = await doWork(exampleInput)

    // Set outputs for other workflow steps to use
    core.setOutput('example-output', result)
    
    core.info('Action completed successfully!')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Example function that does some work
 * @param input The input string
 * @returns A processed result
 */
async function doWork(input: string): Promise<string> {
  // Simulate some async work
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return `Processed: ${input}`
}

// Don't auto-execute in the test environment
if (require.main === module) {
  run()
}
