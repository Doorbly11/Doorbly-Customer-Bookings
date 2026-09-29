/**
 * Utility for compressing image Files or Data URLs to lightweight WebP/JPEG formats.
 * Prevents LocalStorage QuotaExceededError by keeping images under 50-90KB.
 */

export async function compressImage(
  source: File | string,
  maxWidth = 1280,
  maxHeight = 720,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's already an external HTTP/HTTPS URL or absolute path, no compression needed
    if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('/'))) {
      resolve(source);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          if (typeof source === 'string') resolve(source);
          else {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(source);
          }
          return;
        }

        // Calculate aspect-ratio constrained dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (typeof source === 'string') resolve(source);
          else {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(source);
          }
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let result = '';
        try {
          result = canvas.toDataURL('image/webp', quality);
          if (!result.startsWith('data:image/webp')) {
            result = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          result = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(result);
      } catch (err) {
        console.warn('Canvas compression failed, falling back to original:', err);
        if (typeof source === 'string') resolve(source);
        else {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(source);
        }
      }
    };

    img.onerror = () => {
      if (typeof source !== 'string') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(source);
      } else {
        resolve(source);
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
