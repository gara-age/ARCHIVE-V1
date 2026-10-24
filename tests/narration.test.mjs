import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { claimPlayback, NarrationPlayback } from '../src/media/playback.ts';
import { sectionNarrations, projectNarrations, narrationFor } from '../src/data/narrations.ts';

function media(tagName='AUDIO') {
  return { tagName, currentTime: 0, paused: true, ended: false, src: '', loads: 0, plays: 0,
    pause() { this.paused=true; }, load() { this.loads++; },
    async play() { this.paused=false; this.plays++; },
  };
}
test('all 11 supplied narrations map to the correct section or project and valid packaged M4A', () => {
  assert.equal(Object.keys(sectionNarrations).length,9);
  assert.equal(Object.keys(projectNarrations).length,2);
  for (const track of [...Object.values(sectionNarrations),...Object.values(projectNarrations)]) {
    const path='public'+track.src; assert.ok(existsSync(path));
    const buffer=readFileSync(path); assert.equal(buffer.toString('ascii',4,8),'ftyp');
    assert.ok(buffer.length>10000);
  }
  assert.equal(narrationFor('works','bokji').src,'/media/narration/01-bokji.m4a');
  assert.equal(narrationFor('works','navi').src,'/media/narration/01-navi.m4a');
  assert.equal(narrationFor('skills').src,'/media/narration/04-experience.m4a');
  assert.equal(narrationFor('unknown'),undefined);
});
test('playing video stops and rewinds narration while pausing other videos in place', () => {
  const narration=media(), video=media('VIDEO'), other=media('VIDEO');
  narration.currentTime=12;other.currentTime=25; narration.paused=other.paused=false;
  claimPlayback(video,[narration,video,other]);
  assert.equal(narration.paused,true);assert.equal(narration.currentTime,0);
  assert.equal(other.paused,true);assert.equal(other.currentTime,25);
});
test('playing narration pauses video without losing video position', () => {
  const narration=media(),video=media('VIDEO');video.currentTime=36;video.paused=false;
  claimPlayback(narration,[narration,video]);
  assert.equal(video.paused,true);assert.equal(video.currentTime,36);
});
test('A → B → A restarts audio every visit, with no once-only playback flag', async () => {
  const node=media();const player=new NarrationPlayback(node,()=>assert.fail('unexpected block'));
  player.visit('A');node.currentTime=20;
  player.visit('B');assert.equal(node.currentTime,0);assert.equal(node.src,'B');node.currentTime=9;
  player.visit('A');assert.equal(node.src,'A');assert.equal(node.currentTime,0);
  assert.equal(node.loads,3);assert.equal(node.plays,3);
  player.stop();assert.equal(node.paused,true);assert.equal(node.currentTime,0);
  await player.play();assert.equal(node.plays,3);
});
test('manual pause preserves time, and replay after ending starts from zero', async () => {
  const node=media();const player=new NarrationPlayback(node,()=>{});player.visit('A');
  node.currentTime=8;player.toggle();assert.equal(node.paused,true);assert.equal(node.currentTime,8);
  player.toggle();assert.equal(node.paused,false);assert.equal(node.currentTime,8);
  node.ended=true;node.paused=true;player.toggle();assert.equal(node.currentTime,0);
});
test('autoplay rejection is recoverable and stale rejection cannot affect a new visit', async () => {
  const node=media();let rejects;let blocked=0;
  node.play=()=>new Promise((_,reject)=>{rejects=reject;});
  const player=new NarrationPlayback(node,()=>blocked++);
  player.visit('A');const oldReject=rejects;player.visit('B');
  oldReject(new Error('aborted old track'));await Promise.resolve();assert.equal(blocked,0);
  rejects(new Error('autoplay denied'));await Promise.resolve();assert.equal(blocked,1);
  node.play=async()=>{node.paused=false;};player.toggle();assert.equal(node.paused,false);
});
test('cleanup preserves duration and keeps peaks below clipping for every recording', () => {
  const report=JSON.parse(readFileSync('docs/narration-processing.json','utf8'));
  assert.equal(report.length,11);
  for(const file of report) {
    assert.ok(file.duration>5);assert.ok(file.peakAfterDb<=-1);
    assert.ok(file.quietWindowChangeDb<0);assert.match(file.sha256,/^[a-f0-9]{64}$/);
  }
});
