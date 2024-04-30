class CPUSimulator {

  simulateHighCPU(ds: number): Promise<unknown> {
    return new Promise<void>(resolve => {
      const endTime = Date.now() + ds * 1000;
      const intervalId = setInterval(() => {
        if (Date.now() >= endTime) {
          clearInterval(intervalId);
          resolve();
        }
        // Simulate CPU-intensive task
        let result = 0;
        for (let i = 0; i < 100000; i++) {
          // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
          result += Math.random();
        }
      }, 0);
    });
  }

}

export class SimUtils {

  public static async cpuUsage(sec: number): Promise<void> {
    const sim = new CPUSimulator();
    await sim.simulateHighCPU(sec);
  }

}
