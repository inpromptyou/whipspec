// Server-side image compression using sharp-compatible approach
// For now: validate, resize via canvas on client, store as optimized base64

export function validateImage(file: File): string | null {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB raw upload limit
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!ALLOWED.includes(file.type)) return "Only JPEG, PNG, WebP, and GIF images are allowed";
  if (file.size > MAX_SIZE) return "Image must be under 10MB";
  return null;
}

// Client-side compression before upload
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

// Compress avatar (smaller)
export async function compressAvatar(file: File): Promise<Blob> {
  return compressImage(file, 400, 0.85);
}
