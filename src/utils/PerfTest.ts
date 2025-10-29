// CRITICAL PERFORMANCE DIAGNOSTIC TOOL
// This will help us find EXACTLY where the slowdown is happening

export class PerfTest {
  private static measurements: Map<string, number[]> = new Map();

  static start(label: string): number {
    return performance.now();
  }

  static end(label: string, startTime: number): void {
    const duration = performance.now() - startTime;

    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }

    const measurements = this.measurements.get(label)!;
    measurements.push(duration);

    // Keep only last 60 measurements (1 second at 60 FPS)
    if (measurements.length > 60) {
      measurements.shift();
    }

    // If this operation took > 10ms, log it immediately
    if (duration > 10) {
      console.error(`🚨 SLOW OPERATION: ${label} took ${duration.toFixed(2)}ms`);
    }
  }

  static report(): void {
    console.error('📊 PERFORMANCE REPORT:');

    for (const [label, measurements] of this.measurements.entries()) {
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const max = Math.max(...measurements);

      if (avg > 5 || max > 15) {
        console.error(`  ${label}:`);
        console.error(`    Avg: ${avg.toFixed(2)}ms`);
        console.error(`    Max: ${max.toFixed(2)}ms`);
        console.error(`    Samples: ${measurements.length}`);
      }
    }
  }
}
