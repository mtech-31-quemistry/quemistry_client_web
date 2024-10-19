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
        },
    },
    plugins: [react()],
});
