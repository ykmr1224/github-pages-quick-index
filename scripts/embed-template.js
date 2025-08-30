const fs = require('fs')
const path = require('path')

// Read the template file
const templatePath = path.join(__dirname, '..', 'src', 'templates', 'index.html')
const htmlGeneratorPath = path.join(__dirname, '..', 'src', 'html-generator.ts')

if (!fs.existsSync(templatePath)) {
  console.error('❌ Template file not found at src/templates/index.html')
  process.exit(1)
}

if (!fs.existsSync(htmlGeneratorPath)) {
  console.error('❌ HTML generator file not found at src/html-generator.ts')
  process.exit(1)
}

// Read template content and escape it for TypeScript
const templateContent = fs.readFileSync(templatePath, 'utf8')
const escapedTemplate = templateContent
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\${/g, '\\${')

// Read the HTML generator file
let htmlGeneratorContent = fs.readFileSync(htmlGeneratorPath, 'utf8')

// Replace the file reading with embedded template
const oldCode = `    // Load HTML template
    const templatePath = path.join(__dirname, 'templates', 'index.html')
    let template = fs.readFileSync(templatePath, 'utf8')`

const newCode = `    // Embedded HTML template (generated during build)
    let template = \`${escapedTemplate}\``

if (htmlGeneratorContent.includes(oldCode)) {
  htmlGeneratorContent = htmlGeneratorContent.replace(oldCode, newCode)
  
  // Write the modified file
  fs.writeFileSync(htmlGeneratorPath, htmlGeneratorContent, 'utf8')
  console.log('✅ Template embedded into html-generator.ts')
} else {
  console.log('ℹ️  Template already embedded or pattern not found')
}
