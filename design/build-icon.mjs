import { writeFileSync } from "node:fs";

const deg = (d) => (d * Math.PI) / 180;
const pt = (r, thetaDeg) => [r * Math.cos(deg(thetaDeg)), r * Math.sin(deg(thetaDeg))];
const fmt = (n) => Math.round(n * 100) / 100;

// Builds one "exchange" arrow: an arc from startDeg to endDeg (sweeping through midDeg),
// with a triangular arrowhead at the end, as a single filled shape (arc band + arrowhead).
function arrow({ rOuter, rInner, startDeg, endDeg, headWidthDeg, headLenExtra, sweepFlag }) {
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

  const outerStart = pt(rOuter, startDeg);
  const outerEndBase = pt(rOuter, endDeg - headWidthDeg * Math.sign(endDeg - startDeg || 1));
  const innerStart = pt(rInner, startDeg);
  const innerEndBase = pt(rInner, endDeg - headWidthDeg * Math.sign(endDeg - startDeg || 1));

  const mid = (rOuter + rInner) / 2;
  const tip = pt(mid + headLenExtra, endDeg);
  const headOuter = pt(rOuter + headLenExtra * 0.35, endDeg - headWidthDeg * Math.sign(endDeg - startDeg || 1));
  const headInner = pt(rInner - headLenExtra * 0.35, endDeg - headWidthDeg * Math.sign(endDeg - startDeg || 1));

  const d = [
    `M ${fmt(outerStart[0])} ${fmt(outerStart[1])}`,
    `A ${rOuter} ${rOuter} 0 ${large} ${sweepFlag} ${fmt(outerEndBase[0])} ${fmt(outerEndBase[1])}`,
    `L ${fmt(headOuter[0])} ${fmt(headOuter[1])}`,
    `L ${fmt(tip[0])} ${fmt(tip[1])}`,
    `L ${fmt(headInner[0])} ${fmt(headInner[1])}`,
    `L ${fmt(innerEndBase[0])} ${fmt(innerEndBase[1])}`,
    `A ${rInner} ${rInner} 0 ${large} ${1 - sweepFlag} ${fmt(innerStart[0])} ${fmt(innerStart[1])}`,
    "Z",
  ].join(" ");
  return d;
}

// Top arrow: sits in upper half, points LEFT (toward decreasing x), arcing over the top.
// Sweep from upper-right (-25deg) to upper-left (-155deg) through the top (-90deg).
const topArrowD = arrow({
  rOuter: 178,
  rInner: 146,
  startDeg: -20,
  endDeg: -165,
  headWidthDeg: 16,
  headLenExtra: 34,
  sweepFlag: 0,
});

// Bottom arrow: sits in lower half, points RIGHT, arcing under the bottom.
const bottomArrowD = arrow({
  rOuter: 178,
  rInner: 146,
  startDeg: 160,
  endDeg: 15,
  headWidthDeg: 16,
  headLenExtra: 34,
  sweepFlag: 0,
});

function coin() {
  return `
    <circle r="112" fill="#ffb92e" stroke="#0b0e18" stroke-width="15"/>
    <text x="0" y="40" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="132" fill="#0b0e18" text-anchor="middle">$</text>
  `;
}

function buildSvg({ bg, scale, rounded }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  ${rounded ? `<defs><clipPath id="r"><rect width="512" height="512" rx="110"/></clipPath></defs>` : ""}
  <g ${rounded ? 'clip-path="url(#r)"' : ""}>
    <rect width="512" height="512" fill="${bg}"/>
    <g transform="translate(256 256) scale(${scale})">
      <path d="${topArrowD}" fill="#7fb8ff" stroke="#0b0e18" stroke-width="10" stroke-linejoin="round"/>
      <path d="${bottomArrowD}" fill="#57d98d" stroke="#0b0e18" stroke-width="10" stroke-linejoin="round"/>
      ${coin()}
    </g>
  </g>
</svg>`;
}

writeFileSync("design/icon-source.svg", buildSvg({ bg: "#101425", scale: 1, rounded: true }));
writeFileSync("design/icon-maskable.svg", buildSvg({ bg: "#101425", scale: 0.72, rounded: false }));
console.log("done");
