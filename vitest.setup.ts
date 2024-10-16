// vitest.setup.ts
import '@testing-library/jest-dom'; // Import this to use jest-dom matchers

// Suppress jsdom CSS parsing errors
const suppressedErrors = /(Could not parse CSS stylesheet)/;

const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0] && suppressedErrors.test(args[0])) {
        // Suppress the specific jsdom CSS error
        return;
    }
    // Call the original console.error for other errors
    originalConsoleError(...args);
};