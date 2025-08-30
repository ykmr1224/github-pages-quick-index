# GitHub Pages Quick Index

A minimal GitHub Action that generates a simple index.html to quickly access test reports generated in workflows.

## Overview

This action scans for test reports and artifacts in your repository and creates a clean, minimal HTML index page for easy access via GitHub Pages.

## Core Features

- **Auto-discovery**: Finds HTML reports in specified directories
- **Minimal HTML generation**: Creates a simple, responsive index page
- **Zero-config**: Works out of the box with sensible defaults
- **GitHub Pages ready**: Outputs static files ready for deployment

## Requirements

### Inputs

- `reports-path`: (optional) Directory to scan for reports (default: `./reports`)
- `output-file`: (optional) Output HTML file path (default: `./index.html`)

### Outputs

- `index-path`: Path to the generated index.html file

## Usage

```yaml
name: Generate Report Index
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Your test steps that generate reports
      - name: Run Tests
        run: npm test
        
      # Generate index
      - uses: ykmr1224/github-pages-quick-index@v1
        with:
          reports-path: './reports'
          
      # Deploy to GitHub Pages
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Technical Scope

### Core Functionality
1. Scan directory for `.html` files
2. Generate minimal HTML index with links
3. Include basic metadata (timestamp, commit)
4. Output single static HTML file

### Implementation Requirements
- Node.js 20+ runtime
- Minimal dependencies
- Fast execution (< 30 seconds)
- Handle report files efficiently

## Development

### Setup
```bash
npm install
npm run build
npm test
```

### Project Structure
```
src/index.ts          # Main logic
action.yml            # Action definition
package.json          # Dependencies
```

## License

Apache License 2.0
