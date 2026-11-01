export type JobQueue = {
  enqueue: (jobName: string, payload: Record<string, unknown>) => Promise<string>;
};

export function createStubJobQueue(): JobQueue {
  return {
    async enqueue() {
      throw new Error("Job queue is not configured yet");
    },
  };
}

export {
  createInProcessJobQueue,
  type InProcessJobQueue,
  type JobHandler,
} from "@/infrastructure/queue/in-process-queue.js";
