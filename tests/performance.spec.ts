import { test, expect } from '@playwright/test';
import { PerformancePage } from '../pages/PerformancePage';

test.describe('Performance Metrics Tests', () => {
    let perfPage: PerformancePage;

    test.beforeEach(async ({ page }) => {
        perfPage = new PerformancePage(page);
        await perfPage.navigate();
    });

    test('First Contentful Paint (FCP)', async () => {
        const fcp = await perfPage.getFCP();
        expect(fcp).toBeLessThan(1800); // FCP < 1.8 seconds
        console.log(`FCP: ${fcp}ms`);
    });

    test('Time to Interactive (TTI)', async () => {
        const tti = await perfPage.getTTI();
        expect(tti).not.toBeNull();
        expect(tti).toBeLessThan(3800); // TTI < 3.8 seconds
        console.log(`TTI: ${tti}ms`);
    });

    test('Cumulative Layout Shift (CLS)', async () => {
        const cls = await perfPage.getCumulativeLayoutShift();
        expect(cls).toBeLessThan(0.3); // CLS < 0.3
        console.log(`CLS: ${cls}`);
    });

    test('Largest Contentful Paint (LCP)', async () => {
        const lcp = await perfPage.getLCP();
        expect(lcp).toBeLessThan(2500); // LCP < 2.5 seconds
        console.log(`LCP: ${lcp}ms`);
    });

    test('Total Blocking Time (TBT)', async () => {
        const tbt = await perfPage.getTBT();
        expect(tbt).toBeLessThan(300); // TBT < 300ms
        console.log(`TBT: ${tbt}ms`);
    });

    test('Resource Load Times', async () => {
        const resources = await perfPage.getResourceLoadTimes();
        resources.forEach(resource => {
            expect(resource.duration).toBeLessThan(1000); // Each resource < 1000ms
            console.log(`Resource: ${resource.name}, Load Time: ${resource.duration}ms`);
        });
    });

    test('Page Load Time', async () => {
        const loadTime = await perfPage.getPageLoadTime();
        expect(loadTime).toBeLessThan(3000); // Page Load Time < 3 seconds
        console.log(`Page Load Time: ${loadTime}ms`);
    });
});