import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const jobs = [
  ["design/icon-source.svg", "public/icons/icon-192.png", 192],
  ["design/icon-source.svg", "public/icons/icon-512.png", 512],
  ["design/icon-source.svg", "public/icons/apple-touch-icon.png", 180],
  ["design/icon-source.svg", "public/favicon-32.png", 32],
  ["design/icon-source.svg", "public/favicon-16.png", 16],
  ["design/icon-maskable.svg", "public/icons/icon-maskable-192.png", 192],
  ["design/icon-maskable.svg", "public/icons/icon-maskable-512.png", 512],
];

for (const [src, out, size] of jobs) {
  await sharp(src, { density: 384 }).resize(size, size).png().toFile(out);
  console.log("wrote", out);
}
