// ── Client-side image preparation ───────────────────────────────────────
// Downscales uploaded images on the user's device before they are stored or
// sent: keeps sessionStorage small, keeps the analysis request light, and
// still gives the A4 share card (≤ ~480px wide, 2x capture) all the detail
// it needs. PNG stays PNG so transparency survives; everything else becomes
// a quality JPEG.

const DEFAULT_MAX_DIM = 1200;
const JPEG_QUALITY = 0.85;

export async function downscaleImage(
  dataUrl: string,
  maxDim: number = DEFAULT_MAX_DIM,
  quality: number = JPEG_QUALITY,
): Promise<string> {
  const sourceMime = mimeFromDataUrl(dataUrl);
  const img = await loadImage(dataUrl);

  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  if (longest <= maxDim) return dataUrl;

  const scale = maxDim / longest;
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);

  const outMime = sourceMime === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(outMime, outMime === "image/png" ? undefined : quality);
}

function mimeFromDataUrl(dataUrl: string): string {
  const m = /^data:([^;,]+);/.exec(dataUrl);
  return m?.[1] ?? "image/jpeg";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image could not be read."));
    img.src = src;
  });
}
