import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.mjs',
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                // '**/*.test.{ts,tsx,js,jsx}', // Exclude test files
                // '**/*.spec.{ts,tsx,js,jsx}', // Exclude spec files
                'layout/*.{ts,tsx,js,jsx}', // Exclude primereact files
              ],
        },
    },
    plugins: [react()],
});
