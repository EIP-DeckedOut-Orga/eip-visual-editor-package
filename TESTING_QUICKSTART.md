# Quick Testing Reference

## Run Tests

```bash
# Run all tests
npm test

# Run in watch mode (auto-rerun on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run in CI mode (for GitHub Actions)
npm run test:ci
```

## View Coverage

After running `npm run test:coverage`, open:
```bash
open coverage/lcov-report/index.html
```

## Test a Specific File

```bash
npm test -- useEditorState.test.ts
```

## Test with Specific Pattern

```bash
npm test -- --testNamePattern="should add element"
```

## Quick Status Check

```bash
# Run all quality checks (like CI does)
npm run lint && npm run type-check && npm test
```

## Coverage Summary

- **✅ 112 tests passing**
- **✅ 95.26% statement coverage**
- **✅ 94.20% branch coverage**
- **✅ 95.77% line coverage**

## Files Tested

- ✅ `src/core/useEditorState.ts` - State management (71 tests)
- ✅ `src/utils/editorUtils.ts` - Utilities (54 tests)
- ✅ `src/utils/snapping.ts` - Snapping logic (31 tests)

For detailed documentation, see [TESTING.md](./TESTING.md)
