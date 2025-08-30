const { FileCrawler } = require('./dist/file-crawler');
const { TreeFormatter } = require('./dist/tree-formatter');

async function demo() {
  console.log('🔍 HTML File Crawler Demo\n');
  
  const crawler = new FileCrawler();
  
  try {
    // Crawl the test directory
    const htmlFiles = await crawler.crawlDirectory('./test-html-files');
    
    console.log(`Found ${htmlFiles.length} HTML files:`);
    htmlFiles.forEach(file => console.log(`  - ${file}`));
    
    console.log('\n📁 Tree Structure:');
    const tree = crawler.buildTreeStructure(htmlFiles, './test-html-files');
    const treeString = TreeFormatter.treeToString(tree);
    console.log(treeString);
    
    console.log('📄 JSON Structure:');
    const jsonString = TreeFormatter.treeToJson(tree);
    console.log(jsonString);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

demo();
