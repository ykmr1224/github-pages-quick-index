const { FileCrawler } = require('./dist/file-crawler')
const { HtmlGenerator } = require('./dist/html-generator')

async function testRegexFiltering() {
  console.log('🧪 GitHub Pages Quick Index - Regex Filter Demo\n')

  const testDir = './test-html-files'
  
  // Test 1: No filter (show all files)
  console.log('📋 Test 1: No filter (all HTML files)')
  const crawlerAll = new FileCrawler()
  const allFiles = await crawlerAll.crawlDirectory(testDir)
  console.log(`✅ Found ${allFiles.length} files:`)
  allFiles.forEach(file => console.log(`  📄 ${file}`))
  console.log()

  // Test 2: Filter for files containing "test"
  console.log('📋 Test 2: Filter for files containing "test"')
  const crawlerTest = new FileCrawler('test')
  const testFiles = await crawlerTest.crawlDirectory(testDir)
  console.log(`✅ Found ${testFiles.length} files matching "test":`)
  testFiles.forEach(file => console.log(`  📄 ${file}`))
  console.log()

  // Test 3: Filter for files starting with "index" or "about"
  console.log('📋 Test 3: Filter for files starting with "index" or "about"')
  const crawlerMain = new FileCrawler('^(index|about)')
  const mainFiles = await crawlerMain.crawlDirectory(testDir)
  console.log(`✅ Found ${mainFiles.length} files matching "^(index|about)":`)
  mainFiles.forEach(file => console.log(`  📄 ${file}`))
  console.log()

  // Test 4: Filter for files ending with "-report.html"
  console.log('📋 Test 4: Filter for files ending with "-report.html"')
  const crawlerReports = new FileCrawler('-report\\.html$')
  const reportFiles = await crawlerReports.crawlDirectory(testDir)
  console.log(`✅ Found ${reportFiles.length} files matching "-report\\.html$":`)
  reportFiles.forEach(file => console.log(`  📄 ${file}`))
  console.log()

  // Test 5: Generate HTML with filtered results
  console.log('📋 Test 5: Generate HTML index with test files only')
  if (testFiles.length > 0) {
    const tree = crawlerTest.buildTreeStructure(testFiles, testDir)
    const html = HtmlGenerator.generateIndex(tree, {
      title: 'Test Files Only - Filtered Index',
      repositoryName: 'demo/regex-filtering',
      commitSha: 'abc123',
      timestamp: new Date().toISOString()
    })
    
    const fs = require('fs')
    await fs.promises.writeFile('./filtered-index.html', html)
    console.log('✅ Generated filtered HTML index: ./filtered-index.html')
    console.log(`📏 HTML file size: ${(html.length / 1024).toFixed(1)} KB`)
  }

  console.log('\n🎉 Regex filtering demo completed!')
  console.log('💡 Try different regex patterns to filter your HTML files')
}

testRegexFiltering().catch(console.error)
