const { FileCrawler } = require('./dist/file-crawler');
const { TreeFormatter } = require('./dist/tree-formatter');

async function demoReportsCrawler() {
  console.log('📊 GitHub Pages Quick Index - Report Crawler Demo\n');
  
  const crawler = new FileCrawler();
  
  try {
    // Simulate scanning a reports directory (using our test-html-files as example reports)
    const reportsPath = './test-html-files';
    console.log(`🔍 Scanning reports directory: ${reportsPath}`);
    
    const htmlFiles = await crawler.crawlDirectory(reportsPath);
    
    console.log(`\n✅ Found ${htmlFiles.length} HTML report files:`);
    htmlFiles.forEach(file => console.log(`  📄 ${file}`));
    
    console.log('\n🌳 Report structure discovered:');
    const tree = crawler.buildTreeStructure(htmlFiles, reportsPath);
    const treeString = TreeFormatter.treeToString(tree);
    console.log(treeString);
    
    console.log('📝 Next step: Generate index.html with links to these reports');
    console.log('   This will create a simple navigation page for GitHub Pages');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

demoReportsCrawler();
