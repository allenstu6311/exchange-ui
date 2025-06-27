import { WorkerRequest } from "@/types";

class WorkerClient {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL("@/workers/socketWorker.ts", import.meta.url),
      { type: "module" }
    );
  }

  postMessage({ type, url, param }: WorkerRequest) {
    this.worker.postMessage({
      type: type,
      url: url,
      param,
    });
  }

  subscribe(fn: (event: MessageEvent) => void) {
    this.worker.addEventListener("message", fn);
  }

  destroy(fn: (event: MessageEvent) => void) {
    this.worker.removeEventListener("message", fn);
  }
}

const worker = new WorkerClient();

export default worker;
