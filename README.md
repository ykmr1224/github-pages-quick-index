# TypeScript GitHub Action

A template for creating GitHub Actions using TypeScript and Node.js.

## Features

- Written in TypeScript for type safety
- Uses GitHub Actions toolkit (@actions/core, @actions/github)
- Includes Jest testing framework
- ESLint and Prettier for code quality
- Automated build and packaging with @vercel/ncc

## Getting Started

### Prerequisites

- Node.js 22 or later (LTS recommended)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

### Development

1. Make changes to the TypeScript source files in the `src/` directory
2. Build the action:

```bash
npm run build
```

3. Package the action for distribution:

```bash
npm run package
```

4. Run tests:

```bash
npm test
```

### Project Structure

```
├── src/
│   └── index.ts          # Main action logic
├── __tests__/
│   └── index.test.ts     # Unit tests
├── dist/                 # Compiled JavaScript (auto-generated)
├── action.yml            # Action metadata
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest testing configuration
└── README.md            # This file
```

### Action Inputs and Outputs

#### Inputs

- `example-input`: (required) An example input parameter (default: "Hello World")

#### Outputs

- `example-output`: An example output parameter

### Usage in Workflows

```yaml
name: Test Action
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        id: my-action
        with:
          example-input: 'Custom input value'
      - name: Use output
        run: echo "Output was ${{ steps.my-action.outputs.example-output }}"
```

### Building and Packaging

This action uses [@vercel/ncc](https://github.com/vercel/ncc) to compile the TypeScript code and package it into a single JavaScript file. This eliminates the need to check in `node_modules` to your repository.

**Important**: Always run `npm run package` before committing changes to ensure the `dist/` directory is up to date.

### Testing

The project includes comprehensive unit tests using Jest. Tests are located in the `__tests__/` directory.

Run tests with:

```bash
npm test
```

### Code Quality

- **ESLint**: Linting for TypeScript code
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run all` to build, test, and package
6. Commit your changes
7. Create a pull request

### License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
