# Testing Documentation

## Overview

This package uses **Jest** and **React Testing Library** for comprehensive automated testing. We maintain high code coverage to ensure reliability and catch regressions early.

## Test Suite Statistics

- **Total Tests**: 112
- **Test Suites**: 3
- **Coverage Metrics**:
  - Statements: 95.26%
  - Branches: 94.2%
  - Functions: 93.05%
  - Lines: 95.77%

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (during development)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Run tests in CI mode
```bash
npm run test:ci
```

## Test Structure

```
src/
├── core/
│   └── __tests__/
│       └── useEditorState.test.ts  # State management tests
└── utils/
    └── __tests__/
        ├── editorUtils.test.ts     # Utility function tests
        └── snapping.test.ts        # Snapping logic tests
```

## What's Tested

### Core State Management (`useEditorState.test.ts`)
- ✅ Element CRUD operations (Create, Read, Update, Delete)
- ✅ Selection management
- ✅ Element transformations (move, rotate, resize)
- ✅ Z-index and layer ordering
- ✅ Undo/Redo functionality
- ✅ Copy/Paste/Duplicate operations
- ✅ JSON Import/Export
- ✅ Canvas management
- ✅ History tracking
- ✅ Edge cases and error handling

**Coverage**: 96.63% statements, 90% branches

### Utility Functions (`editorUtils.test.ts`)
- ✅ Element ID generation
- ✅ Element creation with defaults
- ✅ Element cloning and duplication
- ✅ Z-index operations (bring to front, send to back)
- ✅ Geometric calculations (overlap, point-in-rect)
- ✅ Grid snapping utilities
- ✅ Canvas bounds constraints
- ✅ Rotation bounding box calculations
- ✅ JSON serialization/deserialization
- ✅ Distance and angle conversions
- ✅ Data validation

**Coverage**: 100% statements, 100% branches

### Snapping Logic (`snapping.test.ts`)
- ✅ Canvas edge snapping (left, right, top, bottom)
- ✅ Canvas center snapping (horizontal, vertical)
- ✅ Element-to-element snapping (edges, centers)
- ✅ Rotated element snapping
- ✅ Threshold-based snapping
- ✅ Hidden element exclusion
- ✅ Self-exclusion
- ✅ Custom snap configurations
- ✅ Guide generation

**Coverage**: 97.08% statements, 91.42% branches

## Coverage Exclusions

The following are excluded from coverage metrics as they are UI components tested via integration:

- `src/ui/**/*.tsx` - shadcn/ui components
- `src/components/**/*.tsx` - React UI components
- `src/elements/**/*.tsx` - Element renderers
- `src/core/ElementRegistry.ts` - Registry system
- `src/core/VisualEditor.tsx` - Main editor component

These components are tested through end-to-end tests and manual testing.

## Testing Best Practices

### Writing New Tests

1. **Organize by feature**: Group related tests in `describe` blocks
2. **Use descriptive names**: Test names should clearly state what they test
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Test edge cases**: Include boundary conditions and error states
5. **Use helpers**: Leverage `createElement` and other utilities

### Example Test Structure

```typescript
describe('Feature Name', () => {
  describe('Specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### Testing React Hooks

For hooks that use React state, wrap calls in `act()`:

```typescript
import { renderHook, act } from '@testing-library/react';

it('should update state', () => {
  const { result } = renderHook(() => useEditorState());
  
  act(() => {
    result.current.api.addElement(element);
  });
  
  expect(result.current.state.elements).toHaveLength(1);
});
```

## Continuous Integration

Tests run automatically on:
- Every push to any branch
- Every pull request
- Before publishing to npm

The CI pipeline:
1. Runs `npm test:ci` with coverage
2. Fails if coverage drops below thresholds
3. Uploads coverage reports

## Debugging Tests

### Run a specific test file
```bash
npm test -- useEditorState.test.ts
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should add element"
```

### Debug in VS Code
Add a breakpoint and use the Jest debug configuration or run:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Maintaining High Coverage

### Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Statements | 90% |
| Branches | 85% |
| Functions | 93% |
| Lines | 90% |

### When Coverage Drops

1. **Identify uncovered code**: Check the coverage report in `coverage/lcov-report/index.html`
2. **Add missing tests**: Focus on edge cases and error paths
3. **Refactor if needed**: Sometimes low coverage indicates overly complex code
4. **Update exclusions**: If code is truly untestable (e.g., pure UI), add to exclusions

## Future Testing Enhancements

- [ ] Integration tests for React components
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Accessibility tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
