<div align="center">

# 📊 GitHub Pages Quick Index

**Automatically generate neat HTML index page for your test reports**

[![CI](https://github.com/ykmr1224/github-pages-quick-index/actions/workflows/test.yml/badge.svg)](https://github.com/ykmr1224/github-pages-quick-index/actions/workflows/test.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub release](https://img.shields.io/github/release/ykmr1224/github-pages-quick-index.svg)](https://github.com/ykmr1224/github-pages-quick-index/releases)
[![GitHub stars](https://img.shields.io/github/stars/ykmr1224/github-pages-quick-index.svg?style=social&label=Star)](https://github.com/ykmr1224/github-pages-quick-index)

[🚀 Live Demo](https://ykmr1224.github.io/github-pages-quick-index/) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing) • [💬 Discussions](https://github.com/ykmr1224/github-pages-quick-index/discussions)

</div>

---

## ✨ Features

- 🔍 **Smart Discovery** - Automatically finds HTML files in your project directories
- 🔧 **Zero Configuration** - Works out of the box with sensible defaults
- 🎯 **Regex Filtering** - Advanced pattern matching to include only the files you need
- 🌐 **GitHub Pages Ready** - Perfect integration with GitHub Pages deployment

## 🚀 Quick Start

Add this action to your workflow to automatically generate an index page for your test reports:

```yaml
name: Generate Test Reports Index

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
      pages: write
      id-token: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm test -- --coverage
      
      - name: Generate Reports Index
        uses: ykmr1224/github-pages-quick-index@v1
        with:
          reports-path: './reports'
          output-file: './index.html'
          file-filter: '.*\.(html|htm)$'
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./gh-pages-content
```

## 📋 Inputs & Outputs

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `reports-path` | Directory to scan for HTML files | No | `./reports` |
| `output-file` | Path for the generated index.html | No | `./index.html` |
| `file-filter` | Regex pattern to filter files | No | `''` (matches all) |

### Outputs

| Output | Description |
|--------|-------------|
| `html-files` | JSON array of discovered HTML files |
| `file-count` | Number of HTML files found |
| `index-path` | Path to the generated index file |

## 🎯 Use Cases

### Test Report Aggregation
Perfect for collecting Jest, Mocha, or any HTML test reports:

```yaml
- name: Generate Test Index
  uses: ykmr1224/github-pages-quick-index@v1
  with:
    reports-path: './test-results'
    file-filter: 'test.*\.html$'
```

### Documentation Sites
Organize your documentation files:

```yaml
- name: Generate Docs Index
  uses: ykmr1224/github-pages-quick-index@v1
  with:
    reports-path: './docs'
    file-filter: '.*\.(html|htm)$'
```

### Coverage Reports
Create an index for code coverage reports:

```yaml
- name: Generate Coverage Index
  uses: ykmr1224/github-pages-quick-index@v1
  with:
    reports-path: './coverage'
    file-filter: 'coverage.*\.html$'
```

## 🔧 Advanced Configuration

### Regex Filtering Examples

```yaml
# Only test reports
file-filter: 'test.*\.html$'

# Coverage and test reports
file-filter: '(test|coverage).*\.html$'

# Exclude temporary files
file-filter: '^(?!.*\.tmp).*\.html$'

# Only files starting with "report"
file-filter: '^report.*\.html$'
```

### Multiple Report Types

```yaml
jobs:
  generate-indexes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Generate separate indexes for different report types
      - name: Test Reports Index
        uses: ykmr1224/github-pages-quick-index@v1
        with:
          reports-path: './reports'
          output-file: './test-index.html'
          file-filter: 'test.*\.html$'
      
      - name: Coverage Reports Index
        uses: ykmr1224/github-pages-quick-index@v1
        with:
          reports-path: './reports'
          output-file: './coverage-index.html'
          file-filter: 'coverage.*\.html$'
```

## 🏗️ Architecture

### Core Components

- **FileCrawler** - Recursively discovers HTML files with regex filtering
- **TreeFormatter** - Organizes files into hierarchical structures
- **HtmlGenerator** - Creates beautiful, responsive HTML pages
- **Template System** - Customizable HTML templates with variable substitution

### Project Structure

```
src/
├── index.ts              # Main GitHub Action entry point
├── file-crawler.ts       # File discovery and filtering logic
├── tree-formatter.ts     # Tree structure organization
├── html-generator.ts     # HTML page generation
├── types.ts             # TypeScript type definitions
└── templates/
    └── index.html       # HTML template with placeholders

__tests__/               # Comprehensive test suite
├── index.test.ts        # Integration tests
├── file-crawler.test.ts # File discovery tests
├── tree-formatter.test.ts # Tree formatting tests
└── html-generator.test.ts # HTML generation tests

scripts/                 # Build and deployment scripts
├── embed-template.js    # Template embedding for ncc
├── restore-template.js  # Development template restoration
└── build-with-templates.js # Template build utilities
```

## 🧪 Development

### Prerequisites

- Node.js 20+ 
- npm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/ykmr1224/github-pages-quick-index.git
cd github-pages-quick-index

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build the action
npm run build

# Package for distribution
npm run package

# Run all checks
npm run all
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- __tests__/file-crawler.test.ts
```

### Local Development

```bash
# Test with sample files
node demo.js

# Test regex filtering
node regex-filter-demo.js

# Test HTML generation
node html-generation-demo.js

# Test with real reports
npm test -- --coverage
node -e "
const { run } = require('./dist/index.js');
process.env['INPUT_REPORTS-PATH'] = './reports';
process.env['INPUT_OUTPUT-FILE'] = './test-index.html';
run().catch(console.error);
"
```

## 📊 Examples

### Real-World Usage

This action is used in production by several projects:

- **Test Report Aggregation** - Collecting Jest, Mocha, and Playwright reports
- **Documentation Sites** - Organizing API docs, guides, and tutorials  
- **Coverage Dashboards** - Creating navigable coverage report indexes
- **CI/CD Artifacts** - Organizing build artifacts and deployment reports

### Sample Output

The generated index pages feature:

- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Clean, professional appearance with hover effects
- 📊 **Smart Organization** - Files grouped by directory with depth-based sorting
- 🔍 **Quick Navigation** - Easy-to-scan file listings with icons
- ⚡ **Fast Loading** - Optimized HTML with minimal overhead
- 🌙 **Accessibility** - Proper semantic HTML and ARIA labels

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
