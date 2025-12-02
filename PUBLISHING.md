# Publishing Guide for @wyxos/listing

This document outlines the steps to publish the package to npm.

## Prerequisites

1. **npm Account**: Ensure you have an npm account and are logged in
2. **Git Repository**: Set up a git repository (see Git Setup section below)
3. **Access**: You need publish access to the `@wyxos` scope on npm

## Git Repository Setup

If you haven't already set up a git repository:

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   ```

2. **Create the remote repository** on GitHub (or your preferred git host):
   - Go to https://github.com/organizations/wyxos/repositories/new
   - Repository name: `listing`
   - Set as public or private as needed
   - Do NOT initialize with README, .gitignore, or license (we already have these)

3. **Update the repository URL in package.json** if different from the default:
   ```json
   "repository": {
       "type": "git",
       "url": "https://github.com/wyxos/listing.git"
   }
   ```

4. **Add remote and push**:
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git branch -M main
   git remote add origin https://github.com/wyxos/listing.git
   git push -u origin main
   ```

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Version number in `package.json` is correct
- [ ] `README.md` is up to date
- [ ] All necessary files are included in the `files` field in `package.json`
- [ ] Git repository is set up and pushed
- [ ] Repository URL in `package.json` is correct

## Publishing Steps

1. **Verify npm login**:
   ```bash
   npm whoami
   ```
   If not logged in, run:
   ```bash
   npm login
   ```

2. **Run pre-publish checks** (these run automatically via `prepublishOnly` script, but you can run manually):
   ```bash
   npm run type-check
   npm run test:run
   ```

3. **Publish to npm**:
   ```bash
   npm publish --access public
   ```
   
   **Note**: The `--access public` flag is required for scoped packages (`@wyxos/...`) when publishing to the public npm registry.

4. **Verify publication**:
   ```bash
   npm view @wyxos/listing
   ```

## Version Management

When publishing updates:

1. **Update version** in `package.json` following [semantic versioning](https://semver.org/):
   - Patch: `1.0.0` → `1.0.1` (bug fixes)
   - Minor: `1.0.0` → `1.1.0` (new features, backward compatible)
   - Major: `1.0.0` → `2.0.0` (breaking changes)

2. **Or use npm version commands**:
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   ```
   This automatically updates `package.json`, creates a git tag, and commits.

3. **Publish the new version**:
   ```bash
   npm publish --access public
   ```

4. **Push git tags** (if using npm version):
   ```bash
   git push --follow-tags
   ```

## Troubleshooting

### Authentication Issues

If you get authentication errors:
- Check `.npmrc` has the correct auth token
- Verify you're logged in: `npm whoami`
- Re-login if needed: `npm login`

### Access Denied

If you get access denied errors:
- Verify you have publish access to the `@wyxos` scope
- Check that the package name matches your npm organization/username
- Ensure `publishConfig.access` is set to `"public"` in `package.json`

### Pre-publish Script Fails

If `prepublishOnly` script fails:
- Fix any TypeScript errors: `npm run type-check`
- Fix any test failures: `npm test`
- You can temporarily skip with `npm publish --access public --ignore-scripts` (not recommended)

## Package Contents

The following files/directories are included in the published package (as specified in `package.json` `files` field):

- `src/` - Source TypeScript files
- `tests/` - Test files (though individual test files are excluded via `.npmignore`)
- `README.md` - Documentation
- `styles/` - Styles directory (if exists at root)

The following are excluded (via `.npmignore`):
- `node_modules/`
- Test files (`*.test.ts`, `*.test.js`)
- Config files (`tsconfig.json`, `vitest.config.*`)
- Development files (`.git/`, `.vscode/`, etc.)

## Notes

- This package publishes TypeScript source files directly (no build step)
- Consumers need TypeScript support in their projects
- The package uses ES modules (`"type": "module"`)
- Peer dependencies must be installed by consumers



