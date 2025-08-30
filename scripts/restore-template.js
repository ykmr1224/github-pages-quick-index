const fs = require('fs')
const path = require('path')

// Read the HTML generator file
const htmlGeneratorPath = path.join(__dirname, '..', 'src', 'html-generator.ts')

if (!fs.existsSync(htmlGeneratorPath)) {
  console.error('❌ HTML generator file not found at src/html-generator.ts')
  process.exit(1)
}

let htmlGeneratorContent = fs.readFileSync(htmlGeneratorPath, 'utf8')

// Find the embedded template and replace it back to file reading
const embeddedTemplateRegex = /    \/\/ Embedded HTML template \(generated during build\)\s*\n    let template = `[\s\S]*?`/

if (embeddedTemplateRegex.test(htmlGeneratorContent)) {
  const restoredCode = `    // Load HTML template
    const templatePath = path.join(__dirname, 'templates', 'index.html')
    let template = fs.readFileSync(templatePath, 'utf8')`
  
  htmlGeneratorContent = htmlGeneratorContent.replace(embeddedTemplateRegex, restoredCode)
  
  // Write the restored file
  fs.writeFileSync(htmlGeneratorPath, htmlGeneratorContent, 'utf8')
  console.log('✅ Template reading restored in html-generator.ts')
} else {
  console.log('ℹ️  No embedded template found to restore')
}
