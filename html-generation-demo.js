const { FileCrawler } = require('./dist/file-crawler');
const { HtmlGenerator } = require('./dist/html-generator');
const fs = require('fs');

async function demoHtmlGeneration() {
  console.log('🚀 GitHub Pages Quick Index - Complete Demo\n');
  
  const crawler = new FileCrawler();
  
  try {
    // Step 1: Crawl for HTML files
    const reportsPath = './test-html-files';
    console.log(`🔍 Step 1: Scanning reports directory: ${reportsPath}`);
    
    const htmlFiles = await crawler.crawlDirectory(reportsPath);
    console.log(`✅ Found ${htmlFiles.length} HTML report files:`);
    htmlFiles.forEach(file => console.log(`  📄 ${file}`));
    
    // Step 2: Build tree structure
    console.log('\n🌳 Step 2: Building tree structure...');
    const tree = crawler.buildTreeStructure(htmlFiles, reportsPath);
    console.log('✅ Tree structure created');
    
    // Step 3: Generate HTML index
    console.log('\n📝 Step 3: Generating HTML index...');
    const htmlContent = HtmlGenerator.generateIndex(tree, {
      title: 'Demo Test Reports',
      repositoryName: 'ykmr1224/github-pages-quick-index',
      commitSha: 'abc123def456789',
      timestamp: new Date().toISOString()
    });
    
    // Step 4: Write HTML file
    const outputFile = './generated-index.html';
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log(`✅ Generated HTML index: ${outputFile}`);
    
    // Step 5: Show summary
    console.log('\n📊 Summary:');
    console.log(`  📁 Reports directory: ${reportsPath}`);
    console.log(`  📄 HTML files found: ${htmlFiles.length}`);
    console.log(`  🎯 Generated index: ${outputFile}`);
    console.log(`  📏 HTML file size: ${(htmlContent.length / 1024).toFixed(1)} KB`);
    
    console.log('\n🎉 Demo completed successfully!');
    console.log(`💡 Open ${outputFile} in your browser to see the result`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

demoHtmlGeneration();
