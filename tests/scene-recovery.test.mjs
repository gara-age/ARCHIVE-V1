import test from 'node:test';
import assert from 'node:assert/strict';
import { SceneRecovery } from '../src/experience/sceneRecovery.ts';
function clock() {
  let time=0,id=0;const tasks=new Map();
  return {
    set(callback,delay) { const key=++id;tasks.set(key,{at:time+delay,callback});return key; },
    clear(key) { tasks.delete(key); },
    advance(ms) {
      const end=time+ms;
      while(true) {
        const due=[...tasks].filter(([,task])=>task.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];
        if(!due) break;
        time=due[1].at;tasks.delete(due[0]);due[1].callback();
      }
      time=end;
    },
  };
}
test('a transient failure remounts 3D first and returns to ready', () => {
  const timers=clock(),events=[];const r=new SceneRecovery(s=>events.push(s.phase),timers);r.start();
  assert.equal(r.fail(0),true);assert.equal(r.state.phase,'retrying');
  timers.advance(799);assert.equal(r.state.generation,0);
  timers.advance(1);assert.equal(r.state.generation,1);assert.equal(r.state.phase,'loading');
  assert.equal(r.ready(1),true);assert.equal(r.state.phase,'ready');
  assert.deepEqual(events,['retrying','loading','ready']);r.dispose();
});
test('duplicate context/error events and stale warmup completions cannot interfere with recovery', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();r.fail(0);
  assert.equal(r.fail(0),false);assert.equal(r.ready(0),false);assert.equal(r.state.attempt,1);
  timers.advance(800);assert.equal(r.ready(0),false);assert.equal(r.fail(0),false);
  assert.equal(r.ready(1),true);r.dispose();
});
test('rapid recurring failures exhaust exactly two automatic retries', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();r.ready(0);r.fail(0);
  timers.advance(800);r.ready(1);r.fail(1);
  timers.advance(1600);r.ready(2);r.fail(2);
  assert.equal(r.state.phase,'failed');assert.equal(r.state.attempt,2);
  timers.advance(60000);assert.equal(r.state.generation,2);assert.equal(r.fail(2),false);r.dispose();
});
test('only sustained successful rendering renews the retry budget', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();r.fail(0);
  timers.advance(800);r.ready(1);timers.advance(9999);assert.equal(r.state.attempt,1);
  timers.advance(1);assert.equal(r.state.attempt,0);
  r.fail(1);assert.equal(r.state.attempt,1);r.dispose();
});
test('a hung initialization times out and cannot leave an endless loading screen', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();
  timers.advance(45000);assert.equal(r.state.phase,'retrying');
  timers.advance(800+45000+1600+45000);assert.equal(r.state.phase,'failed');r.dispose();
});
test('unmount cancels pending retries and ignores late callbacks', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();r.fail(0);r.dispose();
  timers.advance(100000);assert.equal(r.state.generation,0);assert.equal(r.ready(0),false);
});
test('strict-mode effect cleanup/setup rearms an interrupted retry', () => {
  const timers=clock(),r=new SceneRecovery(()=>{},timers);r.start();r.fail(0);r.dispose();r.start();
  timers.advance(800);assert.equal(r.state.phase,'loading');assert.equal(r.state.generation,1);r.dispose();
});
