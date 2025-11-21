# SonarCloud Quality Analysis

## Overview

This project uses [SonarCloud](https://sonarcloud.io/) for continuous code quality and security analysis. SonarCloud automatically analyzes code on every push and pull request.

## Current Status

View the latest analysis: https://sonarcloud.io/project/overview?id=EIP-DeckedOut-Orga_eip-visual-editor-package

## Quality Metrics

SonarCloud tracks:
- **Bugs**: Potential runtime errors
- **Vulnerabilities**: Security issues
- **Code Smells**: Maintainability issues
- **Coverage**: Test coverage percentage
- **Duplications**: Duplicate code blocks
- **Security Hotspots**: Security-sensitive code

## Quality Gate

Our quality gate requires:
- ✅ **Coverage**: ≥ 80% on new code
- ✅ **Duplications**: ≤ 3% on new code
- ✅ **Maintainability Rating**: A
- ✅ **Reliability Rating**: A
- ✅ **Security Rating**: A

## How It Works

1. **Automatic Analysis**: Runs on every push and PR via GitHub Actions
2. **Coverage Integration**: Uses Jest coverage reports (lcov.info)
3. **Quality Feedback**: Results appear in PR checks
4. **Trend Tracking**: Monitors quality over time

## Local Analysis (Optional)

To run SonarCloud analysis locally:

```bash
# Install SonarScanner (one-time setup)
npm install -g sonarqube-scanner

# Run tests with coverage
npm run test:coverage

# Run SonarCloud analysis
sonar-scanner \
  -Dsonar.projectKey=EIP-DeckedOut-Orga_eip-visual-editor-package \
  -Dsonar.organization=eip-deckedout-orga \
  -Dsonar.sources=src \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_SONAR_TOKEN
```

## Configuration

### sonar-project.properties

Key configurations:
- **Sources**: `src` directory
- **Test Inclusions**: All `*.test.ts` and `*.test.tsx` files
- **Exclusions**: node_modules, dist, coverage, UI components
- **Coverage Reports**: `coverage/lcov.info`

### GitHub Actions

SonarCloud analysis runs after tests in `.github/workflows/ci.yml`:
- Requires `SONAR_TOKEN` secret in GitHub
- Runs only on `main` branch and PRs
- Uses official SonarSource GitHub Action

## Addressing Issues

### View Issues

1. Go to project dashboard
2. Click "Issues" tab
3. Filter by type (Bug, Vulnerability, Code Smell)
4. Sort by severity

### Fix Priority

1. **Blocker/Critical**: Fix immediately
2. **Major**: Fix before next release
3. **Minor**: Fix when convenient
4. **Info**: Optional improvements

### Common Fixes

**Unused variables**:
```typescript
// Bad
const unusedVar = 'value';

// Good - prefix with underscore if intentionally unused
const _unusedVar = 'value';
```

**Cognitive complexity**:
- Break down large functions
- Extract helper functions
- Simplify nested conditionals

**Duplicated code**:
- Extract common logic to utilities
- Create reusable components
- Use composition over duplication

## Excluded from Analysis

The following are excluded for valid reasons:

### UI Components (`src/ui/**`)
- Third-party shadcn/ui components
- Not part of core package logic
- Tested via integration tests

### Test Files
- Test files themselves don't need analysis
- Coverage is more important than test quality metrics

### Generated Files
- `dist/` - Build output
- `coverage/` - Test coverage reports
- `node_modules/` - Dependencies

## Integration with CI/CD

SonarCloud integrates seamlessly:

1. **PR Checks**: Quality gate status shows in PR
2. **Failed Quality Gate**: Prevents merge (if configured)
3. **Coverage Trends**: Track coverage over time
4. **Security Alerts**: Get notified of vulnerabilities

## Badges

Add these badges to README.md:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=coverage)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=bugs)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
```

## Resources

- [SonarCloud Dashboard](https://sonarcloud.io/project/overview?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Quality Gate Docs](https://docs.sonarcloud.io/improving/quality-gates/)
- [GitHub Action](https://github.com/SonarSource/sonarcloud-github-action)

## Troubleshooting

### Analysis Failed

1. Check GitHub Actions logs
2. Verify `SONAR_TOKEN` secret exists
3. Ensure coverage report is generated
4. Check sonar-project.properties syntax

### Coverage Not Showing

1. Verify `npm run test:coverage` works
2. Check `coverage/lcov.info` exists
3. Verify path in sonar-project.properties
4. Ensure lcov format (not clover/cobertura)

### Quality Gate Failed

1. View specific failing metrics
2. Fix blocker/critical issues first
3. Review new code coverage
4. Check for security vulnerabilities
