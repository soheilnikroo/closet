export type JobHandler = (payload: Record<string, unknown>) => Promise<void>;

export type InProcessJobQueue = {
  enqueue: (jobName: string, payload: Record<string, unknown>) => Promise<string>;
  register: (jobName: string, handler: JobHandler) => void;
};

export function createInProcessJobQueue(): InProcessJobQueue {
  const handlers = new Map<string, JobHandler>();
  let counter = 0;

  return {
    register(jobName, handler) {
      handlers.set(jobName, handler);
    },

    async enqueue(jobName, payload) {
      const id = `job_${Date.now()}_${counter++}`;
      const handler = handlers.get(jobName);

      if (!handler) {
        throw new Error(`No handler registered for job: ${jobName}`);
      }

      // Fire-and-forget with microtask; failures are handled inside handlers
      queueMicrotask(() => {
        void handler(payload).catch((error: unknown) => {
          console.error(`[queue] job ${jobName} failed`, error);
        });
      });

      return id;
    },
  };
}
