# GitHub Pages Quick Index - Development Process

## Pre-Commit Workflow (MANDATORY)

### 1. Always Run Tests Before Committing
```bash
npm test
```
- **All tests must pass** before any commit
- If tests fail, fix issues before proceeding
- Test output should show: "Test Suites: 4 passed, 4 total"

### 2. Build Process for Template Changes
```bash
# For template development
node scripts/restore-template.js && npm run build

# For production build
npm run build
```
- Template changes require embedding for production
- Always test after template modifications

### 3. Complete Build and Package
```bash
npm run all
```
- Runs full build and package process
- Required before major commits
- Ensures distribution files are up to date

## Development Standards

### Code Quality Checklist
- [ ] All tests passing (`npm test`)
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] ESLint and Prettier formatting applied
- [ ] Template embedded for production (`npm run build`)
- [ ] Manual testing of new features completed
- [ ] Documentation updated if needed

### Commit Message Format
```
<type>: <description>

✨ <feature details>
🎨 <UI improvements>
🔧 <technical changes>
```

**Types:**
- `✨` New features
- `🎨` UI improvements  
- `🔧` Technical optimizations
- `🐛` Bug fixes
- `📝` Documentation
- `🧪` Tests

### File Organization Rules
- Source code: `src/`
- Tests: `__tests__/`
- Build artifacts: `dist/` (committed)
- Test reports: `build/` (ignored)
- Templates: `src/templates/`
- Scripts: `scripts/`

## Template Development Workflow

### Development Mode
```bash
# Restore file-based template loading
node scripts/restore-template.js

# Make changes to src/templates/index.html
# Test changes...

# Build with template embedding
npm run build
```

### Template Architecture
- **Development**: Templates loaded from `src/templates/index.html`
- **Production**: Templates embedded as strings in compiled code
- **Variables**: Use `{{variable}}` placeholders
- **Search**: JavaScript embedded directly in template

## Testing Requirements

### Test Structure
- `__tests__/index.test.ts` - GitHub Action integration
- `__tests__/file-crawler.test.ts` - File discovery logic
- `__tests__/tree-formatter.test.ts` - Tree structure formatting
- `__tests__/html-generator.test.ts` - HTML generation and templates

### Coverage Requirements
```bash
npm test -- --coverage
```
- Maintain high test coverage
- All core functionality must be tested
- New features require corresponding tests

### Manual Testing Checklist
- [ ] Search functionality works (typing, filtering)
- [ ] Clear button appears and functions
- [ ] ESC key clears search
- [ ] Keyboard shortcuts work (Ctrl/Cmd + K)
- [ ] Responsive design on mobile
- [ ] Directory sections hide/show correctly

## GitHub Actions Integration

### Local Testing
```bash
# Test the action locally
node -e "
const { run } = require('./dist/index.js');
process.env['INPUT_REPORTS-PATH'] = './build';
process.env['INPUT_OUTPUT-FILE'] = './test-index.html';
process.env['INPUT_FILE-FILTER'] = '';
process.env['GITHUB_REPOSITORY'] = 'test/repo';
process.env['GITHUB_SHA'] = 'abc123';
run().catch(console.error);
"
```

### Action Parameters
- `reports-path`: Directory to scan for HTML files
- `output-file`: Generated index file path
- `file-filter`: Optional regex pattern for filtering

## Common Commands Reference

```bash
# Development
npm test                              # Run test suite
npm run build                         # Build TypeScript + embed templates
npm run all                          # Complete build and package
node scripts/restore-template.js     # Restore template for development

# Testing
npm test -- --coverage              # Run tests with coverage
npm test -- --watch                 # Run tests in watch mode

# Template Development
node scripts/embed-template.js      # Embed template for production
node scripts/restore-template.js    # Restore file-based loading

# Build Tools
./build.sh                          # Complete build with dependency checks
npm run package                     # Package with ncc for distribution
```

## Architecture Overview

### Core Components
1. **FileCrawler**: Recursive HTML file discovery with regex filtering
2. **TreeFormatter**: Tree structure visualization and formatting
3. **HtmlGenerator**: Beautiful HTML index generation with templates
4. **Search System**: Client-side JavaScript with real-time filtering

### Template System
- **Development**: File-based loading from `src/templates/`
- **Production**: String embedding via `scripts/embed-template.js`
- **Variables**: `{{title}}`, `{{metadata}}`, `{{fileList}}`, etc.
- **Search**: Embedded JavaScript with CSS classes for show/hide

### Search Features
- Real-time filtering by file path
- Clear button with smart visibility
- ESC key support for clearing
- Keyboard shortcuts (Ctrl/Cmd + K)
- Directory section management
- Mobile responsive design

## Error Prevention

### Common Issues
1. **Template not embedded**: Run `npm run build` after template changes
2. **Tests failing**: Check for template syntax errors or missing functionality
3. **Build errors**: Ensure TypeScript compilation succeeds
4. **Search not working**: Verify JavaScript is properly embedded in template

### Debugging Steps
1. Check test output for specific failures
2. Verify template embedding with `npm run build`
3. Test search functionality manually in browser
4. Check console for JavaScript errors
5. Validate responsive design on mobile

## Release Process

### Before Release
1. All tests passing
2. Manual testing completed
3. Documentation updated
4. Template embedded for production
5. Distribution files updated in `dist/`

### Release Checklist
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG updated
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] GitHub Actions workflow tested
- [ ] Distribution files committed

This process ensures consistent, high-quality development and prevents common issues that can break the build or functionality.
