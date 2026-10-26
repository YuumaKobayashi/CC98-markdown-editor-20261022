import { normalizeUploadedFileUrl } from "./file-fragment";

/** Session-only original-file previews. Persisted Markdown keeps the server URL. */
export function createUploadedImagePreviews(api: Pick<typeof URL, "createObjectURL" | "revokeObjectURL"> = URL) {
  const previews = new Map<string, string>();
  const key = (url: string) => {
    const normalized = normalizeUploadedFileUrl(url);
    try { return new URL(normalized, "https://cc98.invalid/").href; }
    catch { return normalized; } // Editing an incomplete URL must not break the observer.
  };
  return {
    remember(url: string, file: File) {
      if (!file.type.startsWith("image/")) return;
      const id = key(url);
      const previous = previews.get(id);
      const preview = api.createObjectURL(file);
      previews.set(id, preview);
      if (previous) api.revokeObjectURL(previous);
    },
    get(url: string) { return previews.get(key(url)); },
    clear() {
      previews.forEach((url) => api.revokeObjectURL(url));
      previews.clear();
    },
  };
}

export type UploadedImagePreviews = ReturnType<typeof createUploadedImagePreviews>;
