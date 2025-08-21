import { Page } from '@playwright/test';

interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

export class PerformancePage {

    readonly page: Page;
    readonly url = 'https://www.nenya.io/';

    constructor(page: Page) {
        this.page = page;
    }


    async navigate() {
        await this.page.goto(this.url, { waitUntil: 'networkidle' });
    }

    /*
  First Contentful Paint (FCP)
  
  Purpose: Measures the time from navigation to when the first meaningful content (text, image) is painted. Indicates perceived load speed.
  Why Useful: Reflects how quickly users see content; impacts first impressions.
  
  Good Threshold: < 1.8 seconds.
  
  
  getEntriesByType('paint')
  
  Purpose: Returns paint timing entries, such as First Paint (FP) and First Contentful Paint (FCP), which measure when the browser starts rendering and when meaningful content appears.
  Use Case: Assess visual rendering performance.
  Example Metrics:
  
  first-paint: Time when the first pixel is painted.
  first-contentful-paint: Time when meaningful content (e.g., text, images) is painted.
  
  getEntriesByType('resource')
  
  Purpose: Returns performance data for resources (e.g., images, scripts, CSS) loaded by the page, including fetch times, DNS lookup, and transfer sizes.
  Use Case: Identify slow-loading assets or network bottlenecks.
  Example Metrics:
  
  responseEnd - fetchStart: Total time to fetch a resource.
  transferSize: Size of the resource transferred.
  
  
  getEntriesByType('mark')
  
  Purpose: Returns custom performance marks set via performance.mark('name'), allowing you to track specific points in your application’s lifecycle.
  Use Case: Measure custom events, like the time taken for a specific JavaScript function or user interaction.
  Example: Mark the start and end of a critical operation and calculate duration.
  
  
  getEntriesByType('measure')
  
  Purpose: Returns custom performance measures created via performance.measure('name', 'startMark', 'endMark'), which calculate the time between two marks.
  Use Case: Measure the duration of specific processes, like rendering a component or executing a script.
  Example: Measure time between two custom marks for a specific workflow.
  
  
  getEntries()
  
  Purpose: Returns all performance entries (navigation, paint, resource, etc.) in the performance timeline, without filtering by type.
  Use Case: Analyze the entire performance timeline for comprehensive insights.
  Example: Retrieve all entries to filter specific metrics dynamically.
  
    */
    async getFCP(): Promise<number> {
        return this.page.evaluate(() => {
            const [entry] = performance.getEntriesByType('paint').filter(e => e.name === 'first-contentful-paint');
            return entry?.startTime || 0;
        });
    }


    /*
    Time to Interactive (TTI)
    
    Purpose: Measures the time until the page is fully interactive (DOM parsed, main thread idle). Indicates when users can engage with the page.
    Why Useful: Critical for user engagement and functionality.
    
    Good Threshold: < 3.8 seconds.
      */
    async getTTI(): Promise<number | null> {
        return this.page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return nav ? nav.domInteractive : null;
        });
    }

    /*
    Cumulative Layout Shift (CLS)
    
    Purpose: Quantifies unexpected layout shifts during page load, affecting visual stability. Sum of layout shift scores.
    Why Useful: Ensures a stable, non-disruptive user experience.
    
    Good Threshold: < 0.1.
      */
    async getCumulativeLayoutShift(): Promise<number> {
        return this.page.evaluate(() => {
            return new Promise(resolve => {
                let clsValue = 0;
                const observer = new PerformanceObserver(list => {
                    for (const entry of list.getEntries() as LayoutShift[]) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    resolve(clsValue);
                });
                observer.observe({ type: 'layout-shift', buffered: true });
                setTimeout(() => {
                    observer.disconnect();
                    resolve(clsValue);
                }, 2000);
            });
        });
    }
    /*
    Largest Contentful Paint (LCP)
    
    Purpose: Measures the time to render the largest content element (e.g., hero image, main text). Indicates main content visibility.
    Why Useful: Represents when the primary content is available to users.
    
    Good Threshold: < 2.5 seconds.
      */
    async getLCP(): Promise<number> {
        return this.page.evaluate(() => {
            const [entry] = performance.getEntriesByType('largest-contentful-paint') as LargestContentfulPaint[];
            return entry ? (entry.renderTime || entry.startTime) : 0;
        });
    }
    /*
    Total Blocking Time (TBT)
    
    Purpose: Measures the total time the main thread is blocked by long tasks (>50ms), preventing user interactions.
    Why Useful: Indicates responsiveness during page load.
    
    Good Threshold: < 300ms.
      */

    async getTBT(): Promise<number> {
        return this.page.evaluate(() => {
            let tbt = 0;
            const tasks = performance.getEntriesByType('longtask') as PerformanceEntry[];
            for (const task of tasks) {
                tbt += Math.max(0, task.duration - 50);
            }
            return tbt;
        });
    }
    /*
   Resource Load Times
   
   Purpose: Measures the time to load individual resources (e.g., images, scripts, CSS). Identifies slow assets.
   Why Useful: Pinpoints optimization opportunities for faster page loads.
   
   Good Threshold: Varies; aim for < 500ms per critical resource.
     */
    async getResourceLoadTimes(): Promise<{ name: string, duration: number }[]> {
        return this.page.evaluate(() => {
            return (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).map(entry => ({
                name: entry.name,
                duration: entry.responseEnd - entry.fetchStart,
            }));
        });
    }


    /*
    Page Load Time: Time from navigation start to load event end.
    */

    async getPageLoadTime(): Promise<number> {
        return this.page.evaluate(() => {
            const [navEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
            return navEntry ? navEntry.loadEventEnd - navEntry.startTime : 0;
        });
    }

}