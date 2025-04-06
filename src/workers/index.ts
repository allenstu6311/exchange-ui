const worker = new Worker(new URL('@/workers/socketWorker.ts', import.meta.url), { type: 'module' });

export default worker;
