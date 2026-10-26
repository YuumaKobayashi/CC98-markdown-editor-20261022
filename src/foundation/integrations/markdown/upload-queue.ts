/** A queue belongs to one document. Invalidating it never clears a later queue. */
export function createUploadQueue(options: {
  upload: (file: File) => Promise<string>;
  insert: (file: File, url: string) => void;
  start?: () => void;
  finish?: (failed: string[]) => void;
}) {
  const files: File[] = [];
  let valid = true;
  let running: Promise<void> | null = null;
  let started = false;
  let finished = false;
  const finish = (failed: string[]) => {
    if (finished || !started) return;
    finished = true;
    options.finish?.(failed);
  };
  const drain = async () => {
    if (!valid) { running = null; return; }
    const failed: string[] = [];
    try {
      started = true;
      finished = false;
      options.start?.();
      while (valid && files.length) {
        const file = files.shift()!;
        try {
          const url = await options.upload(file);
          if (!valid) break;
          if (!url) throw new Error("上传没有返回有效地址");
          options.insert(file, url);
        } catch {
          if (valid) failed.push(file.name);
        }
      }
    } finally {
      running = null;
      finish(valid ? failed : []);
    }
  };
  return {
    enqueue(batch: File[]): Promise<void> {
      if (!valid || batch.length === 0) return Promise.resolve();
      files.push(...batch);
      if (!running) running = Promise.resolve().then(drain);
      return running;
    },
    invalidate() {
      valid = false;
      files.length = 0;
      // Close the old document's progress even if its transport never settles.
      finish([]);
    },
  };
}
