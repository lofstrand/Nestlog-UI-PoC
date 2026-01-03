type PreprocessOptions = {
  contrast?: number;
  maxDimension?: number;
};

const clamp8 = (n: number) => Math.max(0, Math.min(255, n));

export async function preprocessImageDataUrlForOcr(
  dataUrl: string,
  opts: PreprocessOptions = {}
): Promise<string> {
  if (typeof window === "undefined") return dataUrl;
  if (!dataUrl.startsWith("data:image/")) return dataUrl;

  const contrast = opts.contrast ?? 70;
  const maxDimension = opts.maxDimension ?? 1600;

  const img = new Image();
  img.decoding = "async";
  img.src = dataUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image for OCR preprocessing"));
  });

  const ratio = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const d = imageData.data;

  // Contrast factor: https://stackoverflow.com/a/10551953
  const c = Math.max(-255, Math.min(255, contrast));
  const factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    // Luma grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const adj = factor * (gray - 128) + 128;
    const v = clamp8(adj);

    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    // alpha stays
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png", 0.92);
}

