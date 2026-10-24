export type SceneStatus = { phase: "loading" | "ready" | "retrying" | "failed"; generation: number; attempt: number };
type Scheduler = { set: (callback: () => void, ms: number) => unknown; clear: (id: unknown) => void };
const browserTimers: Scheduler = {
  set: (callback, ms) => setTimeout(callback, ms),
  clear: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
};
// Retry budgets reset only after sustained success, never as soon as a new canvas mounts.
export class SceneRecovery {
  state: SceneStatus = { phase: "loading", generation: 0, attempt: 0 };
  private notify: (state: SceneStatus) => void;
  private timers: Scheduler;
  private retry: unknown;
  private watchdog: unknown;
  private stable: unknown;
  private disposed = false;
  constructor(notify: (state: SceneStatus) => void, timers: Scheduler = browserTimers) {
    this.notify = notify; this.timers = timers;
  }
  private emit(state: SceneStatus) { this.state = state; this.notify(state); }
  private clear(id: unknown) { if (id !== undefined) this.timers.clear(id); }
  private watch() {
    const generation = this.state.generation;
    this.clear(this.watchdog);
    this.watchdog = this.timers.set(() => this.fail(generation), 45_000);
  }
  private scheduleRetry() {
    const { generation, attempt } = this.state;
    this.clear(this.retry);
    this.retry = this.timers.set(() => {
      if (this.disposed) return;
      this.emit({ ...this.state, phase: "loading", generation: generation + 1 });
      this.watch();
    }, attempt * 800);
  }
  start() {
    this.disposed = false;
    if (this.state.phase === "loading") this.watch();
    else if (this.state.phase === "retrying") this.scheduleRetry();
  }
  fail(generation: number) {
    if (this.disposed || generation !== this.state.generation || this.state.phase === "retrying" || this.state.phase === "failed") return false;
    this.clear(this.watchdog); this.clear(this.stable);
    if (this.state.attempt >= 2) {
      this.emit({ ...this.state, phase: "failed" });
    } else {
      const attempt = this.state.attempt + 1;
      this.emit({ ...this.state, phase: "retrying", attempt });
      this.scheduleRetry();
    }
    return true;
  }
  ready(generation: number) {
    if (this.disposed || generation !== this.state.generation || this.state.phase !== "loading") return false;
    this.clear(this.watchdog);
    this.emit({ ...this.state, phase: "ready" });
    this.stable = this.timers.set(() => {
      if (!this.disposed && this.state.phase === "ready") this.emit({ ...this.state, attempt: 0 });
    }, 10_000);
    return true;
  }
  dispose() {
    this.disposed = true;
    this.clear(this.retry); this.clear(this.watchdog); this.clear(this.stable);
  }
}
