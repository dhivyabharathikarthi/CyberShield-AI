import { BoundingBox, PrivacyFinding, RedactionMode } from '../types/analysisTypes';

export interface RedactionOptions {
  mode: RedactionMode;
  customBoxes?: BoundingBox[];
  includeLabel?: boolean;
}

export async function createRedactedImage(
  imageSource: HTMLImageElement | string,
  findings: PrivacyFinding[],
  options: RedactionOptions = { mode: 'blackout', includeLabel: true }
): Promise<string> {
  const img = await resolveImageElement(imageSource);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Could not obtain 2D rendering context for screenshot redaction.');
  }

  // Draw original image onto canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Collect all active bounding boxes
  const activeFindings = findings.filter(f => f.enabledForRedaction !== false);
  const boxesToRedact: { box: BoundingBox; label: string }[] = [];

  for (const f of activeFindings) {
    boxesToRedact.push({ box: f.boundingBox, label: f.type });
  }

  if (options.customBoxes) {
    for (const b of options.customBoxes) {
      boxesToRedact.push({ box: b, label: b.label || 'Manual Redaction' });
    }
  }

  for (const item of boxesToRedact) {
    const { box, label } = item;
    // Calculate pixel coordinates from percentages (0-100)
    const pxX = Math.round((box.x / 100) * canvas.width);
    const pxY = Math.round((box.y / 100) * canvas.height);
    const pxW = Math.round((box.width / 100) * canvas.width);
    const pxH = Math.round((box.height / 100) * canvas.height);

    // Padding margin of 2px
    const x = Math.max(0, pxX - 2);
    const y = Math.max(0, pxY - 2);
    const w = Math.min(canvas.width - x, pxW + 4);
    const h = Math.min(canvas.height - y, pxH + 4);

    if (w <= 0 || h <= 0) continue;

    if (options.mode === 'blackout') {
      applyBlackout(ctx, x, y, w, h, label, options.includeLabel);
    } else if (options.mode === 'pixelate') {
      applyPixelate(ctx, x, y, w, h);
    } else if (options.mode === 'blur') {
      applyBlur(ctx, x, y, w, h);
    }
  }

  return canvas.toDataURL('image/png');
}

function applyBlackout(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  includeLabel = true
) {
  ctx.save();
  ctx.fillStyle = '#090D16';
  ctx.fillRect(x, y, w, h);

  // Subtle border outline
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  // Redacted badge text if space permits
  if (includeLabel && w > 45 && h > 18) {
    const fontSize = Math.max(10, Math.min(13, Math.floor(h * 0.45)));
    ctx.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw small padlock or label
    const text = w > 120 ? `[REDACTED: ${label}]` : '[REDACTED]';
    ctx.fillText(text, x + w / 2, y + h / 2, w - 8);
  }
  ctx.restore();
}

function applyPixelate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  try {
    const pixelSize = Math.max(8, Math.floor(Math.min(w, h) / 6));
    const imgData = ctx.getImageData(x, y, w, h);
    const data = imgData.data;

    for (let py = 0; py < h; py += pixelSize) {
      for (let px = 0; px < w; px += pixelSize) {
        // Average color in the block
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < pixelSize && py + dy < h; dy++) {
          for (let dx = 0; dx < pixelSize && px + dx < w; dx++) {
            const idx = ((py + dy) * w + (px + dx)) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Fill the block with the averaged color
        for (let dy = 0; dy < pixelSize && py + dy < h; dy++) {
          for (let dx = 0; dx < pixelSize && px + dx < w; dx++) {
            const idx = ((py + dy) * w + (px + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
        }
      }
    }
    ctx.putImageData(imgData, x, y);
    
    // Subtle border
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  } catch (err) {
    // Fallback to blackout if pixel access is blocked
    applyBlackout(ctx, x, y, w, h, 'REDACTED', false);
  }
}

function applyBlur(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.filter = 'blur(16px)';
  // Draw canvas onto itself with blur filter inside clipped region
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Overlay a slight tinted glass to guarantee complete illegibility
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function resolveImageElement(source: HTMLImageElement | string): Promise<HTMLImageElement> {
  if (typeof source !== 'string') {
    if (source.complete && source.naturalWidth > 0) {
      return Promise.resolve(source);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load screenshot into redaction canvas.'));
    img.src = typeof source === 'string' ? source : source.src;
  });
}
