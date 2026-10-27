import test from 'node:test';
import assert from 'node:assert/strict';
import { applyMediaSound } from '../src/media/sound.ts';
import { useSoundStore } from '../src/media/useSoundStore.ts';

test('master sound OFF mutes both audio and video without pausing or resetting time', () => {
 const media=[{muted:false,currentTime:12,paused:false},{muted:false,currentTime:24,paused:false}];
 applyMediaSound(media,false);
 assert.ok(media.every(m=>m.muted));assert.deepEqual(media.map(m=>m.currentTime),[12,24]);
 assert.ok(media.every(m=>m.paused===false));
 applyMediaSound(media,true);assert.ok(media.every(m=>!m.muted));
});
test('newly mounted media inherit the same OFF preference', () => {
 const added=[{muted:false}];applyMediaSound(added,false);assert.equal(added[0].muted,true);
});
test('one shared sound preference toggles globally and starts ON for studio audio', () => {
 assert.equal(useSoundStore.getState().enabled,true);
 useSoundStore.getState().toggle();assert.equal(useSoundStore.getState().enabled,false);
 useSoundStore.getState().toggle();assert.equal(useSoundStore.getState().enabled,true);
});
