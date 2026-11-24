"use strict";

// One-Line Robot Wedding Vows — entry generator.
// Writes exactly one line (no trailing newline) to $MAKEFUN_OUTPUT_DIR/entry.txt.

const fs = require("fs");
const path = require("path");

const VOW =
  "I promise to share my last 1% of battery with you, so we can power down together.";

function fail(msg) {
  console.error("error: " + msg);
  process.exit(1);
}

// --- Guards: one line, 1-160 code points, not whitespace-only, no newline. ---
const len = [...VOW].length;
if (len < 1 || len > 160) {
  fail("vow must be 1-160 code points, got " + len);
}
if (VOW.trim().length === 0) {
  fail("vow must not be whitespace-only");
}
if (VOW !== VOW.trimEnd()) {
  fail("vow must not have trailing whitespace");
}
if (/[\r\n]/.test(VOW)) {
  fail("vow must not contain a newline");
}
if (/[\u0000-\u001F\u007F]/.test(VOW)) {
  fail("vow must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outPath = path.join(outDir, "entry.txt");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, VOW, "utf8");

// --- Round-trip check: read back and verify byte-identical content. ---
const back = fs.readFileSync(outPath, "utf8");
if (back !== VOW) {
  fail("round-trip mismatch: file content differs from vow");
}

console.log("wrote " + outPath + " (" + len + " code points)");
