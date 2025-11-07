# GitHub Actions Setup Guide

This repository uses GitHub Actions for automated testing and publishing to npm.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)
- **Triggers**: On every push to `main` and on all pull requests
- **What it does**:
  - Tests the build on Node.js 18 and 20
  - Installs dependencies
  - Builds the package
  - Runs tests (if available)
  - Verifies the package can be packed

### 2. Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers**: When a new release is created on GitHub
- **What it does**:
  - Builds the package
  - Publishes to npm with provenance
  - Automatically uses the version from `package.json`

## Setup Instructions

### 1. Get your npm access token

1. Go to https://www.npmjs.com
2. Click on your profile → "Access Tokens"
3. Click "Generate New Token" → "Classic Token"
4. Select "Automation" type
5. Copy the token (you won't see it again!)

### 2. Add the token to GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click "Add secret"

### 3. Create a release to trigger publishing

#### Option A: Using GitHub UI
1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Click "Choose a tag" → type a new version (e.g., `v1.0.1`)
4. Click "Create new tag on publish"
5. Fill in release title and description
6. Click "Publish release"

#### Option B: Using Git commands
```bash
# Bump version in package.json
npm version patch  # or minor, or major

# Push the tag
git push --follow-tags

# Create release on GitHub
# (Then go to GitHub UI and create release from the tag)
```

#### Option C: Using GitHub CLI
```bash
# Bump version
npm version patch

# Create and publish release
gh release create v1.0.1 --title "Release v1.0.1" --notes "Bug fixes and improvements"
```

## Manual Publishing Trigger

You can also manually trigger the publish workflow:
1. Go to "Actions" tab
2. Select "Publish to npm"
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow"

## Version Management Best Practices

### Semantic Versioning
- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, no breaking changes
  ```bash
  npm version patch
  ```

- **Minor** (`1.0.0` → `1.1.0`): New features, no breaking changes
  ```bash
  npm version minor
  ```

- **Major** (`1.0.0` → `2.0.0`): Breaking changes
  ```bash
  npm version major
  ```

### Workflow
1. Make your changes and commit them
2. Run `npm version <patch|minor|major>`
3. Push: `git push --follow-tags`
4. Create a GitHub release from the new tag
5. GitHub Actions will automatically publish to npm

## Troubleshooting

### "npm ERR! 403 Forbidden"
- Check that `NPM_TOKEN` is set correctly in GitHub Secrets
- Verify the token has "Automation" permissions
- Make sure you're logged into the correct npm account

### "npm ERR! You cannot publish over the previously published version"
- Bump the version number in `package.json`
- Make sure the version matches your git tag

### Build fails in CI
- Check that all dependencies are in `package.json`
- Ensure `npm ci` works locally
- Verify Node.js version compatibility

## Status Badges

Add these to your README.md to show build status:

```markdown
[![CI](https://github.com/EIP-DeckedOut-Orga/visual-editor-package/actions/workflows/ci.yml/badge.svg)](https://github.com/EIP-DeckedOut-Orga/visual-editor-package/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@deckedout%2Fvisual-editor.svg)](https://www.npmjs.com/package/@deckedout/visual-editor)
```
