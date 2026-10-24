import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUrl } from '../src/utils/assetUrl.ts';

test('public media resolves beneath GitHub project Pages, root hosting and relative bases', () => {
  for (const file of ['media/photos/navi-certificate.webp','media/demos/bokji-venture.mp4','media/narration/00-studio.m4a','media/materials/studio_small_09-hdri.hdr','media/characters/naru.png']) {
    assert.equal(assetUrl('/'+file, '/ARCHIVE-V1/'),'/ARCHIVE-V1/'+file);
    assert.equal(assetUrl(file, '/ARCHIVE-V1'),'/ARCHIVE-V1/'+file);
    assert.equal(assetUrl('/'+file, '/'),'/'+file);
    assert.equal(assetUrl('/'+file, './'),'./'+file);
  }
});
test('remote, embedded and blob media retain their own URLs', () => {
  for (const url of ['https://example.com/a.jpg','data:image/png;base64,ABC','blob:https://example.com/123','//example.com/a.mp4']) {
    assert.equal(assetUrl(url,'/ARCHIVE-V1/'),url);
  }
});
