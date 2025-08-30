const fs = require('fs')
const path = require('path')

// Ensure dist/templates directory exists
const templatesDir = path.join(__dirname, '..', 'dist', 'templates')
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true })
}

// Copy template file to dist directory
const srcTemplate = path.join(__dirname, '..', 'src', 'templates', 'index.html')
const distTemplate = path.join(templatesDir, 'index.html')

if (fs.existsSync(srcTemplate)) {
  fs.copyFileSync(srcTemplate, distTemplate)
  console.log('✅ Template file copied to dist/templates/')
} else {
  console.error('❌ Template file not found at src/templates/index.html')
  process.exit(1)
}
