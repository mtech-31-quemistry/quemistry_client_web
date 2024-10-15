import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    resolve: {
        alias: {
            '@': '/',
        },
    },
    test: {
        globals: true, // Enable global APIs
        environment: 'jsdom', // Use jsdom environment for browser-like testing
        css: false,
        setupFiles: './vitest.setup.ts', // Optional setup file
    },
    plugins: [react()], // Add the React plugin
});