import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/process-logo.mjs <input.png>')
  process.exit(1)
}

const outDir = path.join(process.cwd(), 'public', 'images', 'brand')
await fs.mkdir(outDir, { recursive: true })

const base = sharp(input).ensureAlpha()
const { data, info } = await base.raw().toBuffer({ resolveWithObject: true })

// Remove light, low-chroma background with soft alpha falloff.
const out = Buffer.from(data)
for (let i = 0; i < out.length; i += 4) {
  const r = out[i]
  const g = out[i + 1]
  const b = out[i + 2]
  const a = out[i + 3]

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = (max - min) / 255 // 0..1
  const brightness = (r + g + b) / (3 * 255) // 0..1

  // Background heuristic: very bright + low chroma
  const bgScore = (brightness - 0.70) * (0.20 - chroma) // higher = more likely bg

  if (brightness > 0.92 && chroma < 0.08) {
    out[i + 3] = 0
    continue
  }

  if (bgScore > 0) {
    // Soft fade for near-background pixels
    // Map brightness 0.70..0.92 to fade 1..0
    const t = Math.min(Math.max((brightness - 0.70) / (0.92 - 0.70), 0), 1)
    // Stronger fade when chroma is low
    const chromaBoost = Math.min(Math.max((0.20 - chroma) / 0.20, 0), 1)
    const fade = 1 - t * chromaBoost
    out[i + 3] = Math.round(a * fade)
  }
}

const markPath = path.join(outDir, 'yenikule-mark.png')
await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(markPath)

// App icons
const icon192 = path.join(process.cwd(), 'public', 'icon-192.png')
const icon512 = path.join(process.cwd(), 'public', 'icon-512.png')

await sharp(markPath)
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(icon192)

await sharp(markPath)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(icon512)

// Favicon
const faviconPng = await sharp(markPath)
  .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

const ico = await pngToIco(faviconPng)
await fs.writeFile(path.join(process.cwd(), 'src', 'app', 'favicon.ico'), ico)

console.log('Created:', markPath)
console.log('Created:', icon192)
console.log('Created:', icon512)
console.log('Updated: src/app/favicon.ico')
