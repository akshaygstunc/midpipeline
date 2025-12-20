export class PerformanceMonitor {
  private fpsBuffer: number[] = [];
  private frameCount = 0;
  private lastTime = performance.now();
  private inferenceTimes: number[] = [];
  private readonly bufferSize = 10;

  updateFrame() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      const fps = (this.frameCount * 1000) / elapsed;
      this.fpsBuffer.push(fps);
      if (this.fpsBuffer.length > this.bufferSize) {
        this.fpsBuffer.shift();
      }
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  recordInferenceTime(time: number) {
    this.inferenceTimes.push(time);
    if (this.inferenceTimes.length > this.bufferSize) {
      this.inferenceTimes.shift();
    }
  }

  getFPS(): number {
    if (this.fpsBuffer.length === 0) return 0;
    const sum = this.fpsBuffer.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsBuffer.length);
  }

  getAverageInferenceTime(): number {
    if (this.inferenceTimes.length === 0) return 0;
    const sum = this.inferenceTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.inferenceTimes.length);
  }

  getStats() {
    return {
      fps: this.getFPS(),
      inferenceTime: this.getAverageInferenceTime(),
      frameBufferSize: this.fpsBuffer.length
    };
  }
}