import { test as base } from '@playwright/test';

// Global setup/teardown
base.beforeAll(async () => {
    console.log('Before all tests');
});

base.afterAll(async () => {
    console.log('After all tests');
});

export const test = base.extend<{}, { setup: void; teardown: void }>({
    // Before each test
    setup: [
        async ({ page }, use) => {
            await page.goto('https://example.com');
            console.log('Before each test');
            await use();
        },
        { scope: 'test', auto: true },
    ],
    // After each test
    teardown: [
        async ({ page }, use) => {
            console.log('After each test');
            await use();
        },
        { scope: 'test', auto: true },
    ],
});

/*
hooks from a file

certain hooks from a file



hooks in a certain case, might be the same as pt2



*/