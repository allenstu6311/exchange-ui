class WorkerClient {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL("@/workers/socketWorker.ts", import.meta.url),
      { type: "module" }
    );
  }

  postMessage({ type, url }) {
    worker.postMessage({
      type: type,
      url: url,
    });
  }

  subscribe(fn: Function) {
    this.worker.addEventListener("message", fn);
  }

  destory(fn: Function) {
    this.worker.removeEventListener("message", fn);
  }
}

const worker = new Worker(
  new URL("@/workers/socketWorker.ts", import.meta.url),
  { type: "module" }
);

export default worker;
