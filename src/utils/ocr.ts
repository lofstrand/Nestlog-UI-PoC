export type OcrProgress = {
  status: string;
  progress: number;
};

export type OcrResult = {
  text: string;
  confidence?: number;
};

type OcrOptions = {
  lang?: string;
  onProgress?: (p: OcrProgress) => void;
  preprocessImage?: boolean;
};

export async function ocrImageToText(
  image: string | File | Blob,
  opts: OcrOptions = {}
): Promise<OcrResult> {
  const { lang = "eng", onProgress, preprocessImage = true } = opts;
  const mod = await import("tesseract.js");
  const recognize = "recognize" in mod ? mod.recognize : (mod as any).default?.recognize;
  if (!recognize) throw new Error("tesseract.js recognize() not found");

  let input: string | File | Blob = image;
  if (preprocessImage && typeof input === "string" && input.startsWith("data:image/")) {
    const { preprocessImageDataUrlForOcr } = await import("@/utils/imagePreprocess");
    input = await preprocessImageDataUrlForOcr(input);
  }

  const result = await recognize(input, lang, {
    logger: (m: any) => {
      const progress = typeof m?.progress === "number" ? m.progress : 0;
      const status = typeof m?.status === "string" ? m.status : "working";
      onProgress?.({ status, progress });
    },
  });

  const text = result?.data?.text ?? "";
  const confidence =
    typeof result?.data?.confidence === "number" ? result.data.confidence : undefined;
  return { text, confidence };
}
