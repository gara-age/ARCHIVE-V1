import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { photos } from "../src/data/photos.ts";
import { demos } from "../src/data/demos.ts";

test("every demo has real packaged video and poster files with streamable H.264 MP4 layout", () => {
  for (const demo of demos) {
    assert.ok(existsSync(resolve("public", demo.poster.slice(1))));
    const buffer = readFileSync(resolve("public", demo.src.slice(1)));
    const atoms = [];
    let offset = 0;
    while (offset + 8 <= buffer.length) {
      let size = buffer.readUInt32BE(offset);
      const type = buffer.toString("ascii", offset + 4, offset + 8);
      if (size === 1) size = Number(buffer.readBigUInt64BE(offset + 8));
      if (size === 0) size = buffer.length - offset;
      assert.ok(
        size >= 8 && offset + size <= buffer.length,
        `${demo.id}: valid ${type} atom`,
      );
      atoms.push(type);
      offset += size;
    }
    assert.ok(atoms.includes("ftyp"));
    assert.ok(atoms.includes("moov"));
    assert.ok(atoms.includes("mdat"));
    assert.ok(
      atoms.indexOf("moov") < atoms.indexOf("mdat"),
      `${demo.id}: metadata before video for streaming`,
    );
    assert.ok(
      buffer.includes(Buffer.from("avc1")),
      `${demo.id}: H.264 browser-compatible video`,
    );
  }
});

test("selected photographs have complete previews and full-size web images", () => {
  assert.equal(photos.length, 4);
  for (const photo of photos) {
    for (const asset of [photo.src, photo.full]) {
      const bytes = readFileSync(resolve("public", asset.slice(1)));
      assert.ok(bytes.length > 1000);
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.ok(photo.alt.length > 10);
    assert.ok(photo.caption.length > 5);
  }
});

test("PBR materials and HDR lighting ship locally with complete source records", () => {
  const root = resolve("public/media/materials");
  const sources = JSON.parse(readFileSync(resolve(root, "sources.json"), "utf8"));
  assert.equal(sources.length, 5);
  for (const source of sources) {
    assert.equal(source.license, "CC0");
    assert.ok(source.source.startsWith("https://polyhaven.com/a/"));
    if (source.asset !== "studio_small_09") {
      for (const kind of ["diffuse", "nor_gl", "roughness"]) {
        assert.ok(source.files.some((file) => file.file === `${source.asset}-${kind}.jpg`));
      }
    }
    for (const file of source.files) {
      const bytes = readFileSync(resolve(root, file.file));
      assert.equal(bytes.length, file.bytes);
      if (file.file.endsWith(".jpg")) assert.equal(bytes.readUInt16BE(0), 0xffd8);
      else assert.ok(bytes.toString("ascii", 0, 64).includes("RADIANCE"));
    }
  }
});
